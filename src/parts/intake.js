// Intake manifold (molded black plastic: six arched runner humps on a lower shell, weld-seam rail with clip tabs,
// head-side distribution trough, DISA unit), throttle body + inlet boot, fuel rail + injectors.
// Proportions and details: refs/intake/notes.md
export function build(c) {
  const { T, matCover, matIntake, matAluDark, matSteel, matSteelDk, matCoil, reg, detail, roundedBox,
          BW, headY, span, cx } = c;
  const zF = BW / 2;                          // head intake face
  const xm = (cx(0) + cx(5)) / 2;             // centre of the six runners
  const run = cx(5) - cx(0);                  // first-to-last runner distance
  const W = 34, L = run + W;                  // hump width (x) and overall manifold length
  const ZO = 52, YB = -6, YS = 8;             // outer wall z, bottom y (clears the oil filter cap), seam y (z from the head face, y from headY)
  const bv = 2.5;                             // hump edge rounding
  const intakeGrp = new T.Group();

  // Runner hump: arch profile (z from the face, y from headY) extruded along x; steep on the head side, long slope
  // down to the outer wall. The bevel grows the outline by bv on every side, so the profile is inset by bv.
  const top = [[ZO - bv, YS], [ZO - bv - 1.5, 27], [20, 37], [5 + bv, 12]];
  const arch = new T.Shape();
  arch.moveTo(4 + bv, YB + bv);
  arch.lineTo(ZO - bv, YB + bv);
  arch.lineTo(...top[0]);
  arch.bezierCurveTo(...top[1], ...top[2], ...top[3]);
  const humpGeo = new T.ExtrudeGeometry(arch, {
    depth: W - 2 * bv, bevelThickness: bv, bevelSize: bv, bevelSegments: 3, curveSegments: 16
  });
  humpGeo.translate(0, 0, -(W - 2 * bv) / 2);
  const runner = new T.Group();
  detail(new T.Mesh(humpGeo, matIntake), runner).rotation.y = -Math.PI / 2;   // shape x -> +z, extrusion -> x
  // two ridges along the hump top (the moulded double line in the refs), pushed out along the surface normal
  const topC = new T.CubicBezierCurve(...top.map(p => new T.Vector2(...p)));
  const ridgePts = Array.from({ length: 13 }, (_, k) => {
    const p = topC.getPoint(k / 12), d = topC.getTangent(k / 12), o = bv + 0.3;
    return new T.Vector3(0, p.y - d.x * o, p.x + d.y * o);
  });
  const ridgeGeo = new T.TubeGeometry(new T.CatmullRomCurve3(ridgePts), 24, 0.9, 6, false);
  for (const s of [-1, 1]) detail(new T.Mesh(ridgeGeo, matCover), runner).position.x = s * 10;
  runner.position.set(0, headY, zF);
  for (let i = 0; i < 6; i++) { const r = runner.clone(); r.position.x = cx(i); intakeGrp.add(r); }

  // Lower shell closes the slot floors from z = 12 outward; the strip behind it stays open as the flange bolt pocket
  detail(roundedBox(L, YS - YB, ZO - 12, 4, matIntake), intakeGrp)
    .position.set(xm, headY + (YS + YB) / 2, zF + (ZO + 12) / 2);

  // Weld-seam rail along the outer wall at the hump base, one clip tab per runner
  detail(new T.Mesh(new T.BoxGeometry(L - 4, 3, 4), matCover), intakeGrp).position.set(xm, headY + YS - 1, zF + ZO);
  const clipGeo = new T.BoxGeometry(6, 5, 3);
  for (let i = 0; i < 6; i++) detail(new T.Mesh(clipGeo, matCover), intakeGrp).position.set(cx(i), headY + YS - 4, zF + ZO + 2);

  // Head flange plate; hex bolts in the gaps between runners plus one past each end
  detail(roundedBox(L + 20, 22, 4, 1.5, matIntake), intakeGrp).position.set(xm, headY + 5, zF + 2);
  const boltGeo = new T.CylinderGeometry(3, 3, 2.4, 6);
  const boltX = [cx(0) - W / 2 - 5.5, cx(5) + W / 2 + 5.5, ...[1, 2, 3, 4, 5].map(k => cx(0) - span / 2 + k * span)];
  for (const x of boltX) {
    const b = detail(new T.Mesh(boltGeo, matSteelDk), intakeGrp);
    b.rotation.x = Math.PI / 2;
    b.position.set(x, headY + 3, zF + 4.8);
  }

  // Distribution trough along the head side between the valve cover edge and the humps, screws in the runner gaps
  detail(roundedBox(L - 2, 6, 9, 1.5, matIntake), intakeGrp).position.set(xm, headY + 17, zF + 4);
  const screwGeo = new T.CylinderGeometry(2.2, 2.2, 1.6, 6);
  for (const x of boltX) detail(new T.Mesh(screwGeo, matSteelDk), intakeGrp).position.set(x, headY + 20.8, zF + 6.2);

  // DISA unit: housing on the outer wall at mid-length (between cylinders 3 and 4), round vacuum actuator on its face
  // shortcut: no vacuum hose or electrical lead, upgrade with a DISA close-up photo
  const disa = new T.Group();
  detail(roundedBox(20, 14, 7, 2.5, matIntake), disa);
  const can = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 8, 20), matSteelDk), disa);
  const cap = detail(new T.Mesh(new T.CylinderGeometry(6.4, 6.4, 1.6, 20), matAluDark), disa);
  can.rotation.x = cap.rotation.x = Math.PI / 2;
  can.position.z = 7.5;
  cap.position.z = 12.3;
  detail(new T.Mesh(new T.CylinderGeometry(1.4, 1.4, 5, 8), matCoil), disa).position.set(0, 8, 7.5);
  disa.position.set(xm, headY - 1, zF + ZO + 2.5);
  intakeGrp.add(disa);

  // Inlet boot from the throttle body: short run forward, then down and outward; four ribs, hose clamps at both ends,
  // dark cap for the open end
  const xT = xm + L / 2 + 9, yT = headY + 6, zT = zF + 30;                  // throttle body centre
  const boot = new T.CatmullRomCurve3([
    new T.Vector3(xT + 8, yT, zT), new T.Vector3(xT + 16, yT, zT),
    new T.Vector3(xT + 23, yT - 3, zT + 3), new T.Vector3(xT + 27, yT - 12, zT + 8)
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

  // Throttle body: alloy housing, flange on the manifold end, actuator motor on the outer side
  const throttleGrp = new T.Group();
  detail(new T.Mesh(new T.CylinderGeometry(12, 12, 18, 24), matAluDark), throttleGrp);
  detail(new T.Mesh(new T.CylinderGeometry(13.4, 13.4, 2.4, 24), matAluDark), throttleGrp).position.y = 7.8;
  detail(new T.Mesh(new T.BoxGeometry(8, 12, 12), matCover), throttleGrp).position.set(0, -1, 11);
  throttleGrp.rotation.z = Math.PI / 2;
  throttleGrp.position.set(xT, yT, zT);
  reg(throttleGrp, 'throttle-body');

  // Fuel rail beside the valve cover, standing on the trough; injectors reach down into it, each with its connector
  // and pink lock tab on the outer side
  // shortcut: no rail clips, upgrade with a close-up of the rail mounting
  const injectorsGrp = new T.Group();
  const railY = headY + 26, railZ = zF + 1.5;
  const matPink = new T.MeshStandardMaterial({ color: 0xd0407f, roughness: 0.55 });
  detail(new T.Mesh(new T.BoxGeometry(L - 6, 4.5, 4.5), matSteel), injectorsGrp).position.set(xm, railY, railZ);
  const injGeo = new T.CylinderGeometry(2.3, 1.8, 14, 12), conGeo = new T.BoxGeometry(4.5, 4.5, 5), tabGeo = new T.BoxGeometry(3, 1.2, 3);
  for (let i = 0; i < 6; i++) {
    detail(new T.Mesh(injGeo, matSteelDk), injectorsGrp).position.set(cx(i), railY - 6.5, railZ);
    detail(new T.Mesh(conGeo, matCoil), injectorsGrp).position.set(cx(i), railY - 1, railZ + 4.5);
    detail(new T.Mesh(tabGeo, matPink), injectorsGrp).position.set(cx(i), railY + 1.8, railZ + 4.5);
  }
  reg(injectorsGrp, 'fuel-injectors');
}
