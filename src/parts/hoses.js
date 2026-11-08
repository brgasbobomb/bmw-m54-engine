// Radiator hoses
export function build(c) {
  const { T, matHose, reg, detail, LEN, blockY, headY, radY, slantedGrp } = c;
  // Radiator necks live in the upright frame; this group is slanted, so un-slant those end points.
  const up = (x, y, z) => new T.Vector3(x, y, z).applyAxisAngle(new T.Vector3(1, 0, 0), -slantedGrp.rotation.x);
  // ----- RADIATOR HOSES [NEW] -----
  const hosesGrp = new T.Group();
  // Upper coolant hose: thermostat housing to radiator top left
  const upperCurve = new T.CatmullRomCurve3([
    new T.Vector3(LEN / 2 + 14, headY - 14, -14),
    new T.Vector3(LEN / 2 + 50, headY - 6, -34),
    up(LEN / 2 + 76, radY + 39, -62),
    up(LEN / 2 + 90, radY + 38, -65) // slides over the radiator -Z tank neck
  ]);
  detail(new T.Mesh(new T.TubeGeometry(upperCurve, 20, 6.5, 12, false), matHose), hosesGrp);
  // Lower coolant hose: water pump to radiator bottom right
  const lowerCurve = new T.CatmullRomCurve3([
    new T.Vector3(LEN / 2 - 2, blockY + 28, -8),
    new T.Vector3(LEN / 2 + 45, blockY - 12, 38),
    up(LEN / 2 + 76, radY - 39, 62),
    up(LEN / 2 + 90, radY - 38, 65) // slides over the radiator +Z tank neck
  ]);
  detail(new T.Mesh(new T.TubeGeometry(lowerCurve, 20, 6.5, 12, false), matHose), hosesGrp);
  reg(hosesGrp, 'thermostat'); // group under thermostat/cooling
}
