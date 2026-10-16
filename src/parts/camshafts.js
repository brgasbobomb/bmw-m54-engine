// DOHC camshafts
export function build(c) {
  const { T, matSteel, matSteelDk, reg, detail, LEN, headY, cx } = c;
  // ----- INTERNAL MECHANICS: DOHC CAMSHAFTS [NEW] -----
  const camshaftsGrp = new T.Group();
  // Intake camshaft (located on the intake +Z side)
  const shaftI = detail(new T.Mesh(new T.CylinderGeometry(4.5, 4.5, LEN - 24, 16), matSteel), camshaftsGrp);
  shaftI.rotation.z = Math.PI / 2;
  shaftI.position.set(0, headY + 8, 18);
  // Exhaust camshaft (located on the exhaust -Z side)
  const shaftE = detail(new T.Mesh(new T.CylinderGeometry(4.5, 4.5, LEN - 24, 16), matSteel), camshaftsGrp);
  shaftE.rotation.z = Math.PI / 2;
  shaftE.position.set(0, headY + 8, -18);
  // Sprocket gears & Cam lobes (12 lobes per shaft)
  const sprocketI = detail(new T.Mesh(new T.CylinderGeometry(14, 14, 5, 32), matSteelDk), camshaftsGrp);
  sprocketI.rotation.z = Math.PI / 2;
  sprocketI.position.set(LEN / 2 - 12, headY + 8, 18);
  const sprocketE = detail(new T.Mesh(new T.CylinderGeometry(14, 14, 5, 32), matSteelDk), camshaftsGrp);
  sprocketE.rotation.z = Math.PI / 2;
  sprocketE.position.set(LEN / 2 - 12, headY + 8, -18);

  for (let i = 0; i < 6; i++) {
    const angleI = (i * 2 * Math.PI) / 6;
    const angleE = angleI + Math.PI / 3;
    // 2 intake lobes per cylinder
    for (let l = 0; l < 2; l++) {
      const offset = -4 + l * 8;
      const lobeI = detail(new T.Mesh(new T.BoxGeometry(6, 12, 7.5), matSteel), camshaftsGrp);
      lobeI.position.set(cx(i) + offset, headY + 8 + Math.cos(angleI) * 2, 18 + Math.sin(angleI) * 2);
      lobeI.rotation.x = angleI;
      const lobeE = detail(new T.Mesh(new T.BoxGeometry(6, 12, 7.5), matSteel), camshaftsGrp);
      lobeE.position.set(cx(i) + offset, headY + 8 + Math.cos(angleE) * 2, -18 + Math.sin(angleE) * 2);
      lobeE.rotation.x = angleE;
    }
  }
  reg(camshaftsGrp, 'camshafts');
}
