// Valves: 4 per cylinder, each with bucket tappet, retainer, helical spring, stem and head.
export function build(c) {
  const { T, matSteel, matSteelDk, reg, detail, headY, cx } = c;
  const grp = new T.Group();
  const camY = headY + 8, RB = 5.5, LIFT = 2.5;  // must match camshafts.js
  const firing = [0, 4, 2, 5, 1, 3];
  const cyl = (rt, rb, h, y, mat, g) => { const m = detail(new T.Mesh(new T.CylinderGeometry(rt, rb, h, 20), mat), g); m.position.y = y; return m; };
  const pts = [];
  for (let k = 0; k <= 60; k++) { const a = k / 60 * 5 * 2 * Math.PI; pts.push(new T.Vector3(3 * Math.cos(a), -7 - 8 * k / 60, 3 * Math.sin(a))); }
  const springGeo = new T.TubeGeometry(new T.CatmullRomCurve3(pts), 120, 0.5, 5);
  for (const s of [1, -1]) {                       // +1 intake, -1 exhaust
    const off = s > 0 ? 0 : 1.9, rHead = s > 0 ? 5.6 : 4.9;
    for (let i = 0; i < 6; i++) for (const o of [-4, 4]) {
      const v = new T.Group();                      // origin = top of tappet
      cyl(3.4, 3.4, 3.5, -1.75, matSteelDk, v);     // bucket tappet
      cyl(2.6, 3.2, 1.4, -6.2, matSteel, v);        // retainer
      detail(new T.Mesh(springGeo, matSteelDk), v);
      cyl(1.1, 1.1, 15.5, -11.25, matSteel, v);     // stem
      cyl(1.1, rHead, 2.5, -17.6, matSteel, v);     // head cone
      cyl(rHead, rHead, 0.8, -19.2, matSteel, v);   // head rim
      const phase = firing[i] * Math.PI / 3 + off;  // push the valve down by the lobe lift under its tappet
      v.position.set(cx(i) + o, camY - RB, s * 18);
      v.rotation.x = s * 0.21;
      v.translateY(-LIFT * Math.pow(Math.max(0, Math.cos(phase)), 4));
      detail(v, grp);
    }
  }
  reg(grp, 'valves');
}
