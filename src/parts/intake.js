// Intake manifold (moulded black plastic): six arched runner humps over a lower-shell plenum, weld-seam rail,
// DISA on the outer wall, idle-air distribution piece, head flange with two rows of collar nuts;
// throttle body + inlet boot; fuel rail + injectors. Proportions and details: refs/intake/notes.md
export function build(c) {
  const { T, matCover, matIntake, matAluDark, matSteel, matSteelDk, matCoil, reg, detail, roundedBox,
          BW, headY, span, cx } = c;
  const zF = BW / 2 + 1;                      // head intake face (the head is BW + 2 deep)
  const xm = (cx(0) + cx(5)) / 2;             // centre of the six runners
  const run = cx(5) - cx(0);                  // first-to-last runner distance
  const W = 33, PX = run + W + 12;            // hump width (leaves a ~7.7 slot), lower-shell length
  const gaps = [1, 2, 3, 4, 5].map(k => cx(k) - span / 2);
  const intakeGrp = new T.Group();

  // Profiles are drawn in (z', y') = (out from the head face, up from headY) and extruded along x. The bevel pushes
  // every wall out by b and rounds the ends, so each contour is drawn b inside the visible surface.
  const extrude = (shape, len, b, segs) => {
    const geo = new T.ExtrudeGeometry(shape, { depth: len - 2 * b, bevelEnabled: true, bevelThickness: b,
                                               bevelSize: b, bevelSegments: segs, steps: 1, curveSegments: 12 });
    geo.translate(0, 0, b - len / 2);
    const m = new T.Mesh(geo, matIntake);
    m.rotation.y = -Math.PI / 2;              // shape x -> z', extrusion -> x
    return m;
  };

  // Lower shell (plenum): the outer wall leans 30 deg here so it stands vertical in the car, 4 short of the
  // expansion tank; floor 3 above the oil cooler, inner wall just outside the oil filter
  const shell = new T.Shape().moveTo(32, -7.5).lineTo(59.9, -4).lineTo(49.5, -22).quadraticCurveTo(47.2, -26, 43.2, -26)
    .lineTo(36, -26).quadraticCurveTo(32, -26, 32, -22).lineTo(32, -7.5);
  detail(extrude(shell, PX, 4, 3), intakeGrp).position.set(xm, headY, zF);

  // Runner humps: neck off the flange, steep face up from the head side, long arched top (about level in the car)
  // down to the seam rail. The underside clears the oil-filter cap, then dives into the shell.
  const top = p => p.bezierCurveTo(13, 18, 18, 25, 26, 25).bezierCurveTo(41, 25, 51.3, 10.6, 60.3, 1.6);
  const hump = new T.Group();
  detail(extrude(top(new T.Shape().moveTo(6, 0).lineTo(6, 10).lineTo(10, 10))
    .lineTo(49, -10).lineTo(38, -10).lineTo(38, 0).lineTo(6, 0), W, 5, 4), hump);
  // Moulded double ridge: the top path pushed out onto the visible surface
  const rp = top(new T.Path().moveTo(10, 10)).getPoints(8);
  const ridgeGeo = new T.TubeGeometry(new T.CatmullRomCurve3(rp.slice(2, -1).map((p, i) => {
    const d = rp[i + 3].clone().sub(rp[i + 1]).normalize();
    return new T.Vector3(0, p.y + 5.3 * d.x, p.x - 5.3 * d.y);
  })), 24, 0.9, 6, false);
  for (const s of [-1, 1]) detail(new T.Mesh(ridgeGeo, matIntake), hump).position.x = 3 * s;
  hump.position.set(0, headY, zF);
  for (let i = 0; i < 6; i++) { const h = hump.clone(); h.position.x = cx(i); intakeGrp.add(h); }

  // Head flange; collar nuts in two rows, in the slots and past each end. A web under each slot closes the
  // dark pocket seen from above.
  detail(roundedBox(run + W + 20, 22, 4, 1.5, matIntake), intakeGrp).position.set(xm, headY + 5, zF + 1);   // bottom 1 over the oil filter
  const nutGeo = new T.CylinderGeometry(2.9, 2.9, 2.4, 6), collarGeo = new T.CylinderGeometry(3.5, 3.5, 0.8, 16);
  for (const x of [cx(0) - W / 2 - 5, ...gaps, cx(5) + W / 2 + 5]) for (const y of [-2.5, 12.5]) {
    for (const [geo, z] of [[nutGeo, 4.6], [collarGeo, 3.4]]) {
      const n = detail(new T.Mesh(geo, matSteelDk), intakeGrp);
      n.rotation.x = Math.PI / 2;
      n.position.set(x, headY + y, zF + z);
    }
  }
  const webGeo = new T.BoxGeometry(span - W + 1.5, 2, 12);
  for (const x of gaps) detail(new T.Mesh(webGeo, matIntake), intakeGrp).position.set(x, headY + 6, zF + 9);

  // Injector boss and idle-air nipple on each neck; the distribution piece runs along the head side and loops
  // over into every nipple
  const bossGeo = new T.CylinderGeometry(3.4, 3.4, 3, 14), nipGeo = new T.CylinderGeometry(1.3, 1.3, 3.2, 8);
  const loopGeo = new T.TorusGeometry(3.8, 1, 6, 12, Math.PI);
  for (let i = 0; i < 6; i++) {
    detail(new T.Mesh(bossGeo, matIntake), intakeGrp).position.set(cx(i), headY + 15.5, zF + 3.5);
    detail(new T.Mesh(nipGeo, matIntake), intakeGrp).position.set(cx(i) + 8, headY + 16.6, zF + 5.4);
    const loop = detail(new T.Mesh(loopGeo, matCover), intakeGrp);
    loop.rotation.y = Math.PI / 2;            // half ring standing in the (z', y') plane
    loop.position.set(cx(i) + 8, headY + 18.2, zF + 1.6);
  }
  const dist = detail(new T.Mesh(new T.CylinderGeometry(1.1, 1.1, run + 16, 10), matCover), intakeGrp);
  dist.rotation.z = Math.PI / 2;
  dist.position.set(xm + 8, headY + 18.2, zF - 2.2);

  // Intake air temperature sensor: vertical boss on the shell top at the rear end, head side
  const xI = xm - PX / 2 + 3;
  detail(new T.Mesh(new T.CylinderGeometry(2.6, 2.6, 7, 12), matCover), intakeGrp).position.set(xI, headY - 2.5, zF + 33);
  detail(new T.Mesh(new T.BoxGeometry(4.5, 3.5, 4), matCoil), intakeGrp).position.set(xI, headY + 2.7, zF + 33);

  // Outer wall details in an upright frame (y = up in the car, z = outward, origin on the wall at the rail):
  // weld-seam rail with clip tabs, vertical seam between the plenum halves, DISA adjuster over it
  // shortcut: DISA screw and the two lugs under the shell are left out, upgrade with an underside photo
  const wall = new T.Group();
  detail(new T.Mesh(new T.BoxGeometry(PX + 1, 2.4, 3), matCover), wall);
  const tabGeo = new T.BoxGeometry(5, 3.2, 1.2);
  for (let i = 0; i < 6; i++) detail(new T.Mesh(tabGeo, matCover), wall).position.set(cx(i) - xm, -2.8, 0.5);
  detail(new T.Mesh(new T.BoxGeometry(1.8, 25, 1.2), matCover), wall).position.set(0, -13.5, 0.3);
  for (const [r, h, z, mat] of [[9.6, 1.4, 0.6, matIntake], [8, 6, 3, matCover]]) {
    const d = detail(new T.Mesh(new T.CylinderGeometry(r, r, h, 24), mat), wall);
    d.rotation.x = Math.PI / 2;
    d.position.set(0, -16, z);
  }
  detail(new T.Mesh(new T.BoxGeometry(11, 9, 7), matCover), wall).position.set(12.5, -16, 3.5);   // DISA actuator
  detail(new T.Mesh(new T.BoxGeometry(4, 4, 4), matCoil), wall).position.set(12.5, -9.5, 3.5);    // its connector
  wall.rotation.x = Math.PI / 6;
  wall.position.set(xm, headY + 1, zF + 67.4);
  intakeGrp.add(wall);

  // Inlet boot: elbow forward off the throttle body, then outward and down; four ribs, hose clamps at both ends,
  // dark cap for the open end
  const xT = xm + PX / 2 + 9, yT = headY - 16, zT = zF + 45;     // throttle body centre, on the shell's front end
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
