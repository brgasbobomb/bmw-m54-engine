// Radiator hoses
export function build(c) {
  const { T, matHose, reg, detail, LEN, blockY, headY } = c;
  // ----- RADIATOR HOSES [NEW] -----
  const hosesGrp = new T.Group();
  // Upper coolant hose: thermostat housing to radiator top left
  const upperCurve = new T.CatmullRomCurve3([
    new T.Vector3(LEN / 2 + 14, headY - 14, -14),
    new T.Vector3(LEN / 2 + 50, headY - 6, -34),
    new T.Vector3(LEN / 2 + 95, blockY + 45, -34)
  ]);
  detail(new T.Mesh(new T.TubeGeometry(upperCurve, 20, 6.5, 12, false), matHose), hosesGrp);
  // Lower coolant hose: water pump to radiator bottom right
  const lowerCurve = new T.CatmullRomCurve3([
    new T.Vector3(LEN / 2 - 2, blockY + 28, -8),
    new T.Vector3(LEN / 2 + 45, blockY - 12, 38),
    new T.Vector3(LEN / 2 + 95, blockY - 45, 38)
  ]);
  detail(new T.Mesh(new T.TubeGeometry(lowerCurve, 20, 6.5, 12, false), matHose), hosesGrp);
  reg(hosesGrp, 'thermostat'); // group under thermostat/cooling
}
