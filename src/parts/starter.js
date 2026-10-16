// Starter motor
export function build(c) {
  const { T, matSteel, matSteelDk, reg, detail, LEN, BW, blockY } = c;
  // ----- STARTER MOTOR -----
  const starterGrp = new T.Group();
  // Main motor cylinder
  detail(new T.Mesh(new T.CylinderGeometry(12.5, 12.5, 34, 18), matSteelDk), starterGrp);
  // Solenoid actuator cylinder on top
  const sol = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 22, 12), matSteel), starterGrp);
  sol.position.set(0, 12, 4);
  starterGrp.rotation.z = Math.PI / 2;
  starterGrp.position.set(-LEN / 2 + 20, blockY - 26, BW / 2 + 12);
  reg(starterGrp, 'starter-motor');
}
