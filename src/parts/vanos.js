// Double VANOS actuator
export function build(c) {
  const { T, matAlu, matSteel, reg, detail, LEN, BW, headY } = c;
  // ----- DOUBLE VANOS ACTUATOR UNIT -----
  const vanosGrp = new T.Group();
  // Silver actuator housing block
  detail(new T.Mesh(new T.BoxGeometry(24, 38, BW - 10), matAlu), vanosGrp);
  // Intake & Exhaust twin actuator cylinder domes (Double VANOS)
  const domeIntake = detail(new T.Mesh(new T.CylinderGeometry(12, 12, 14, 24), matAlu), vanosGrp);
  domeIntake.rotation.z = Math.PI / 2;
  domeIntake.position.set(16, 6, 18);
  const domeExhaust = detail(new T.Mesh(new T.CylinderGeometry(12, 12, 14, 24), matAlu), vanosGrp);
  domeExhaust.rotation.z = Math.PI / 2;
  domeExhaust.position.set(16, 6, -18);
  // Solenoids (cylinder actuators)
  const solIntake = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 15, 18), matSteel), vanosGrp);
  solIntake.rotation.z = Math.PI / 2;
  solIntake.position.set(12, -10, 18);
  const solExhaust = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 15, 18), matSteel), vanosGrp);
  solExhaust.rotation.z = Math.PI / 2;
  solExhaust.position.set(12, -10, -18);
  
  vanosGrp.position.set(LEN / 2 - 4, headY + 4, 0);
  reg(vanosGrp, 'vanos-actuators');
}
