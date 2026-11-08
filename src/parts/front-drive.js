// Front accessory drive (pulleys, belts, alternator, PS, AC, water pump)
export function build(c) {
  const { T, matAlu, matAluDark, matSteel, matSteelDk, matCover, matBelt, matFace, reg, detail, ribbedPulley,
          crankDamper, alternatorBody, buildBelt, LEN, blockY } = c;
  // ===== FRONT ACCESSORY DRIVE (Dual belt setup) =====
  const beltX1 = LEN / 2 + 18;       // main belt plane
  const beltX2 = LEN / 2 + 28;       // secondary AC belt plane (outer crank groove)
  const bodyX = LEN / 2 + 3;

  // Pulley positions: Y, Z, R (radius). Layout per refs/front-drive/notes.md (+Z = intake side).
  const A = {
    crank:      { y: blockY - 6,  z: 0,   r: 34 },
    waterPump:  { y: blockY + 48, z: 4,   r: 18 },
    alternator: { y: blockY + 36, z: 52,  r: 13 },
    idler:      { y: blockY + 32, z: 26,  r: 9, inner: true },  // belt dips under it
    tensioner:  { y: blockY + 18, z: -36, r: 11 },
    ps:         { y: blockY - 22, z: 60,  r: 20 },
    ac:         { y: blockY - 34, z: -56, r: 17 },
    acTens:     { y: blockY - 46, z: -24, r: 8  }
  };

  // Small helper: cylinder along the crank axis (X), added to a group
  const cylX = (g, r, len, mat, x, y, z, seg = 20) => {
    const m = detail(new T.Mesh(new T.CylinderGeometry(r, r, len, seg), mat), g);
    m.rotation.z = Math.PI / 2; m.position.set(x, y, z); return m;
  };
  // Bracket plate bolted to the engine front, spanning from the face out to the accessory
  const bracket = (g, a, w, h) => {
    const m = detail(new T.Mesh(new T.BoxGeometry(6, h, w), matSteelDk), g);
    m.position.set(bodyX - 3, a.y, a.z); return m;
  };
  // Flat cast plate in the Y-Z plane, `d` thick toward +X from x. pts are [y, z] pairs.
  const plateYZ = (g, pts, d, x, mat) => {
    const s = new T.Shape(pts.map(([y, z]) => new T.Vector2(-z, y)));
    const m = detail(new T.Mesh(new T.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }), mat), g);
    m.rotation.y = Math.PI / 2; m.position.x = x; return m;
  };
  // Thin rod between two points in the Y-Z plane at x
  const rodYZ = (g, r, x, a, b, mat) => {
    const dy = b.y - a.y, dz = b.z - a.z;
    const m = detail(new T.Mesh(new T.CylinderGeometry(r, r, Math.hypot(dy, dz), 8), mat), g);
    m.rotation.x = Math.atan2(dz, dy); m.position.set(x, (a.y + b.y) / 2, (a.z + b.z) / 2); return m;
  };
  // Tensioner: round spring housing at the pivot, tapered cast arm out to the pulley hub (arm sits at x..x+4)
  const tensionerArm = (g, pul, piv, x, w) => {
    const dy = pul.y - piv.y, dz = pul.z - piv.z, L = Math.hypot(dy, dz);
    const ny = -dz / L * w, nz = dy / L * w;
    plateYZ(g, [[piv.y + ny, piv.z + nz], [pul.y + ny * 0.7, pul.z + nz * 0.7],
                [pul.y - ny * 0.7, pul.z - nz * 0.7], [piv.y - ny, piv.z - nz]], 4, x, matAlu);
    cylX(g, w, 4, matAlu, x + 2, piv.y, piv.z, 18);            // round pivot end
    cylX(g, w * 0.7, 4, matAlu, x + 2, pul.y, pul.z, 18);      // round pulley end
    cylX(g, w * 1.4, 6, matAluDark, x - 3, piv.y, piv.z, 22);  // spring housing behind the pivot
    cylX(g, w * 0.45, 2, matSteel, x + 5, piv.y, piv.z, 6);    // pivot bolt
  };

  // Crankshaft pulley / damper (dual groove)
  const damperGrp = new T.Group();
  detail(crankDamper(A.crank.r, 14, matSteelDk), damperGrp);
  const damper2 = detail(crankDamper(A.crank.r - 2, 10, matSteelDk), damperGrp);
  damper2.position.x = 10; // second groove for AC belt
  const rubber = detail(new T.Mesh(new T.RingGeometry(A.crank.r * 0.66, A.crank.r * 0.74, 40), matBelt), damperGrp);
  rubber.rotation.y = Math.PI / 2; rubber.position.x = 15.1;  // rubber damper ring between hub and rim
  for (let i = 0; i < 6; i++) { // pulley-to-hub bolt circle on the front face
    const a = i / 6 * Math.PI * 2;
    cylX(damperGrp, 2.2, 2.5, matSteel, 16.2, Math.cos(a) * 15, Math.sin(a) * 15, 6);
  }
  cylX(damperGrp, 5, 4, matSteel, 17, 0, 0, 6);  // central crank bolt
  damperGrp.position.set(beltX1, A.crank.y, A.crank.z);
  reg(damperGrp, 'pulleys');

  // Water pump (body + single groove pulley)
  const wpGrp = new T.Group();
  const wpBody = detail(new T.Mesh(new T.CylinderGeometry(18, 18, 22, 20), matAluDark), wpGrp);
  wpBody.rotation.z = Math.PI / 2; wpBody.position.set(bodyX - 16, A.waterPump.y, A.waterPump.z);
  // Smooth pulley (driven by the belt's back), lipped edges, 4 face bolts, threaded viscous-fan boss
  cylX(wpGrp, A.waterPump.r, 12, matSteelDk, beltX1, A.waterPump.y, A.waterPump.z, 32);
  for (const dx of [-5.5, 5.5]) cylX(wpGrp, A.waterPump.r + 1.5, 1, matSteelDk, beltX1 + dx, A.waterPump.y, A.waterPump.z, 32);
  for (let i = 0; i < 4; i++) {
    const a = i / 4 * Math.PI * 2 + Math.PI / 4;
    cylX(wpGrp, 1.6, 2, matSteel, beltX1 + 6.5, A.waterPump.y + Math.cos(a) * 9, A.waterPump.z + Math.sin(a) * 9, 6);
  }
  cylX(wpGrp, 4.5, 8, matSteel, beltX1 + 10, A.waterPump.y, A.waterPump.z, 16);  // fan-clutch thread boss
  cylX(wpGrp, 23, 5, matAluDark, bodyX - 3, A.waterPump.y, A.waterPump.z, 24); // mounting flange
  for (let i = 0; i < 6; i++) { // flange bolts
    const a = i / 6 * Math.PI * 2;
    cylX(wpGrp, 1.8, 3, matSteel, bodyX - 5, A.waterPump.y + Math.sin(a) * 20, A.waterPump.z + Math.cos(a) * 20, 6);
  }
  reg(wpGrp, 'water-pump');

  // Alternator (finned heavy frame + cooling fan + main pulley)
  const altGrp = new T.Group();
  const altBody = alternatorBody(19, 38, matAlu);
  altBody.position.set(bodyX - 22, A.alternator.y, A.alternator.z);
  detail(altBody, altGrp);
  const altPul = detail(ribbedPulley(A.alternator.r, 12, matSteel, 5), altGrp);
  altPul.position.set(beltX1, A.alternator.y, A.alternator.z);
  bracket(altGrp, A.alternator, 14, 12).position.y += 12;           // upper mount arm
  cylX(altGrp, 4, 6, matSteel, beltX1 + 6, A.alternator.y, A.alternator.z, 6); // pulley nut
  const altLug = detail(new T.Mesh(new T.BoxGeometry(14, 5, 12), matSteelDk), altGrp);
  altLug.position.set(bodyX - 10, A.alternator.y - 20, A.alternator.z);      // lower pivot lug
  // Drive-end housing with radial fan slots, shaft to the pulley
  const altFront = bodyX - 22 + 19;
  cylX(altGrp, 19.5, 6, matAlu, altFront + 3, A.alternator.y, A.alternator.z, 32);
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * Math.PI * 2;
    const slot = detail(new T.Mesh(new T.BoxGeometry(0.6, 7, 3.2), matFace), altGrp);
    slot.rotation.x = a;
    slot.position.set(altFront + 6.2, A.alternator.y + Math.cos(a) * 13, A.alternator.z + Math.sin(a) * 13);
  }
  cylX(altGrp, 3, 8, matSteel, altFront + 10, A.alternator.y, A.alternator.z, 12);
  // Cooling duct (unverified shape, see notes): from the rear cap round the outboard side, mouth facing forward
  const ay = A.alternator.y, az = A.alternator.z;
  const ductPath = new T.CatmullRomCurve3([
    new T.Vector3(bodyX - 44, ay, az), new T.Vector3(bodyX - 50, ay + 4, az + 16),
    new T.Vector3(bodyX - 22, ay + 8, az + 27), new T.Vector3(beltX1 + 10, ay + 8, az + 27)]);
  detail(new T.Mesh(new T.TubeGeometry(ductPath, 32, 5, 14, false), matCover), altGrp);
  cylX(altGrp, 4.5, 2, matCover, bodyX - 43, ay, az, 16);                       // flange on the rear cap
  const mouth = detail(new T.Mesh(new T.CylinderGeometry(7.5, 5, 6, 18, 1, true), matCover), altGrp);
  mouth.rotation.z = -Math.PI / 2; mouth.position.set(beltX1 + 13, ay + 8, az + 27); // flared intake
  reg(altGrp, 'alternator');

  // Power steering pump (body + pulley)
  const psGrp = new T.Group();
  const psBody = detail(new T.Mesh(new T.CylinderGeometry(16, 16, 30, 20), matAlu), psGrp);
  psBody.rotation.z = Math.PI / 2; psBody.position.set(bodyX - 20, A.ps.y, A.ps.z);
  const psPul = detail(ribbedPulley(A.ps.r, 12, matSteel, 5), psGrp);
  psPul.position.set(beltX1, A.ps.y, A.ps.z);
  bracket(psGrp, A.ps, 22, 20);
  const psRes = detail(new T.Mesh(new T.CylinderGeometry(7, 7, 18, 16), matSteelDk), psGrp); // fluid reservoir
  psRes.position.set(bodyX - 22, A.ps.y + 22, A.ps.z - 4);
  const psCap = detail(new T.Mesh(new T.CylinderGeometry(5, 5, 4, 12), matSteel), psGrp);
  psCap.position.set(bodyX - 22, A.ps.y + 33, A.ps.z - 4);
  cylX(psGrp, 4, 6, matSteel, beltX1 + 6, A.ps.y, A.ps.z, 6);
  reg(psGrp, 'power-steering-pump');

  // AC compressor (long cylindrical body + clutch pulley in front groove)
  const acGrp = new T.Group();
  const acBody = detail(new T.Mesh(new T.CylinderGeometry(20, 20, 36, 24), matAluDark), acGrp);
  acBody.rotation.z = Math.PI / 2; acBody.position.set(bodyX - 18, A.ac.y, A.ac.z);
  const acPul = detail(ribbedPulley(A.ac.r, 12, matSteelDk, 6), acGrp);
  acPul.position.set(beltX2, A.ac.y, A.ac.z); // driven by secondary belt
  bracket(acGrp, A.ac, 26, 24);
  cylX(acGrp, 11, 4, matSteel, beltX2 + 9, A.ac.y, A.ac.z, 24);   // clutch plate
  cylX(acGrp, 4, 5, matSteelDk, beltX2 + 13, A.ac.y, A.ac.z, 6);   // clutch nut
  for (const dz of [-8, 8]) { // refrigerant ports on top of the body
    const port = detail(new T.Mesh(new T.BoxGeometry(8, 8, 8), matSteelDk), acGrp);
    port.position.set(bodyX - 24, A.ac.y + 22, A.ac.z + dz);
  }
  reg(acGrp, 'ac-compressor');

  // Pulleys & Tensioners (Grouped: Main idler, Main tensioner, AC tensioner)
  const pulleysGrp = new T.Group();
  // Main belt tensioner (image_19): triangular base with two bolt ears, spring housing, arm, damper rod
  const mainTens = detail(ribbedPulley(A.tensioner.r, 11, matFace, 5), pulleysGrp);
  mainTens.position.set(beltX1, A.tensioner.y, A.tensioner.z);
  const tp = { y: A.tensioner.y - 14, z: A.tensioner.z - 10 };   // arm pivot
  const ears = [[tp.y + 4, tp.z + 16], [tp.y - 2, tp.z - 15], [tp.y - 14, tp.z + 2]];
  plateYZ(pulleysGrp, [[tp.y + 10, tp.z + 4], [tp.y + 7, tp.z + 18], [tp.y + 0, tp.z + 19],
                       [tp.y - 7, tp.z + 7], [tp.y - 17, tp.z + 5], [tp.y - 17, tp.z - 1],
                       [tp.y - 6, tp.z - 18], [tp.y + 1, tp.z - 19], [tp.y + 6, tp.z - 10]], 3, bodyX - 3, matAlu);
  for (const [y, z] of ears) cylX(pulleysGrp, 2.2, 2.5, matSteel, bodyX + 1, y, z, 6);
  tensionerArm(pulleysGrp, A.tensioner, tp, beltX1 - 10, 6);
  rodYZ(pulleysGrp, 0.9, beltX1 - 8, { y: tp.y + 4, z: tp.z + 16 }, { y: (tp.y + A.tensioner.y) / 2, z: (tp.z + A.tensioner.z) / 2 + 4 }, matSteel);
  // Main belt idler
  const mainIdler = detail(ribbedPulley(A.idler.r, 12, matSteel, 4), pulleysGrp);
  mainIdler.position.set(beltX1, A.idler.y, A.idler.z);
  // AC belt tensioner pulley
  const acTens = detail(ribbedPulley(A.acTens.r, 10, matSteel, 4), pulleysGrp);
  acTens.position.set(beltX2, A.acTens.y, A.acTens.z);
  tensionerArm(pulleysGrp, A.acTens, { y: A.acTens.y + 8, z: A.acTens.z - 16 }, beltX2 - 10, 4.5);
  for (const [a, x] of [[A.idler, beltX1], [A.tensioner, beltX1], [A.acTens, beltX2]]) // centre bolts
    cylX(pulleysGrp, 3.5, 5, matSteel, x + 7, a.y, a.z, 6);
  reg(pulleysGrp, 'pulleys');

  // Serpentine Belt 1: Main accessory belt
  const belt1 = buildBelt(
    [A.crank, A.waterPump, A.alternator, A.idler, A.tensioner, A.ps],
    beltX1, 11, 6
  );
  reg(belt1, 'serpentine-belt');

  // Serpentine Belt 2: AC compressor belt [NEW]
  const belt2 = buildBelt(
    [{ ...A.crank, r: A.crank.r - 2 }, A.acTens, A.ac],
    beltX2, 8, 4
  );
  reg(belt2, 'serpentine-belt'); // share ID with belt1 so they disassemble together

  // Fan-clutch boss nose in the upright (radiator) frame; radiator.js hangs the viscous fan here.
  const fanMount = new T.Vector3(beltX1 + 14, A.waterPump.y, A.waterPump.z)
    .applyAxisAngle(new T.Vector3(1, 0, 0), c.slantedGrp.rotation.x);
  return { fanMount };
}
