// Dual-mass flywheel (manual E46), see refs/flywheel/notes.md.
// Local X = crank axis, rear (-X) = clutch side. Group origin sits on the crank rear flange face (x = -LEN/2).
export function build(c) {
  const { T, matSteel, matSteelDk, reg, detail, LEN, blockY } = c;
  const g = new T.Group();
  const dbl = (m) => { const k = m.clone(); k.side = T.DoubleSide; return k; };
  const cyl = (r, len, h, mat, y = 0, z = 0, seg = 32) => { // h = distance rearward of the crank flange face
    const m = detail(new T.Mesh(new T.CylinderGeometry(r, r, len, seg), mat), g);
    m.rotation.z = Math.PI / 2;
    m.position.set(-h, y, z);
    return m;
  };
  const lathe = (pts, mat) => { // profile (r, h), h rearward
    const m = detail(new T.Mesh(new T.LatheGeometry(pts.map(([r, h]) => new T.Vector2(r, h)), 48), dbl(mat)), g);
    m.rotation.z = Math.PI / 2;
    return m;
  };

  // Primary mass: plate against the crank flange (pilot r7 / flange r24 from crankshaft.js)
  lathe([[8, 0], [37.5, 0], [37.5, 4.5], [8, 4.5], [8, 0]], matSteelDk);
  // Ring gear (starter ring) welded on the primary rim, teeth on the rim
  cyl(38.5, 7, 8, matSteelDk, 0, 0, 48);
  const N = 120, teeth = new T.InstancedMesh(new T.BoxGeometry(7, 2.2, 1.2), matSteelDk, N);
  const d = new T.Object3D();
  for (let i = 0; i < N; i++) {
    const a = i / N * Math.PI * 2;
    d.position.set(-8, Math.cos(a) * 39.4, Math.sin(a) * 39.4);
    d.rotation.set(a, 0, 0);
    d.updateMatrix();
    teeth.setMatrixAt(i, d.matrix);
  }
  g.add(teeth);
  // Secondary mass: clutch face with recessed centre, bearing and crank-bolt access
  lathe([[8, 14.5], [21, 14.5], [21, 17], [35, 17], [35, 11], [8, 11], [8, 14.5]], matSteel);
  cyl(7.5, 3, 15.5, matSteelDk, 0, 0, 24);   // centre bearing
  cyl(4, 3.4, 15.6, matSteel, 0, 0, 24);
  for (let b = 0; b < 6; b++) {              // crank bolts on the 6 x r17 circle of the flange
    const t = b * Math.PI / 3;
    cyl(3, 2, 13.5, matSteel, Math.cos(t) * 17, Math.sin(t) * 17, 6);
  }
  for (let b = 0; b < 6; b++) {              // clutch cover threaded holes
    const t = b * Math.PI / 3 + Math.PI / 6;
    cyl(1.6, 0.4, 17.1, matSteelDk, Math.cos(t) * 29, Math.sin(t) * 29, 12);
  }
  for (let b = 0; b < 3; b++) {              // clutch dowels
    const t = b * 2 * Math.PI / 3 + Math.PI / 2;
    cyl(1.4, 4, 19, matSteel, Math.cos(t) * 31, Math.sin(t) * 31, 10);
  }

  g.position.set(-LEN / 2, blockY - 6, 0);
  reg(g, 'flywheel');
}
