// Valve cover
export function build(c) {
  const { T, matCover, matSteel, reg, detail, roundedBox, LEN, BW, COVER_H, coverY, cx } = c;
  // ----- VALVE COVER (matte black plastic: raised intake-side plateau, exhaust-side coil trough, front nose) -----
  // Local y: 0 = cover centre, `top` = plateau. The trough floor is 4 lower; the coils (bottom at top+3) stand on the plug-well rims.
  const top = COVER_H / 2, floor = top - 4;
  const coverGrp = new T.Group();
  // Trough-level body over the full footprint
  const coverBase = detail(roundedBox(LEN - 10, COVER_H - 4, BW - 8, 3, matCover), coverGrp);
  coverBase.position.y = -2;
  // Raised plateau on the intake half (label, oil cap, bolts); x runs from 10 in from the rear end to the nose apex
  const plateau = detail(roundedBox(LEN - 27, 6, 32, 2, matCover), coverGrp);
  plateau.position.set(1.5, top - 3, 19);
  // Low rim along the exhaust edge of the trough
  const rim = detail(roundedBox(LEN - 14, 4, 3, 1, matCover), coverGrp);
  rim.position.set(0, floor + 1, -33);
  // Six plug wells in line with the coils and plugs (z = -6)
  const wellGeo = new T.LatheGeometry([[5.2, 0], [8, 0], [8, 7], [5.2, 7], [5.2, 0]].map(([r, y]) => new T.Vector2(r, y)), 20);
  for (let i = 0; i < 6; i++) detail(new T.Mesh(wellGeo, matCover), coverGrp).position.set(cx(i), floor, -6);
  // Front nose over the VANOS: full-width bullnose, same height as the plateau
  // Bulbous dome: upper half-ellipsoid, top at plateau height, falling to the base bottom at the front flange; starts just ahead of the first coil (x 105.7 + well r 8)
  const nose = detail(new T.Mesh(new T.SphereGeometry(1, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), matCover), coverGrp);
  nose.scale.set(16, 20, 34);
  nose.position.set(128, -10, 0);
  // CCV nipple on the front intake corner, pointing up and out (+Z); see notes.md for coordinates
  const ccv = new T.Group();
  const stem = new T.Mesh(new T.CylinderGeometry(8, 8, 18, 20), matCover); stem.position.y = 9;
  const barb = new T.Mesh(new T.CylinderGeometry(9.5, 8, 3, 20), matCover); barb.position.y = 16.5;
  ccv.add(stem, barb);
  ccv.rotation.x = Math.PI / 4;
  ccv.position.set(126, 3, 26);
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
