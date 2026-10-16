// Thermostat housing
export function build(c) {
  const { T, matCover, reg, detail, LEN, headY } = c;
  // ----- COOLANT THERMOSTAT HOUSING -----
  const thermoGrp = new T.Group();
  // Thermostat cover (curved plastic flange at front of head)
  const thermoBody = detail(new T.Mesh(new T.CylinderGeometry(11, 11, 16, 18), matCover), thermoGrp);
  thermoBody.rotation.x = Math.PI / 2;
  // Coolant pipe elbow going down
  const pCurve = new T.CatmullRomCurve3([
    new T.Vector3(0, 0, 0),
    new T.Vector3(12, -8, -10),
    new T.Vector3(20, -18, -14)
  ]);
  detail(new T.Mesh(new T.TubeGeometry(pCurve, 12, 7.5, 12, false), matCover), thermoGrp);
  thermoGrp.position.set(LEN / 2 + 2, headY, -8);
  reg(thermoGrp, 'thermostat');
}
