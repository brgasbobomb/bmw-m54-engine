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
  const nose = detail(new T.Mesh(new T.CylinderGeometry(12, 12, BW - 10, 24), matCover), coverGrp);
  nose.rotation.x = Math.PI / 2;
  nose.position.set(LEN / 2 - 12, top - 12, 0);
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
