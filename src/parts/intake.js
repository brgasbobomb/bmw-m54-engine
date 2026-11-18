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

  // Hammerhead: both plenum ends turn up on the outer side (stand photo), beside the end runners
  const eh = { o0: 58, o1: pl.o1 + 2, u0: 12, u1: 52 }, ehD = 9;
  const ehShape = new T.Shape().moveTo(eh.o0, eh.u0).lineTo(eh.o1, eh.u0).lineTo(eh.o1, eh.u1 - 8)
    .quadraticCurveTo(eh.o1, eh.u1, eh.o1 - 8, eh.u1).lineTo(eh.o0 + 8, eh.u1).quadraticCurveTo(eh.o0, eh.u1, eh.o0, eh.u1 - 8).lineTo(eh.o0, eh.u0);
  const ehGeo = new T.ExtrudeGeometry(ehShape, { depth: ehD, bevelEnabled: true, bevelThickness: 2, bevelSize: 2, bevelSegments: 3, curveSegments: 8 });
  for (const s of [-1, 1]) {
    const e = detail(new T.Mesh(ehGeo, matIntake), car);
    e.rotation.y = -Math.PI / 2;
    e.position.x = s > 0 ? xm + PX / 2 - 2 : xm - PX / 2 + ehD + 2;   // extrusion runs toward -x; outer face flush with the plenum end
  }

  // Runners: flattened-oval tubes (r 7, x2: 28 wide, 14 thick) off the port rising 30 deg, over the crest, down the outer
  // side, ending inside the plenum. The outer drop stands ~5 proud of the plenum wall, as the ribbed outer face.
  const path = new T.CatmullRomCurve3([[-2, 4.5], [10, 13], [22, 33], [36, 40], [58, 40], [78, 35], [91, 21], [88, 7], [72, 6]]
    .map(([o, u]) => P(o, u)), false, 'centripetal');
  const tubeGeo = new T.TubeGeometry(path, 120, 7, 18, false);
  const bossGeo2 = new T.CylinderGeometry(2.2, 2.6, 5, 10);
  for (let i = 0; i < 6; i++) {
    const r = detail(new T.Mesh(tubeGeo, matIntake), car);
    r.scale.x = 2;
    r.position.x = cx(i);
    detail(new T.Mesh(bossGeo2, matIntake), car).position.set(cx(i) + 6, 48, 46);    // vacuum stub on the crest
  }

  // Plenum seams: lip along the bottom of the outer wall, vertical seam at mid-length between the two halves
  detail(new T.Mesh(new T.BoxGeometry(PX + 2, 2.4, 3), matCover), car).position.set(xm, pl.u0 + 1, pl.o1 + 3.5);
  detail(new T.Mesh(new T.BoxGeometry(2, pl.u1 - pl.u0 + 6, 2), matCover), car).position.set(xm, plU, pl.o1 + 3);

  // DISA valve (user photos 2026-11-18): boxy black housing ~70 long on the outer wall at mid-length near the bottom,
  // lid seam, round actuator can on its front end with a plug above it; white label on the plenum behind it.
  const disaGrp = new T.Group();
  disaGrp.rotation.x = Math.PI / 6; disaGrp.position.set(0, headY, zF);   // same upright frame as `car`
  const dX = xm - 4, dO = pl.o1 + 3 + 9;
  detail(roundedBox(70, 24, 18, 4, matCover), disaGrp).position.set(dX, 7, dO);
  detail(roundedBox(72, 2, 19, 1, matIntake), disaGrp).position.set(dX, 14, dO);
  const can = detail(new T.Mesh(new T.CylinderGeometry(9, 9, 12, 24).rotateZ(Math.PI / 2), matCover), disaGrp);
  can.position.set(dX + 41, 5, dO - 2);
  detail(new T.Mesh(new T.CylinderGeometry(5.5, 5.5, 3, 20).rotateZ(Math.PI / 2), matCoil), disaGrp).position.set(dX + 48, 5, dO - 2);
  detail(new T.Mesh(new T.BoxGeometry(6, 6, 7), matCoil), disaGrp).position.set(dX + 36, 15, dO - 2);
  const label = detail(new T.Mesh(new T.PlaneGeometry(26, 9), new T.MeshStandardMaterial({ color: 0xe8e8e4, roughness: 0.6 })), disaGrp);
  label.rotation.y = Math.PI / 2; label.position.set(xm - 52, 12, pl.o1 + 3.2);

  reg(disaGrp, 'disa-valve');

  // Intake air temperature sensor: on the plenum top at the rear end, past runner 1
  const xI = xm - PX / 2 + 5;
  detail(new T.Mesh(new T.CylinderGeometry(2.6, 2.6, 6, 12), matCover), car).position.set(xI, pl.u1 + 5, plO - 8);
  detail(new T.Mesh(new T.BoxGeometry(4.5, 3.5, 4), matCoil), car).position.set(xI, pl.u1 + 9.5, plO - 8);

  // Head flange; collar nuts in two rows, in the slots and past each end. A web under each slot closes the
  // dark pocket seen from above.
  detail(roundedBox(run + W + 24, 27, 4, 1.5, matIntake), intakeGrp).position.set(xm, headY + 5, zF + 1);   // bottom 1 over the oil filter
  const nutGeo = new T.CylinderGeometry(2.9, 2.9, 2.4, 6), collarGeo = new T.CylinderGeometry(3.5, 3.5, 0.8, 16);
  // Port bosses: raised bevelled ovals around each port (user photos: bumps around each port; oval ports, 7 bolts alternating high/low between and outside the ports)
  const rimShape = new T.Shape().absellipse(0, 0, 17, 12, 0, Math.PI * 2);
  rimShape.holes.push(new T.Path().absellipse(0, 0, 12.4, 9.2, 0, Math.PI * 2, true));
  const rimGeo = new T.ExtrudeGeometry(rimShape, { depth: 3, bevelEnabled: true, bevelThickness: 1.2, bevelSize: 1.2, bevelSegments: 3, curveSegments: 24 });
  for (let i = 0; i < 6; i++) {
    detail(new T.Mesh(rimGeo, matIntake), intakeGrp).position.set(cx(i), headY + 5, zF + 3);
  }
  [cx(0) - W / 2 - 6, ...gaps, cx(5) + W / 2 + 6].forEach((x, k) => { const y = k % 2 ? -3.5 : 13.5;
    for (const [geo, z] of [[nutGeo, 5.4], [collarGeo, 4.2]]) {
      const n = detail(new T.Mesh(geo, matSteelDk), intakeGrp);
      n.rotation.x = Math.PI / 2;
      n.position.set(x, headY + y, zF + z);
    }
  });

  // Idle-air distribution frame (3D scans): a spine along the runner crests and one U per runner lying on the
  // runner top, legs 17 apart, round end toward the head; an idle-air nipple stands inside each U.
  // Moulded into the runner skin (stand photo: a low ridge on each hump), so the rib follows the runner top surface.
  // surf(x, o): up of the runner top at lateral offset x (scaled-ellipse section, 7 thick × 14 half-wide) and out o, rising arch.
  const rise = path.getPoints(240), surf = (x, o) => {
    const h = 7 * Math.sqrt(1 - (x / 14) ** 2);
    let best = -1e9;
    for (let k = 1; k < rise.length; k++) {
      const a = rise[k - 1], b = rise[k], dz = b.z - a.z, dy = b.y - a.y, l = Math.hypot(dz, dy);
      const so = a.z - dy / l * h, su = a.y + dz / l * h;   // surface point above a
      if (Math.abs(so - o) < 1.5) best = Math.max(best, su);
    }
    return best;
  };
  const uPts = [];
  for (let k = 0; k <= 4; k++) uPts.push([-8.5, 36 - 5 * k]);
  for (let k = 1; k < 12; k++) { const a = Math.PI * k / 12; uPts.push([-8.5 * Math.cos(a), 16 - 8.5 * Math.sin(a)]); }
  for (let k = 0; k <= 4; k++) uPts.push([8.5, 16 + 5 * k]);
  const uGeo = new T.TubeGeometry(new T.CatmullRomCurve3(uPts.map(([x, o]) => new T.Vector3(x, surf(x, o) + 0.3, o))), 48, 1.6, 8, false);
  const nipGeo = new T.CylinderGeometry(1.3, 1.6, 5, 8);
  for (let i = 0; i < 6; i++) {
    detail(new T.Mesh(uGeo, matIntake), car).position.x = cx(i);
    detail(new T.Mesh(nipGeo, matIntake), car).position.set(cx(i), surf(0, 24) + 1.5, 24);
  }
  // Spine along the crest, half sunk into the runner tops (top 47)
  detail(new T.Mesh(new T.BoxGeometry(run + 22, 3, 7), matIntake), car).position.set(xm, 46.5, 37);

  // Throttle mount (3D scans): a neck under the plenum at mid-length, a little toward the front, ending in a square
  // 4-bolt flange that faces outward; (no sheet bracket: it read as a floating panel).
  const xT = xm + 8, uT = pl.u0 - 15, oT = 66;  // throttle bore centre (car frame); flange face at oT + 7
  detail(roundedBox(34, 30, 22, 4, matIntake), car).position.set(xT, uT + 4, oT - 4);
  detail(roundedBox(36, 36, 3, 3, matIntake), car).position.set(xT, uT, oT + 5.5);

  // Idle valve under the plenum behind the throttle neck, on its rubber-mounted bracket
  const iv = detail(new T.Mesh(new T.CylinderGeometry(5, 5, 26, 14), matCover), car);
  iv.rotation.z = Math.PI / 2;
  iv.position.set(xT - 34, uT + 2, oT - 6);

  // Inlet boot (refs/intake/air intake hose.jpeg): one fat elbow out of the throttle body outward, bending forward
  // and rising a little to the MAF on the airbox (airbox.js builds from `bootEnd`). Radius grows from the throttle to
  // the MAF; raised rib cage over the body, flat cuff with a tab at the throttle end, clamp at the MAF end, and a
  // corrugated idle-air hose off its rear side to the idle valve.
  const V = (x, u, o) => new T.Vector3(x, u, o);
  const org = V(0, headY, zF).applyAxisAngle(V(1, 0, 0), -Math.PI / 6);  // car-group origin, upright engine frame
  const bootEnd = V(28, 42, 108);                                          // MAF rear face, upright engine frame (moved 6 back, 6 up: short elbow)
  const e = bootEnd.clone().add(V(9, 0, 0)).sub(org), b0 = oT + 20;       // boot slips 9 over the MAF spigot
  const boot = new T.CubicBezierCurve3(V(xT, uT, b0), V(xT, uT, b0 + 10), V(e.x - 14, e.y, e.z), e);
  const TS = 48, RS = 24, rB = t => 13.6 + 3.4 * t * t * (3 - 2 * t);   // OD ≈ throttle body, flares to clamp over the MAF (r 17)
  const bootGeo = new T.TubeGeometry(boot, TS, 1, RS, false);
  const bp = bootGeo.attributes.position, q = V(0, 0, 0);
  for (let k = 0; k < bp.count; k++) {        // scale each ring of the unit tube to rB (vertex rings follow getPointAt)
    const t = Math.floor(k / (RS + 1)) / TS, p0 = boot.getPointAt(t);
    q.fromBufferAttribute(bp, k).sub(p0).multiplyScalar(rB(t)).add(p0);
    bp.setXYZ(k, q.x, q.y, q.z);
  }
  detail(new T.Mesh(bootGeo, matIntake), car);
  const axisZ = V(0, 0, 1);
  const onBoot = (mesh, t) => {
    mesh.position.copy(boot.getPointAt(t));
    mesh.quaternion.setFromUnitVectors(axisZ, boot.getTangentAt(t));
    return detail(mesh, car);
  };
  for (const t of [0.3, 0.45, 0.6, 0.75]) onBoot(new T.Mesh(new T.TorusGeometry(rB(t) + 0.4, 1.1, 6, 28), matIntake), t);
  for (let a = 0; a < 4; a++) {               // lengthwise cage ribs, a quarter turn apart
    const pts = [];
    for (let i = 10; i <= 38; i += 2) {
      const t = i / TS, n = bootGeo.normals[i], bn = bootGeo.binormals[i], r = rB(t) + 0.4;
      pts.push(boot.getPointAt(t).addScaledVector(n, r * Math.cos(a * Math.PI / 2)).addScaledVector(bn, r * Math.sin(a * Math.PI / 2)));
    }
    detail(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 24, 1.1, 6, false), matIntake), car);
  }
  onBoot(new T.Mesh(new T.CylinderGeometry(14.8, 14.8, 8, 28).rotateX(Math.PI / 2), matIntake), 0.035);
  detail(new T.Mesh(new T.BoxGeometry(10, 7, 3), matIntake), car).position.set(xT, uT - 17.5, b0 + 4);
  onBoot(new T.Mesh(new T.TorusGeometry(rB(1) + 0.3, 1.4, 6, 28), matSteelDk), 0.96);
  // Idle-air hose: corrugated, from the boot's rear side round to the idle valve's rear end
  const icv = new T.CatmullRomCurve3([V(xT - 14, uT - 2, b0 + 8), V(xT - 28, uT - 4, b0 + 4), V(xT - 50, uT - 2, oT + 10),
                                      V(xT - 58, uT + 2, oT - 2), V(xT - 48, uT + 2, oT - 6)]);
  detail(new T.Mesh(new T.TubeGeometry(icv, 40, 2.8, 10, false), matIntake), car);
  const corrGeo = new T.TorusGeometry(3.1, 0.8, 5, 12);
  for (let t = 0.12; t < 0.86; t += 0.035) {
    const m = detail(new T.Mesh(corrGeo, matIntake), car);
    m.position.copy(icv.getPointAt(t));
    m.quaternion.setFromUnitVectors(axisZ, icv.getTangentAt(t));
  }
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
  return { bootEnd };
}
