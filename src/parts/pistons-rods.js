// Pistons & connecting rods. Geometry from refs/pistons-rods/notes.md.
// Rod local frame: big-end centre at origin, +Y toward the small end, X = crank axis, Z = swing plane.
export function build(c) {
  const { T, matAlu, matSteel, matSteelDk, reg, detail, blockY, cx, crankThrow, angles } = c;
  const pistonsGrp = new T.Group();
  const rodsGrp = new T.Group();
  const rodLen = 52, pinR = 4.5, crankPinR = 8, bigW = 13, smallW = 14;
  const PR = 17;

  const matAluDS = matAlu.clone(); matAluDS.side = T.DoubleSide;
  const matSteelDS = matSteel.clone(); matSteelDS.side = T.DoubleSide;
  const matDark = new T.MeshStandardMaterial({ color: 0x2a2a2d, roughness: 0.8 });

  // Piston body: lathe profile (r, y) with crown dish, lands, 3 ring grooves, hollow skirt. y = 0 at the wrist-pin axis.
  const grooves = [8.5, 6.1, 3.7], gH = 1.3, gR = 15.3, lR = PR - 0.4;
  const prof = [[0, 10], [6.5, 10], [8.5, 11.2], [PR - 2.5, 11.2], [PR - 0.6, 10.6], [lR, 10.2]];
  grooves.forEach(y => prof.push([lR, y + gH / 2], [gR, y + gH / 2], [gR, y - gH / 2], [lR, y - gH / 2]));
  prof.push([PR, 1.8], [PR, -13], [PR - 1.8, -13], [PR - 1.8, 1.5], [PR - 3, 1.5], [0, 1.5]);
  const pistonGeo = new T.LatheGeometry(prof.map(([r, y]) => new T.Vector2(r, y)), 32);

  const ringGeo = new T.LatheGeometry([[gR + 0.3, -0.55], [PR + 0.15, -0.55], [PR + 0.15, 0.55], [gR + 0.3, 0.55], [gR + 0.3, -0.55]].map(([r, y]) => new T.Vector2(r, y)), 32);
  const pinGeo = new T.LatheGeometry([[3, -16], [pinR, -16], [pinR, 16], [3, 16], [3, -16]].map(([r, y]) => new T.Vector2(r, y)), 20);
  pinGeo.rotateZ(Math.PI / 2); // pin along X

  // Rod pieces (built once, shared by all six rods)
  const extrudeX = (shape, w) => { // shape in (z, y) -> extruded along X, centred
    const g = new T.ExtrudeGeometry(shape, { depth: w, bevelEnabled: false, curveSegments: 20 });
    g.translate(0, 0, -w / 2); g.rotateY(Math.PI / 2); return g;
  };
  const hole = (r, y0 = 0) => { const p = new T.Path(); p.absarc(0, y0, r, 0, Math.PI * 2, true); return p; };

  const bR = crankPinR + 0.1;
  const up = new T.Shape(); // upper big end with bolt lugs, necking into the beam
  up.moveTo(-14, 0); up.lineTo(-bR, 0); up.absarc(0, 0, bR, Math.PI, 0, true); up.lineTo(14, 0);
  up.lineTo(14, 5); up.lineTo(8.5, 11); up.lineTo(3.2, 17); up.lineTo(-3.2, 17); up.lineTo(-8.5, 11); up.lineTo(-14, 5);
  const upGeo = extrudeX(up, bigW);

  const cap = new T.Shape(); // separate cap, 0.5 gap below the split plane
  cap.moveTo(-14, 0); cap.lineTo(-14, -5); cap.lineTo(-9, -8);
  cap.absarc(0, 0, 12.04, -2.416, -0.726, false);
  cap.lineTo(14, -5); cap.lineTo(14, 0); cap.lineTo(bR, 0); cap.absarc(0, 0, bR, 0, -Math.PI, true);
  const capGeo = extrudeX(cap, bigW); capGeo.translate(0, -0.5, 0);

  const L = rodLen, sR = 7;
  const sm = new T.Shape(); // small end + taper
  sm.moveTo(-3.2, L - 14); sm.lineTo(3.2, L - 14); sm.lineTo(6.5, L - 2.5);
  sm.absarc(0, L, sR, -0.38, Math.PI + 0.38, false);
  sm.holes.push(hole(pinR + 0.05, L));
  const smGeo = extrudeX(sm, smallW);

  // I-beam: flanges at +-Z (swing plane), thin web, pockets visible on +-X faces
  const ib = new T.Shape();
  [[-4.5, 3.2], [4.5, 3.2], [4.5, 2], [1.2, 2], [1.2, -2], [4.5, -2], [4.5, -3.2], [-4.5, -3.2], [-4.5, -2], [-1.2, -2], [-1.2, 2], [-4.5, 2]]
    .forEach(([x, z], k) => k ? ib.lineTo(x, z) : ib.moveTo(x, z));
  const beamLen = L - 14 - 13;
  const beamGeo = new T.ExtrudeGeometry(ib, { depth: beamLen, bevelEnabled: false });
  beamGeo.rotateX(-Math.PI / 2); beamGeo.translate(0, 14, 0);

  const boltGeo = new T.CylinderGeometry(1.9, 1.9, 13, 12);
  const headGeo = new T.CylinderGeometry(3.3, 3.3, 2.2, 6);

  for (let i = 0; i < 6; i++) {
    const a = angles[i];
    const pinY = blockY - 6 + Math.cos(a) * crankThrow; // crankpin centre
    const pinZ = Math.sin(a) * crankThrow;
    const pistonY = pinY + Math.sqrt(rodLen * rodLen - pinZ * pinZ); // slider-crank

    // Piston + rings + pin + circlips
    const pg = new T.Group();
    detail(new T.Mesh(pistonGeo, matAluDS), pg);
    grooves.forEach(y => { const r = detail(new T.Mesh(ringGeo, matSteelDk), pg); r.position.y = y; });
    detail(new T.Mesh(pinGeo, matSteelDS), pg);
    [-1, 1].forEach(s => {
      const clip = detail(new T.Mesh(new T.TorusGeometry(pinR + 0.1, 0.35, 6, 16), matSteelDk), pg);
      clip.rotation.y = Math.PI / 2; clip.position.x = s * 15.2;
      const bore = detail(new T.Mesh(new T.CylinderGeometry(pinR + 1.2, pinR + 1.2, 0.3, 20), matDark), pg); // boss bore around pin end
      bore.rotation.z = Math.PI / 2; bore.position.x = s * (PR - 0.7);
    });
    // 4 valve reliefs (2 intake +Z, 2 exhaust -Z), dark pockets in the crown
    [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([sx, sz]) => {
      const v = detail(new T.Mesh(new T.CylinderGeometry(4.6, 4.6, 0.3, 20), matDark), pg);
      v.scale.set(1, 1, 0.8); v.position.set(sx * 7.5, 11.25, sz * 8.5);
      v.rotation.set(sz * 0.12, 0, -sx * 0.12);
    });
    pg.position.set(cx(i), pistonY, 0);
    detail(pg, pistonsGrp);

    // Rod: big end on the crankpin, small end on the piston pin
    const rg = new T.Group();
    detail(new T.Mesh(upGeo, matSteel), rg);
    detail(new T.Mesh(beamGeo, matSteel), rg);
    detail(new T.Mesh(smGeo, matSteel), rg);
    detail(new T.Mesh(capGeo, matSteelDk), rg);
    [-1, 1].forEach(s => { // 2 cap bolts along the rod axis
      const b = detail(new T.Mesh(boltGeo, matSteelDk), rg); b.position.set(0, 0, s * 11);
      const h = detail(new T.Mesh(headGeo, matSteelDk), rg); h.position.set(0, -7.8, s * 11);
    });
    rg.position.set(cx(i), pinY, pinZ);
    rg.rotation.x = Math.atan2(-pinZ, pistonY - pinY);
    detail(rg, rodsGrp);
  }
  reg(pistonsGrp, 'pistons');
  reg(rodsGrp, 'connecting-rods');
}
