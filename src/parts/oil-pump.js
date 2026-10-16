// Oil pump
export function build(c) {
  const { T, matAlu, matAluDark, matSteelDk, reg, detail, LEN, blockY } = c;
  // ----- INTERNAL MECHANICS: OIL PUMP [NEW] -----
  const oilPumpGrp = new T.Group();
  // Pump main body block
  detail(new T.Mesh(new T.BoxGeometry(24, 20, 24), matAluDark), oilPumpGrp);
  // Oil pickup curved pipe
  const pickupPipe = new T.CatmullRomCurve3([
    new T.Vector3(0, 0, 0),
    new T.Vector3(-10, -18, 0),
    new T.Vector3(-14, -30, 4)
  ]);
  detail(new T.Mesh(new T.TubeGeometry(pickupPipe, 12, 4.5, 12, false), matAlu), oilPumpGrp);
  // Pickup mesh screen cup
  const cup = detail(new T.Mesh(new T.CylinderGeometry(12, 12, 6, 18), matSteelDk), oilPumpGrp);
  cup.position.set(-14, -30, 4);
  // Drive chain from crankshaft sprocket
  const pumpChainCurve = new T.CatmullRomCurve3([
    new T.Vector3(LEN / 2 - 58, blockY - 6, 0),
    new T.Vector3(LEN / 2 - 58, blockY - 32, -4),
    new T.Vector3(LEN / 2 - 58, blockY - 32, 4)
  ], true);
  detail(new T.Mesh(new T.TubeGeometry(pumpChainCurve, 16, 1.8, 8, true), matSteelDk), oilPumpGrp);

  oilPumpGrp.position.set(LEN / 2 - 58, blockY - 32, 0);
  reg(oilPumpGrp, 'oil-pump');
}
