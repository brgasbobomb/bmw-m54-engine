// npm run shot -- <view> [--only <part-id>] [--focus <part-id> [--zoom N]] [--run]  (--run: Run engine ticked)  ->  shots/<view>.png
import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
// camera direction from the engine centre; +X = front, -Z = car's left (intake) on screen
const VIEWS = {
  start: null,
  intake: [0, 0.2, -1],
  exhaust: [0, 0.2, 1],
  front: [1, 0.15, 0],
  rear: [-1, 0.15, 0],
  top: [0.001, 1, 0],
  below: [0.001, -1, 0],
  explode: null,
};
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg' };

const args = process.argv.slice(2);
const oi = args.indexOf('--only');
const only = oi >= 0 ? args.splice(oi, 2)[1] : null;
const fi = args.indexOf('--focus');
const focus = fi >= 0 ? args.splice(fi, 2)[1] : null;
const zi = args.indexOf('--zoom');
const zoom = zi >= 0 ? Number(args.splice(zi, 2)[1]) : 3;
const ri = args.indexOf('--run'), run = ri >= 0 && !!args.splice(ri, 1);
const view = args[0];
if (!(view in VIEWS)) { console.error('usage: npm run shot -- <' + Object.keys(VIEWS).join('|') + '> [--only <part-id>]'); process.exit(1); }

const server = http.createServer(async (req, res) => {
  try {
    const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    const file = join(ROOT, p.endsWith('/') ? p + 'index.html' : p);
    if (!file.startsWith(ROOT)) throw 0;
    res.setHeader('Content-Type', MIME[extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.statusCode = 404; res.end(); }
}).listen(0);
await new Promise(r => server.once('listening', r));

const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on('pageerror', e => console.error('page error:', e.message));
const loaded = page.waitForEvent('console', { predicate: m => m.text().includes('Application loaded'), timeout: 60000 });
await page.goto(`http://localhost:${server.address().port}/index.html`);
await loaded;

if (only) await page.evaluate(id => window.__shot.isolate(id), only);
if (run) await page.evaluate(() => { document.getElementById('run-toggle').checked = true; });
if (view === 'explode') await page.evaluate(() => {
  const s = document.getElementById('explode-slider');
  s.value = 1; s.dispatchEvent(new Event('input'));
});
else if (VIEWS[view]) await page.evaluate(d => {
  const { scene, frameView } = window.__shot;
  frameView();
  const cam = scene.getCamera(), t = scene.controls.target;
  const dist = cam.position.distanceTo(t);
  cam.position.copy(t).addScaledVector(new cam.position.constructor(...d).normalize(), dist);
  cam.lookAt(t);
}, VIEWS[view]);

if (focus) await page.evaluate(async ([id, z]) => { // aim at the part; step back along the clearest side so the camera isn't inside other parts
  const THREE = await import('three');
  const { scene, model } = window.__shot;
  const obj = model.parts3D.get(id), root = model.getEngineGroup();
  root.updateWorldMatrix(true, true);
  const cam = scene.getCamera(), t = scene.controls.target;
  const box = new THREE.Box3().setFromObject(obj), c = box.getCenter(new THREE.Vector3());
  const want = Math.max(box.getSize(new THREE.Vector3()).length() * 1.6, 40) / Math.max(z, 1);
  const cur = cam.position.clone().sub(t).normalize();
  const cands = [cur, ...[[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,1,0],[0,-1,0],[1,.4,1],[1,.4,-1],[-1,.4,1],[-1,.4,-1]].map(v => new THREE.Vector3(...v).normalize())];
  const inPart = o => { for (; o; o = o.parent) if (o === obj) return true; return false; };
  const rc = new THREE.Raycaster();
  let best = null;
  for (const d of cands) {
    rc.set(c, d);
    const hit = rc.intersectObject(root, true).find(h => !inPart(h.object) && h.object.visible);
    const clear = hit ? hit.distance : Infinity;
    const score = Math.min(clear * 0.85, want) + 0.01 * d.dot(cur);
    if (!best || score > best.score) best = { d, clear, score };
  }
  const dist = Math.min(best.clear * 0.85, want);
  t.copy(c); cam.position.copy(c).addScaledVector(best.d, dist); cam.lookAt(c);
}, [focus, zoom]);
await page.waitForTimeout(3000); // removal/explode animations are ~1.5s; swiftshader frames are slow
await mkdir(join(ROOT, 'shots'), { recursive: true });
const out = join(ROOT, 'shots', view + '.png');
await page.screenshot({ path: out });
console.log('saved', out);
await browser.close();
server.close();
