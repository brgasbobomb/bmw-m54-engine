// npm run shot -- <view> [--only <part-id>]  ->  shots/<view>.png
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
if (view === 'explode') await page.evaluate(() => {
  const s = document.getElementById('explode-slider');
  s.value = 1; s.dispatchEvent(new Event('input'));
});
else if (VIEWS[view]) await page.evaluate(d => {
  const { scene, frameView } = window.__shot;
  frameView(false);
  const cam = scene.getCamera(), t = scene.controls.target;
  const dist = cam.position.distanceTo(t);
  cam.position.copy(t).addScaledVector(new cam.position.constructor(...d).normalize(), dist);
  cam.lookAt(t);
}, VIEWS[view]);

await page.waitForTimeout(3000); // removal/explode animations are ~1.5s; swiftshader frames are slow
await mkdir(join(ROOT, 'shots'), { recursive: true });
const out = join(ROOT, 'shots', view + '.png');
await page.screenshot({ path: out });
console.log('saved', out);
await browser.close();
server.close();
