// Oil pan
export function build(c) {
  const { T, matAluDark, matSteel, reg, detail, roundedBox, LEN, BW, BH, blockY } = c;
  // ----- OIL PAN (Tapered front deep sump design) -----
  const panGrp = new T.Group();
  // Mating flange
  detail(roundedBox(LEN - 16, 12, BW + 2, 4, matAluDark), panGrp);
  // Pan body tapering to front deep sump (deep sump is towards +X front of engine bay)
  const panDeep = detail(roundedBox(LEN * 0.44, 28, BW - 6, 6, matAluDark), panGrp);
  panDeep.position.set(LEN * 0.22, -20, 0);
  const panShallow = detail(roundedBox(LEN * 0.46, 14, BW - 6, 6, matAluDark), panGrp);
  panShallow.position.set(-LEN * 0.22, -13, 0);
  // Drain plug
  const plug = detail(new T.Mesh(new T.CylinderGeometry(4, 4, 3, 12), matSteel), panGrp);
  plug.position.set(LEN * 0.22, -35, BW / 2 - 8);
  plug.rotation.z = Math.PI / 2;

  panGrp.position.y = blockY - BH / 2 - 6;
  reg(panGrp, 'oil-pan');
}
