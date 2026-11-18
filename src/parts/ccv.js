// Crankcase ventilation (CCV): nipple on the valve-cover front intake corner (valve-cover.js has none yet, so the
// stub is drawn here), black hose arching out over the front of the head, down to a small separator box sitting on
// the plenum's front end. Short hose from the box into the plenum. Details: refs/ccv/notes.md
export function build(c) {
  const { T, matHose, matSteel, matCover, matIntake, reg, detail, BW, LEN, headY, coverY, COVER_H, cx } = c;
  const g = new T.Group();
  const P = (x, y, z) => new T.Vector3(x, y, z);
  const S = Math.sin(Math.PI / 6), C = Math.cos(Math.PI / 6);
  // Intake.js draws the plenum upright (car frame: out from head face, up); convert to this slanted frame.
  const car = (x, up, out) => P(x, headY + up * C - out * S, BW / 2 + 1 + up * S + out * C);

  const nipY = coverY + 2, nipZ = BW / 2 - 12, nipX = LEN / 2 - 2;
  const tip = P(130, coverY + 4.3, 44.3);   // barb tip of the nipple built in valve-cover.js

  // Separator box on the plenum top, front end (plenum ends ~x 128, top at car-frame up 22).
  const bx = cx(5) + 12, bUp = 30, bOut = 62;
  const bc = car(bx, bUp, bOut);
  const box = detail(new T.Mesh(new T.BoxGeometry(26, 14, 22), matIntake), g);
  box.position.copy(bc); box.rotation.x = Math.PI / 6;                 // stand upright in the car
  const foot = detail(new T.Mesh(new T.BoxGeometry(18, 3, 14), matIntake), g);  // flange on the plenum
  foot.position.copy(car(bx, 21.5, bOut)); foot.rotation.x = Math.PI / 6;
  const inlet = car(bx + 13, bUp, bOut);
  const bar = detail(new T.Mesh(new T.CylinderGeometry(4.2, 4.2, 8, 14), matCover), g);   // inlet nipple on +X face
  bar.rotation.z = -Math.PI / 2; bar.position.copy(inlet).add(P(3, 0, 0));
  const lid = detail(new T.Mesh(new T.CylinderGeometry(5, 5, 3, 16), matSteel), g);       // screw cap on top
  lid.position.copy(car(bx - 4, bUp + 8, bOut)); lid.rotation.x = Math.PI / 6;

  const hose = (pts, r) => {
    const curve = new T.CatmullRomCurve3(pts);
    detail(new T.Mesh(new T.TubeGeometry(curve, 40, r, 12, false), matHose), g);
    for (const u of [0.04, 0.96]) {                                    // steel clamp at both ends
      const q = new T.Quaternion().setFromUnitVectors(P(0, 0, 1), curve.getTangentAt(u));
      const band = detail(new T.Mesh(new T.TorusGeometry(r + 0.4, 0.8, 6, 20), matSteel), g);
      band.position.copy(curve.getPointAt(u)); band.quaternion.copy(q);
      const screw = detail(new T.Mesh(new T.BoxGeometry(2.6, 2.6, 2), matSteel), g);
      screw.position.copy(P(0, r + 1.2, 0).applyQuaternion(q).add(band.position)); screw.quaternion.copy(q);
    }
  };
  hose([tip, P(138, coverY + 4, 50), P(nipX + 20, nipY - 8, nipZ + 24),
        P(nipX + 15, nipY - 22, nipZ + 50), inlet.clone().add(P(8, 4, 0)), inlet.clone().add(P(3, 0, 0))], 5.2);
  // Short hose from the box underside into the plenum top.
  const bot = car(bx - 4, 22, bOut), top = car(bx - 4, bUp - 7, bOut);
  hose([top, bot.clone().lerp(top, 0.5), bot], 4.2);

  reg(g, 'ccv');
}
