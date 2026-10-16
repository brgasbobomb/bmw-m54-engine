// Intake manifold, DISA, throttle, injectors
export function build(c) {
  const { T, matCover, matIntake, matAluDark, matSteel, matSteelDk, matCoil, reg, detail, LEN,
          BW, headY, cx } = c;
  // ----- INTAKE MANIFOLD (6 Curved runners + DISA + Throttle) -----
  const intakeGrp = new T.Group();
  // Matte black intake plenum
  const plenum = detail(new T.Mesh(new T.CylinderGeometry(20, 20, LEN - 50, 28), matIntake), intakeGrp);
  plenum.rotation.z = Math.PI / 2;
  plenum.position.set(-8, headY + 12, BW / 2 + 32);

  // 6 long curved runners wrapping over the top of the head
  for (let i = 0; i < 6; i++) {
    const runCurve = new T.CatmullRomCurve3([
      new T.Vector3(-8, headY + 12, BW / 2 + 32),       // plenum exit
      new T.Vector3(0, headY + 28, BW / 2 + 24),        // arch over head
      new T.Vector3(12, headY + 26, BW / 2 + 10),       // curve down
      new T.Vector3(2, headY + 2, BW / 2 - 1)          // intake port
    ]);
    const runner = detail(new T.Mesh(new T.TubeGeometry(runCurve, 32, 6.4, 16, false), matIntake), intakeGrp);
    runner.position.x = cx(i);
  }
  
  // DISA Valve box (signature M54 component)
  const disa = detail(new T.Mesh(new T.BoxGeometry(20, 26, 14), matIntake), intakeGrp);
  disa.position.set(-LEN / 2 + 75, headY + 12, BW / 2 + 45);

  // Throttle inlet elbow (front curved intake pipe)
  const elbowCurve = new T.CatmullRomCurve3([
    new T.Vector3(LEN / 2 - 25, headY + 12, BW / 2 + 32),
    new T.Vector3(LEN / 2 + 2, headY + 18, BW / 2 + 24),
    new T.Vector3(LEN / 2 + 14, headY + 36, BW / 2 + 10),
    new T.Vector3(LEN / 2 + 10, headY + 54, BW / 2 - 8)
  ]);
  detail(new T.Mesh(new T.TubeGeometry(elbowCurve, 32, 13.5, 20, false), matIntake), intakeGrp);
  reg(intakeGrp, 'intake-manifold');

  // Throttle body unit
  const throttleGrp = new T.Group();
  detail(new T.Mesh(new T.CylinderGeometry(15, 15, 18, 24), matAluDark), throttleGrp);
  // Actuator motor housing on side
  const actBody = detail(new T.Mesh(new T.BoxGeometry(10, 16, 16), matCover), throttleGrp);
  actBody.position.set(0, 0, 14);
  throttleGrp.rotation.z = Math.PI / 2;
  throttleGrp.position.set(LEN / 2 - 23, headY + 12, BW / 2 + 32);
  reg(throttleGrp, 'throttle-body');

  // Fuel Injectors & Fuel Rail (Grouped to fix single-part removal bug)
  const injectorsGrp = new T.Group();
  // Fuel Rail (silver square rail)
  const rail = detail(new T.Mesh(new T.BoxGeometry(LEN - 45, 4, 4), matSteel), injectorsGrp);
  rail.position.set(0, headY + 1, BW / 2 + 12);
  for (let i = 0; i < 6; i++) {
    const inj = detail(new T.Mesh(new T.CylinderGeometry(2.4, 1.8, 14, 10), matSteelDk), injectorsGrp);
    inj.position.set(cx(i), headY - 6, BW / 2 + 12);
    const connector = detail(new T.Mesh(new T.BoxGeometry(4, 5, 5), matCoil), injectorsGrp);
    connector.position.set(cx(i), headY - 2, BW / 2 + 12);
  }
  reg(injectorsGrp, 'fuel-injectors');
}
