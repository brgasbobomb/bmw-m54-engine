// Intake manifold (molded black plastic: low plenum, six sloped runner horns with the U-rim comb, DISA pot, head flange),
// throttle body + inlet boot, fuel rail + injectors. Proportions and details: refs/intake/notes.md
export function build(c) {
  const { T, matCover, matIntake, matAluDark, matSteel, matSteelDk, matCoil, reg, detail, roundedBox,
          BW, headY, span, cx } = c;
  const zF = BW / 2;                          // head intake face
  const xm = (cx(0) + cx(5)) / 2;             // centre of the six runners
  const run = cx(5) - cx(0);                  // first-to-last runner distance
  const W = 22, H = 13;                       // runner horn width (x) and thickness
  const yP = headY + 11, zP = zF + 38;        // plenum centre
  const PH = 26, PD = 28, PX = run + W + 6;   // plenum height, depth, length
  const intakeGrp = new T.Group();

  // Plenum: long rounded tray with a thin vibration-weld flange around its middle
  detail(roundedBox(PX, PH, PD, 7, matIntake), intakeGrp).position.set(xm, yP, zP);
  detail(new T.Mesh(new T.BoxGeometry(PX + 3, 1.6, PD + 5), matCover), intakeGrp).position.set(xm, yP - 1, zP);

  // Head flange plate; hex bolts in the gaps between runners plus one past each end
  detail(roundedBox(run + W + 20, 24, 4, 1.5, matIntake), intakeGrp).position.set(xm, headY + 3, zF + 2);
  const boltGeo = new T.CylinderGeometry(3, 3, 2.4, 6);
  const boltX = [cx(0) - W / 2 - 5.5, cx(5) + W / 2 + 5.5, ...[1, 2, 3, 4, 5].map(k => cx(0) - span / 2 + k * span)];
  for (const x of boltX) {
    const b = detail(new T.Mesh(boltGeo, matSteelDk), intakeGrp);
    b.rotation.x = Math.PI / 2;
    b.position.set(x, headY + 3, zF + 4.8);
  }

  // Runner horns: each slopes from the flange up into the plenum wall. The raised U-rim (open end at the plenum)
  // plus the spine along the plenum wall is the molded "comb" seen in both manifold refs; the injector sits in the U.
  const hA = [zF + 2, headY + 3], hB = [zP - PD / 2 + 3, yP - 2];        // centre-line ends (z, y)
  const ang = Math.atan2(hB[1] - hA[1], hB[0] - hA[0]);
  const hl = Math.hypot(hB[0] - hA[0], hB[1] - hA[1]) + 3;                // horn length incl. overlap into flange/plenum
  const R = W / 2 - 2.6, top = H / 2 + 0.4;                              // rim arc radius, rim height above horn centre
  const horn = new T.Group();
  detail(roundedBox(W, H, hl, 4.5, matIntake), horn);
  const barLen = hl - R - 1.5;
  const barGeo = new T.BoxGeometry(1.8, 1.8, barLen);
  for (const s of [-1, 1]) detail(new T.Mesh(barGeo, matCover), horn).position.set(s * R, top, hl / 2 - barLen / 2);
  const tip = detail(new T.Mesh(new T.TorusGeometry(R, 0.9, 6, 14, Math.PI), matCover), horn);
  tip.rotation.x = -Math.PI / 2;                                          // half ring lying flat, bulging toward the head
  tip.position.set(0, top, -hl / 2 + R + 1.5);
  horn.rotation.x = -ang;
  horn.position.set(0, (hA[1] + hB[1]) / 2, (hA[0] + hB[0]) / 2);
  for (let i = 0; i < 6; i++) { const h = horn.clone(); h.position.x = cx(i); intakeGrp.add(h); }
  detail(new T.Mesh(new T.BoxGeometry(run + W + 2, 3, 4.5), matCover), intakeGrp).position.set(xm, yP + 4, zP - PD / 2 - 0.5);

  // DISA valve: round pot on top of the plenum between cylinders 3 and 4, with a vacuum/electrical stub toward the rear
  // shortcut: no DISA hoses and the x position is unconfirmed (see notes), upgrade with a DISA close-up photo
  const disa = new T.Group();
  detail(new T.Mesh(new T.CylinderGeometry(7, 7.6, 8, 20), matIntake), disa).position.y = 3;
  detail(new T.Mesh(new T.CylinderGeometry(8.6, 8.6, 1.6, 20), matIntake), disa).position.y = 6.8;
  detail(new T.Mesh(new T.CylinderGeometry(5, 5, 1.2, 20), matAluDark), disa).position.y = 7.4;
  const stub = detail(new T.Mesh(new T.CylinderGeometry(1.6, 1.6, 7, 8), matCoil), disa);
  stub.rotation.z = Math.PI / 2;
  stub.position.set(-9, 4, 0);
  disa.position.set(xm, yP + PH / 2, zP);
  intakeGrp.add(disa);

  // Inlet boot from the throttle body: short upward bend, four ribs, hose clamps at both ends, dark cap for the open end
  const xT = xm + PX / 2 + 9;                                             // throttle body centre
  const boot = new T.CatmullRomCurve3([
    new T.Vector3(xT + 8, yP, zP), new T.Vector3(xT + 16, yP, zP),
    new T.Vector3(xT + 22, yP + 5, zP - 1), new T.Vector3(xT + 25, yP + 15, zP - 4)
  ]);
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

  // Throttle body: alloy housing, flange on the plenum end, actuator motor on the outer side
  const throttleGrp = new T.Group();
  detail(new T.Mesh(new T.CylinderGeometry(12, 12, 18, 24), matAluDark), throttleGrp);
  detail(new T.Mesh(new T.CylinderGeometry(13.4, 13.4, 2.4, 24), matAluDark), throttleGrp).position.y = 7.8;
  detail(new T.Mesh(new T.BoxGeometry(8, 12, 12), matCover), throttleGrp).position.set(0, -1, 11);
  throttleGrp.rotation.z = Math.PI / 2;
  throttleGrp.position.set(xT, yP, zP);
  reg(throttleGrp, 'throttle-body');

  // Fuel rail along the flange's top edge; each injector stands in its runner's U-rim, connector on the outer side
  // shortcut: no rail clips, upgrade with a close-up of the rail mounting
  const injectorsGrp = new T.Group();
  const railY = headY + 18, railZ = zF + 5;
  detail(new T.Mesh(new T.BoxGeometry(run + W + 10, 4.5, 4.5), matSteel), injectorsGrp).position.set(xm, railY, railZ);
  const injGeo = new T.CylinderGeometry(2.3, 1.8, 14, 12), conGeo = new T.BoxGeometry(4.5, 4.5, 5);
  for (let i = 0; i < 6; i++) {
    detail(new T.Mesh(injGeo, matSteelDk), injectorsGrp).position.set(cx(i), railY - 9, railZ);
    detail(new T.Mesh(conGeo, matCoil), injectorsGrp).position.set(cx(i), railY - 4, railZ + 4.5);
  }
  reg(injectorsGrp, 'fuel-injectors');
}
