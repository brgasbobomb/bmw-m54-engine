// Valve cover
export function build(c) {
  const { T, matCover, matCoverAcc, reg, detail, roundedBox, LEN, BW, COVER_H, coverY } = c;
  // ----- VALVE COVER (Iconic black plastic + dual silver stripes + BMW badge) -----
  const coverGrp = new T.Group();
  // Matte black main cover
  const coverBase = detail(roundedBox(LEN - 10, COVER_H, BW - 8, 9, matCover), coverGrp);
  // Styling lines & Raised coil cover beauty plates
  const beautyPlate = detail(roundedBox(LEN - 28, 4, BW - 22, 2, matCover), coverGrp);
  beautyPlate.position.set(2, COVER_H / 2 + 2, -2);
  // Dual silver stripes
  const stripe1 = detail(new T.Mesh(new T.BoxGeometry(LEN - 45, 1, 1.8), matCoverAcc), coverGrp);
  stripe1.position.set(2, COVER_H / 2 + 4.1, 12);
  const stripe2 = detail(new T.Mesh(new T.BoxGeometry(LEN - 45, 1, 1.8), matCoverAcc), coverGrp);
  stripe2.position.set(2, COVER_H / 2 + 4.1, 8);
  // BMW brand plate
  const badge = detail(new T.Mesh(new T.BoxGeometry(32, 1, 12), matCoverAcc), coverGrp);
  badge.position.set(-30, COVER_H / 2 + 4.1, -12);
  // Textured Oil cap
  const oilCap = detail(new T.Mesh(new T.CylinderGeometry(9, 9, 6, 24), matCover), coverGrp);
  oilCap.position.set(-LEN / 2 + 34, COVER_H / 2 + 3, 18);
  // VANOS front beauty bulge
  const coverVanosBulge = detail(new T.Mesh(new T.CylinderGeometry(15, 15, BW - 10, 24), matCover), coverGrp);
  coverVanosBulge.rotation.x = Math.PI / 2;
  coverVanosBulge.position.set(LEN / 2 - 12, 0, 0);

  coverGrp.position.y = coverY;
  reg(coverGrp, 'cylinder-head'); // Tagged under cylinder-head removable block
  coverGrp.userData.partId = 'cylinder-head';
}
