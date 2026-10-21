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

  // Idle-air nipple on each runner near the flange; the distribution piece runs along the head side and loops
  // over into every nipple
  const nipGeo = new T.CylinderGeometry(1.3, 1.3, 3.2, 8);
  const loopGeo = new T.TorusGeometry(3.8, 1, 6, 12, Math.PI);
  for (let i = 0; i < 6; i++) {
    detail(new T.Mesh(nipGeo, matIntake), intakeGrp).position.set(cx(i) + 8, headY + 16.6, zF + 5.4);
    const loop = detail(new T.Mesh(loopGeo, matCover), intakeGrp);
    loop.rotation.y = Math.PI / 2;            // half ring standing in the (z', y') plane
    loop.position.set(cx(i) + 8, headY + 18.2, zF + 1.6);
  }
  const dist = detail(new T.Mesh(new T.CylinderGeometry(1.1, 1.1, run + 16, 10), matCover), intakeGrp);
  dist.rotation.z = Math.PI / 2;
  dist.position.set(xm + 8, headY + 18.2, zF - 2.2);

  // Inlet boot: elbow forward off the throttle body, then outward and down; four ribs, hose clamps at both ends,
  // dark cap for the open end
  // throttle body centre on the plenum's front end, plenum centre turned back into the slanted frame
  const xT = xm + PX / 2 + 9, yT = headY - 0.5 * plO + 0.866 * plU, zT = zF + 0.866 * plO + 0.5 * plU;
  // Bezier keeps the bend radius near 20, well above the tube radius, so the inner wall doesn't fold
  const boot = new T.CubicBezierCurve3(...[[8, 0, 0], [20, 0, 0], [26.2, -6.2, 6.2], [32, -12, 12]]
    .map(([x, y, z]) => new T.Vector3(xT + x, yT + y, zT + z)));
  const axisZ = new T.Vector3(0, 0, 1);
  const onBoot = (mesh, t) => {
    mesh.position.copy(boot.getPointAt(t));
    mesh.quaternion.setFromUnitVectors(axisZ, boot.getTangentAt(t));
    return detail(mesh, intakeGrp);
  };
  detail(new T.Mesh(new T.TubeGeometry(boot, 24, 11, 20, false), matIntake), intakeGrp);
  const ribGeo = new T.TorusGeometry(11, 0.9, 6, 20), clampGeo = new T.TorusGeometry(11.3, 1.3, 6, 20);
  for (const t of [0.2, 0.4, 0.6, 0.8]) onBoot(new T.Mesh(ribGeo, matIntake), t);
  for (const t of [0.04, 0.96]) onBoot(new T.Mesh(clampGeo, matSteelDk), t);
  onBoot(new T.Mesh(new T.CircleGeometry(10.5, 20), matCoil), 1);
  reg(intakeGrp, 'intake-manifold');

  // Throttle body: alloy housing, flange on the shell end, actuator motor on the outer side
  const throttleGrp = new T.Group();
  detail(new T.Mesh(new T.CylinderGeometry(12, 12, 18, 24), matAluDark), throttleGrp);
  detail(new T.Mesh(new T.CylinderGeometry(13.4, 13.4, 2.4, 24), matAluDark), throttleGrp).position.y = 7.8;
  detail(new T.Mesh(new T.BoxGeometry(8, 12, 12), matCover), throttleGrp).position.set(0, -1, 11);
  throttleGrp.rotation.z = Math.PI / 2;
  throttleGrp.position.set(xT, yT, zT);
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
