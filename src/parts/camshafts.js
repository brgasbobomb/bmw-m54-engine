// DOHC camshafts: egg lobes (2 per cylinder per cam), 7 journals, front ends in the VANOS hub barrels.
export function build(c) {
  const { T, matSteelDull, matSteelDk, reg, detail, LEN, headY, cx, span } = c;
  const grp = new T.Group();
  const camY = headY + 8, camZ = 18;           // same axis as the VANOS hubs (vanos.js: y = headY+4+4, z = ±18)
  const RB = 5.5, LIFT = 2.5, LW = 5;          // base circle, lift, lobe width
  const profile = (a) => RB + LIFT * Math.pow(Math.max(0, Math.cos(a)), 4); // nose at a = 0
  const shape = new T.Shape();
  for (let k = 0; k < 72; k++) {
    const a = (k / 72) * 2 * Math.PI, r = profile(a);
    k ? shape.lineTo(r * Math.cos(a), r * Math.sin(a)) : shape.moveTo(r, 0);
  }
  const lobeGeo = new T.ExtrudeGeometry(shape, { depth: LW, bevelEnabled: false, curveSegments: 1 });
  lobeGeo.rotateY(Math.PI / 2); lobeGeo.translate(-LW / 2, 0, 0); // extrude along X, nose toward -Z
  const cylGeo = (r, len) => new T.CylinderGeometry(r, r, len, 20);
  const x0 = -LEN / 2 + 12, x1 = LEN / 2 - 16;  // rear end .. back face of the VANOS barrel
  const firing = [0, 4, 2, 5, 1, 3];            // firing position of cylinders 1..6 (1-5-3-6-2-4), 60° cam apart
  for (const s of [1, -1]) {                    // +1 intake, -1 exhaust
    const z = s * camZ, off = s > 0 ? 0 : 1.9;
    const put = (m, x) => { m.rotation.z = Math.PI / 2; m.position.set(x, camY, z); return detail(m, grp); };
    put(new T.Mesh(cylGeo(4, x1 - x0), matSteelDk), (x0 + x1) / 2);
    put(new T.Mesh(cylGeo(6.2, 2), matSteelDull), x1 - 1);   // thrust collar at the hub
    const journals = [0, 1, 2, 3, 4, 5].map(k => -LEN / 2 + 22 + k * span).concat(LEN / 2 - 22);
    journals.forEach(x => put(new T.Mesh(cylGeo(5.2, 6), matSteelDull), x));
    for (let i = 0; i < 6; i++) for (const o of [-4, 4]) {
      const lobe = detail(new T.Mesh(lobeGeo, matSteelDull), grp);
      lobe.position.set(cx(i) + o, camY, z);
      lobe.rotation.x = -Math.PI / 2 + firing[i] * Math.PI / 3 + off; // phase 0 = nose down onto the tappet
    }
    const spin = c.spinGroup(grp, camY, z, m => m.isMesh);
    c.motion.push(t => { spin.rotation.x = t / 2; });
  }
  reg(grp, 'camshafts');
}
