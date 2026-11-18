// Valve cover
export function build(c) {
  const { T, matCover, matSteel, matAlu, reg, detail, roundedBox, LEN, BW, COVER_H, coverY, cx } = c;
  // ----- VALVE COVER (matte black plastic: raised intake-side plateau, exhaust-side coil trough, front nose) -----
  // Local y: 0 = cover centre, `top` = plateau. The trough floor is 4 lower; the coils (bottom at top+3) stand on the plug-well rims.
  const top = COVER_H / 2, floor = top - 4;
  const coverGrp = new T.Group();
  // Trough-level body over the full footprint
  const coverBase = detail(roundedBox(LEN - 10, COVER_H - 4, BW - 8, 3, matCover), coverGrp);
  coverBase.position.y = -2;
  // Reference refs/valve-cover/reference-top-aftermarket.png: flat black cover, two raised flanks (bolt-boss rows along both
  // long edges) and a central recessed channel with a silver stiffener plate per cylinder carrying the plug wells.
  const flank = (z0, z1) => { // z0 < z1, top at `top`
    const m = detail(roundedBox(LEN - 22, 4, z1 - z0, 1.5, matCover), coverGrp);
    m.position.set(1.5, floor + 2, (z0 + z1) / 2);
  };
  flank(-35, -16);  // exhaust flank
  flank(10, 35);    // intake flank: label, oil cap, bolts
  for (let i = 0; i < 6; i++) { // silver plate with a bolt either side of the well
    detail(roundedBox(34, 1, 22, 0.4, matAlu), coverGrp).position.set(cx(i), floor + 0.5, -3);
    for (const dx of [-13, 13]) detail(new T.Mesh(new T.CylinderGeometry(1.8, 1.8, 1.2, 10), matSteel), coverGrp).position.set(cx(i) + dx, floor + 1.4, -3);
  }
  // Perimeter bolt bosses along both flanks (~10 per side)
  for (let i = 0; i < 10; i++) {
    const x = -LEN / 2 + 22 + i * (LEN - 56) / 9;
    for (const z of [-26, 32]) detail(new T.Mesh(new T.CylinderGeometry(2.4, 2.4, 1, 12), matSteel), coverGrp).position.set(x, top + 0.5, z);
  }
  // Rectangular label recess on the intake flank, right of the oil cap
  detail(roundedBox(32, 0.8, 10, 0.3, matCover), coverGrp).position.set(-26, top + 0.4, 22);
  // Six plug wells in line with the coils and plugs (z = -6)
  const wellGeo = new T.LatheGeometry([[5.2, 0], [8, 0], [8, 7], [5.2, 7], [5.2, 0]].map(([r, y]) => new T.Vector2(r, y)), 20);
  for (let i = 0; i < 6; i++) detail(new T.Mesh(wellGeo, matCover), coverGrp).position.set(cx(i), floor, -6);
  // Front nose over the VANOS: full-width bullnose, same height as the plateau
  // Bulbous dome: upper half-ellipsoid, top at plateau height, falling to the base bottom at the front flange; starts just ahead of the first coil (x 105.7 + well r 8)
  const nose = detail(new T.Mesh(new T.SphereGeometry(1, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), matCover), coverGrp);
  nose.scale.set(16, 20, 34);
  nose.position.set(128, -10, 0);
  // CCV nipple on the front intake corner, pointing mostly outboard (+Z) and slightly up (reference photo); ccv.js starts its hose at the tip.
  // Tip centre in cover-local coords = (130, 4.3, 44.3): base (130,-2,28) + 17.5 * (0, cos 1.2, sin 1.2).
  const ccv = new T.Group();
  const stem = new T.Mesh(new T.CylinderGeometry(4.6, 4.6, 16, 16), matCover); stem.position.y = 8;
  const barb = new T.Mesh(new T.CylinderGeometry(5.4, 4.6, 3, 16), matCover); barb.position.y = 15.5;
  ccv.add(stem, barb);
  ccv.rotation.x = 1.2;
  ccv.position.set(130, -2, 28);
  detail(ccv, coverGrp);
  // Oil filler cap: front third of the plateau, between the 2nd and 3rd coil from the front
  const oilCap = detail(new T.Mesh(new T.CylinderGeometry(7, 8, 6, 24), matCover), coverGrp);
  oilCap.position.set(cx(4) - 15, top + 3, 12);
  // Bolt + washer along the intake edge of the plateau
  for (const i of [1, 3, 5]) {
    detail(new T.Mesh(new T.CylinderGeometry(3, 3, 0.8, 16), matSteel), coverGrp).position.set(cx(i), top + 0.4, 30);
    detail(new T.Mesh(new T.CylinderGeometry(2, 2, 2, 6), matSteel), coverGrp).position.set(cx(i), top + 1.8, 30);
  }

  coverGrp.position.y = coverY;
  reg(coverGrp, 'cylinder-head'); // Tagged under cylinder-head removable block
  coverGrp.userData.partId = 'cylinder-head';
}
