// Timing chain & guide rail
export function build(c) {
  const { T, matCover, matSteelDk, reg, detail, LEN, blockY, headY } = c;
  // ----- INTERNAL MECHANICS: TIMING CHAIN & GUIDE RAIL [NEW] -----
  const chainGrp = new T.Group();
  // Timing chain loop
  const chainPath = new T.CatmullRomCurve3([
    new T.Vector3(LEN / 2 - 12, headY + 8, 18),
    new T.Vector3(LEN / 2 - 12, headY + 8, -18),
    new T.Vector3(LEN / 2 - 12, blockY - 6, -14),
    new T.Vector3(LEN / 2 - 12, blockY - 6, 14)
  ], true);
  const chainMesh = detail(new T.Mesh(new T.TubeGeometry(chainPath, 64, 2.8, 12, true), matSteelDk), chainGrp);
  // Guide rail plastic strip
  const guideCurve = new T.CatmullRomCurve3([
    new T.Vector3(LEN / 2 - 14, headY + 2, -19),
    new T.Vector3(LEN / 2 - 14, blockY - 2, -15)
  ]);
  detail(new T.Mesh(new T.TubeGeometry(guideCurve, 10, 3.6, 8, false), matCover), chainGrp);
  reg(chainGrp, 'timing-chain');
}
