// Radiator hoses: each starts on an elbowed thermostat-housing neck (thermostat.js) and ends on a radiator tank neck. Clamped at both ends.
export function build(c) {
  const { T, matHose, matSteel, reg, detail, LEN, blockY, headY, radY, slantedGrp } = c;
  // Radiator necks live in the upright frame; this group is slanted, so un-slant those end points.
  const up = (x, y, z) => new T.Vector3(x, y, z).applyAxisAngle(new T.Vector3(1, 0, 0), -slantedGrp.rotation.x);
  const hosesGrp = new T.Group();
  const P = (x, y, z) => new T.Vector3(x, y, z);

  const hose = (pts) => {
    const curve = new T.CatmullRomCurve3(pts);
    detail(new T.Mesh(new T.TubeGeometry(curve, 40, 6.5, 12, false), matHose), hosesGrp);
    for (const u of [0.04, 0.96]) { // worm-drive clamp: band + screw housing
      const q = new T.Quaternion().setFromUnitVectors(P(0, 0, 1), curve.getTangentAt(u));
      const band = detail(new T.Mesh(new T.TorusGeometry(6.9, 0.9, 6, 20), matSteel), hosesGrp);
      band.position.copy(curve.getPointAt(u)); band.quaternion.copy(q);
      const screw = detail(new T.Mesh(new T.BoxGeometry(3, 3, 2.4), matSteel), hosesGrp);
      screw.position.copy(P(0, 7.6, 0).applyQuaternion(q).add(band.position)); screw.quaternion.copy(q);
    }
  };
  // Thermostat origin (thermostat.js ORG) + elbow tip - 4 along the last leg.
  const O = P(LEN / 2 + 2, headY, -8);
  hose([ // upper: elbowed neck -> radiator -Z tank neck
    O.clone().add(P(12.4, 6, -22.2)),
    O.clone().add(P(26.7, 6, -29.4)),
    P(LEN / 2 + 55, headY - 4, -50),
    up(LEN / 2 + 76, radY + 39, -62),
    up(LEN / 2 + 90, radY + 38, -65)
  ]);
  hose([ // lower: elbowed neck -> radiator +Z tank neck
    O.clone().add(P(10.3, -22.9, 3.5)),
    O.clone().add(P(31, -24, 7)),
    P(LEN / 2 + 66, blockY - 4, 34),
    up(LEN / 2 + 76, radY - 39, 62),
    up(LEN / 2 + 90, radY - 38, 65)
  ]);
  // Expansion-tank hoses (thin, 2.4 radius): tank spigots at world (220, radY+34±14, 81), see expansion-tank.js.
  // Lower = coolant feed to the lower-hose neck, upper = bleed up to the radiator top tank.
  const thin = pts => detail(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 24, 2.4, 8, false), matHose), hosesGrp);
  thin([up(218, radY + 20, 81), up(219, radY + 4, 78), up(224, radY - 22, 72), up(230, radY - 30, 66)]);
  thin([up(218, radY + 48, 81), up(219, radY + 56, 78), up(226, radY + 64, 72), up(232, radY + 64, 66)]);
  reg(hosesGrp, 'thermostat');
}
