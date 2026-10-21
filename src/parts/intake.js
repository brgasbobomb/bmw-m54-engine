// Intake manifold (moulded black plastic), after the RealOEM exploded view (refs/intake/realoem-intake-diagram.webp):
// six round runners leave the head flange rising, arch over the top and drop down the outer side into the plenum
// under the arch; seam lip + vertical seam on the plenum, DISA on the outer wall at mid-length, idle-air distribution
// piece along the flange; throttle body + inlet boot; fuel rail + injectors. Details: refs/intake/notes.md
export function build(c) {
  const { T, matCover, matIntake, matAluDark, matSteel, matSteelDk, matCoil, reg, detail, roundedBox,
          BW, headY, span, cx } = c;
  const zF = BW / 2 + 1;                      // head intake face (the head is BW + 2 deep)
  const xm = (cx(0) + cx(5)) / 2;             // centre of the six runners
  const run = cx(5) - cx(0);                  // first-to-last runner distance
  const W = 30, PX = run + W + 16;            // runner width, plenum length
  const gaps = [1, 2, 3, 4, 5].map(k => cx(k) - span / 2);
  const intakeGrp = new T.Group();

  // Runners and plenum are drawn upright in the car: this group undoes the 30 deg slant, so local z = out from the
  // head face and y = up, origin at (zF, headY). The head flange and the parts on it stay in the slanted frame.
  const car = new T.Group();
  car.rotation.x = Math.PI / 6;
  car.position.set(0, headY, zF);
  intakeGrp.add(car);
  const P = (out, up) => new T.Vector3(0, up, out);

  // Plenum: long rounded box under the runner arch, inner wall clear of the oil-filter cap, floor over the oil cooler
  const pl = { o0: 34, o1: 90, u0: -3, u1: 22 }, plO = (pl.o0 + pl.o1) / 2, plU = (pl.u0 + pl.u1) / 2;
  const plShape = new T.Shape().moveTo(pl.o0 + 8, pl.u0).lineTo(pl.o1 - 8, pl.u0).quadraticCurveTo(pl.o1, pl.u0, pl.o1, pl.u0 + 8)
    .lineTo(pl.o1, pl.u1 - 4).quadraticCurveTo(pl.o1, pl.u1, pl.o1 - 4, pl.u1).lineTo(pl.o0 + 4, pl.u1)
    .quadraticCurveTo(pl.o0, pl.u1, pl.o0, pl.u1 - 4).lineTo(pl.o0, pl.u0 + 8).quadraticCurveTo(pl.o0, pl.u0, pl.o0 + 8, pl.u0);
  const plGeo = new T.ExtrudeGeometry(plShape, { depth: PX - 6, bevelEnabled: true, bevelThickness: 3, bevelSize: 3,
                                                 bevelSegments: 3, curveSegments: 8 });
  plGeo.translate(0, 0, 3 - PX / 2);
  const plenum = detail(new T.Mesh(plGeo, matIntake), car);
  plenum.rotation.y = -Math.PI / 2;           // shape x -> out, extrusion -> x
  plenum.position.x = xm;

  // Runners: round tubes (r 10, flattened to 30 wide) off the port rising 30 deg, over the crest, down the outer
  // side, ending inside the plenum. The outer drop stands ~5 proud of the plenum wall, as the ribbed outer face.
  const path = new T.CurvePath();
  for (const seg of [[[-2, 4.5], [10, 11.5], [22, 37], [36, 37]],
                     [[36, 37], [58, 37], [88, 34], [88, 14]],
                     [[88, 14], [88, 4], [82, 4], [72, 6]]])
    path.add(new T.CubicBezierCurve3(...seg.map(([o, u]) => P(o, u))));
  const tubeGeo = new T.TubeGeometry(path, 64, 10, 18, false);
  const bossGeo2 = new T.CylinderGeometry(2.2, 2.6, 5, 10);
  for (let i = 0; i < 6; i++) {
    const r = detail(new T.Mesh(tubeGeo, matIntake), car);
    r.scale.x = 1.5;
    r.position.x = cx(i);
    detail(new T.Mesh(bossGeo2, matIntake), car).position.set(cx(i) + 6, 48, 46);    // vacuum stub on the crest
  }

  // Plenum seams: lip along the bottom of the outer wall, vertical seam at mid-length between the two halves
  detail(new T.Mesh(new T.BoxGeometry(PX + 2, 2.4, 3), matCover), car).position.set(xm, pl.u0 + 1, pl.o1 + 3.5);
  detail(new T.Mesh(new T.BoxGeometry(2, pl.u1 - pl.u0 + 6, 2), matCover), car).position.set(xm, plU, pl.o1 + 3);

  // DISA adjuster on the outer wall at mid-length near the bottom: round flange, body, actuator box with connector
  for (const [r, h, o, mat] of [[9.6, 1.4, 0.7, matIntake], [8, 6, 3.4, matCover]]) {
    const d = detail(new T.Mesh(new T.CylinderGeometry(r, r, h, 24), mat), car);
    d.rotation.x = Math.PI / 2;
    d.position.set(xm, 8, pl.o1 + 3 + o);
  }
  detail(new T.Mesh(new T.BoxGeometry(11, 9, 7), matCover), car).position.set(xm + 12.5, 8, pl.o1 + 7);
  detail(new T.Mesh(new T.BoxGeometry(4, 4, 4), matCoil), car).position.set(xm + 12.5, 14.5, pl.o1 + 7);

  // Intake air temperature sensor: on the plenum top at the rear end, past runner 1
  const xI = xm - PX / 2 + 5;
  detail(new T.Mesh(new T.CylinderGeometry(2.6, 2.6, 6, 12), matCover), car).position.set(xI, pl.u1 + 5, plO - 8);
  detail(new T.Mesh(new T.BoxGeometry(4.5, 3.5, 4), matCoil), car).position.set(xI, pl.u1 + 9.5, plO - 8);

  // Head flange; collar nuts in two rows, in the slots and past each end. A web under each slot closes the
  // dark pocket seen from above.
  detail(roundedBox(run + W + 24, 22, 4, 1.5, matIntake), intakeGrp).position.set(xm, headY + 5, zF + 1);   // bottom 1 over the oil filter
  const nutGeo = new T.CylinderGeometry(2.9, 2.9, 2.4, 6), collarGeo = new T.CylinderGeometry(3.5, 3.5, 0.8, 16);
  for (const x of [cx(0) - W / 2 - 6, ...gaps, cx(5) + W / 2 + 6]) for (const y of [-3.5, 13.5]) {
    for (const [geo, z] of [[nutGeo, 4.6], [collarGeo, 3.4]]) {
      const n = detail(new T.Mesh(geo, matSteelDk), intakeGrp);
      n.rotation.x = Math.PI / 2;
      n.position.set(x, headY + y, zF + z);
    }
  }

  // Idle-air distribution frame (3D scans): a spine along the runner crests and one U per runner lying on the
  // runner top, legs 17 apart, round end toward the head; an idle-air nipple stands inside each U.
  // Frame plane follows the runner top slope: up = 38 at out 16, rising 2/3 per unit out (car frame).
  const upAt = o => 38 + (o - 16) * 2 / 3;
  const uPts = [];
  for (let k = 0; k <= 4; k++) uPts.push([-8.5, 36 - 5 * k]);
  for (let k = 1; k < 12; k++) { const a = Math.PI * k / 12; uPts.push([-8.5 * Math.cos(a), 16 - 8.5 * Math.sin(a)]); }
  for (let k = 0; k <= 4; k++) uPts.push([8.5, 16 + 5 * k]);
  const uGeo = new T.TubeGeometry(new T.CatmullRomCurve3(uPts.map(([x, o]) => new T.Vector3(x, upAt(o), o))), 48, 2.6, 8, false);
  const nipGeo = new T.CylinderGeometry(1.3, 1.6, 5, 8);
  for (let i = 0; i < 6; i++) {
    detail(new T.Mesh(uGeo, matIntake), car).position.x = cx(i);
    detail(new T.Mesh(nipGeo, matIntake), car).position.set(cx(i), upAt(24) - 0.5, 24);
  }
  const spine = detail(new T.Mesh(new T.BoxGeometry(run + 22, 4, 8), matIntake), car);
  spine.rotation.x = -Math.atan(2 / 3);      // lies in the frame plane
  spine.position.set(xm, upAt(37), 37);

  // Throttle mount (3D scans): a neck under the plenum at mid-length, a little toward the front, ending in a square
  // 4-bolt flange that faces outward; a sheet bracket hangs from its foot toward the block.
  const xT = xm + 8, uT = pl.u0 - 15, oT = 66;  // throttle bore centre (car frame); flange face at oT + 7
  detail(roundedBox(34, 30, 22, 4, matIntake), car).position.set(xT, uT + 4, oT - 4);
  detail(roundedBox(36, 36, 3, 3, matIntake), car).position.set(xT, uT, oT + 5.5);
  detail(new T.Mesh(new T.BoxGeometry(22, 26, 1.6), matIntake), car).position.set(xT + 4, uT - 28, oT + 2);

  // Idle valve under the plenum behind the throttle neck, on its rubber-mounted bracket
  const iv = detail(new T.Mesh(new T.CylinderGeometry(5, 5, 26, 14), matCover), car);
  iv.rotation.z = Math.PI / 2;
  iv.position.set(xT - 34, uT + 2, oT - 6);

  // Inlet boot: out of the throttle body outward, 90 deg bend toward the front, then forward along the outer side
  // of the manifold toward the airbox; ribs, hose clamps at both ends, dark cap for the open end
  const b0 = oT + 24, xB = xm + PX / 2 + 24;
  const boot = new T.CurvePath();
  // Bezier keeps the bend radius near 28, well above the tube radius, so the inner wall doesn't fold
  boot.add(new T.CubicBezierCurve3(...[[0, 0], [0, 16], [12, 28], [28, 28]].map(([x, o]) => new T.Vector3(xT + x, uT, b0 + o))));
  boot.add(new T.LineCurve3(new T.Vector3(xT + 28, uT, b0 + 28), new T.Vector3(xB, uT - 6, b0 + 28)));
  const axisZ = new T.Vector3(0, 0, 1);
  const onBoot = (mesh, t) => {
    mesh.position.copy(boot.getPointAt(t));
    mesh.quaternion.setFromUnitVectors(axisZ, boot.getTangentAt(t));
    return detail(mesh, car);
  };
  detail(new T.Mesh(new T.TubeGeometry(boot, 48, 14, 20, false), matIntake), car);
  const ribGeo = new T.TorusGeometry(14, 1, 6, 20), clampGeo = new T.TorusGeometry(14.3, 1.4, 6, 20);
  for (const t of [0.45, 0.55, 0.65, 0.75, 0.85]) onBoot(new T.Mesh(ribGeo, matIntake), t);
  for (const t of [0.02, 0.97]) onBoot(new T.Mesh(clampGeo, matSteelDk), t);
  onBoot(new T.Mesh(new T.CircleGeometry(13.5, 20), matCoil), 1);
  reg(intakeGrp, 'intake-manifold');

  // Throttle body: alloy housing bolted to the flange, axis outward; 4 bolts, actuator motor on the front side
  const throttleGrp = new T.Group();
  throttleGrp.rotation.x = Math.PI / 6;     // same upright frame as `car`
  throttleGrp.position.set(0, headY, zF);
  const tb = (geo, mat, x, u, o) => {
    const m = detail(new T.Mesh(geo, mat), throttleGrp);
    m.rotation.x = Math.PI / 2;
    m.position.set(x, u, o);
    return m;
  };
  tb(new T.CylinderGeometry(13, 13, 16, 24), matAluDark, xT, uT, oT + 15);
  tb(new T.CylinderGeometry(15, 15, 2.4, 24), matAluDark, xT, uT, oT + 8.2);
  const boltGeo = new T.CylinderGeometry(2, 2, 3, 6);
  for (const dx of [-13, 13]) for (const du of [-13, 13]) tb(boltGeo, matSteel, xT + dx, uT + du, oT + 8.5);
  detail(new T.Mesh(new T.BoxGeometry(10, 16, 13), matCover), throttleGrp).position.set(xT + 18, uT, oT + 15);
  reg(throttleGrp, 'throttle-body');

  // Fuel rail over the injectors, harness strip with screws on top, pink connector on each injector (head side)
  // shortcut: no rail clips or feed line, upgrade with a close-up of the rail mounting
  const injectorsGrp = new T.Group();
  const matPink = matCoil.clone();
  matPink.color.set(0xd0407f);
  const railY = headY + 25.5, railZ = zF + 3.5;
  detail(new T.Mesh(new T.BoxGeometry(run + W + 4, 4.5, 4.5), matSteel), injectorsGrp).position.set(xm, railY, railZ);
  detail(new T.Mesh(new T.BoxGeometry(run + W, 1.6, 7), matCover), injectorsGrp).position.set(xm, railY + 3, railZ);
  const screwGeo = new T.CylinderGeometry(1.4, 1.4, 1, 10);
  for (const x of gaps) detail(new T.Mesh(screwGeo, matSteel), injectorsGrp).position.set(x, railY + 4.2, railZ);
  const injGeo = new T.CylinderGeometry(2.3, 1.8, 9, 12), conGeo = new T.BoxGeometry(4.5, 4, 5);
  for (let i = 0; i < 6; i++) {
    detail(new T.Mesh(injGeo, matSteelDk), injectorsGrp).position.set(cx(i), railY - 6, railZ);
    detail(new T.Mesh(conGeo, matPink), injectorsGrp).position.set(cx(i), railY - 3, railZ - 4.5);
  }
  reg(injectorsGrp, 'fuel-injectors');
}
