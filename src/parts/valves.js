// Valves & springs
export function build(c) {
  const { T, matSteel, matSteelDk, reg, detail, headY, cx } = c;
  // ----- INTERNAL MECHANICS: VALVES & SPRINGS (24 pcs) [NEW] -----
  const valvesGrp = new T.Group();
  for (let i = 0; i < 6; i++) {
    for (let l = 0; l < 2; l++) {
      const offset = -4 + l * 8;
      // Intake valves (angled at 12 degrees outwards to +Z)
      const vIntake = new T.Group();
      const stemI = detail(new T.Mesh(new T.CylinderGeometry(1.2, 1.2, 22, 8), matSteel), vIntake);
      const springI = detail(new T.Mesh(new T.CylinderGeometry(3.6, 3.6, 10, 16), matSteelDk), vIntake);
      springI.position.y = 5;
      const discI = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 1, 16), matSteel), vIntake);
      discI.position.y = -11;
      vIntake.rotation.x = 0.21;
      vIntake.position.set(cx(i) + offset, headY - 1, 18);
      detail(vIntake, valvesGrp);

      // Exhaust valves (angled at 12 degrees outwards to -Z)
      const vExhaust = new T.Group();
      const stemE = detail(new T.Mesh(new T.CylinderGeometry(1.2, 1.2, 22, 8), matSteel), vExhaust);
      const springE = detail(new T.Mesh(new T.CylinderGeometry(3.6, 3.6, 10, 16), matSteelDk), vExhaust);
      springE.position.y = 5;
      const discE = detail(new T.Mesh(new T.CylinderGeometry(5.2, 5.2, 1, 16), matSteel), vExhaust);
      discE.position.y = -11;
      vExhaust.rotation.x = -0.21;
      vExhaust.position.set(cx(i) + offset, headY - 1, -18);
      detail(vExhaust, valvesGrp);
    }
  }
  reg(valvesGrp, 'valves');
}
