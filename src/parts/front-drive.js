// Front accessory drive (pulleys, belts, alternator, PS, AC, water pump)
export function build(c) {
  const { T, matAlu, matAluDark, matSteel, matSteelDk, reg, detail, ribbedPulley, crankDamper,
          alternatorBody, tensioner, buildBelt, LEN, blockY } = c;
  // ===== FRONT ACCESSORY DRIVE (Dual belt setup) =====
  const beltX1 = LEN / 2 + 18;       // main belt plane
  const beltX2 = LEN / 2 + 28;       // secondary AC belt plane
  const bodyX = LEN / 2 + 3;
  
  // Pulley positions: Y, Z, R (radius)
  const A = {
    crank:      { y: blockY - 6, z: 0,   r: 34 },
    waterPump:  { y: blockY + 28, z: -3,  r: 18 },
    alternator: { y: blockY + 16, z: 38,  r: 15 },
    idler:      { y: blockY + 32, z: 18,  r: 9  },
    tensioner:  { y: blockY + 10, z: -28, r: 11 },
    ps:         { y: blockY - 18, z: -34, r: 13 },
    ac:         { y: blockY - 34, z: 28,  r: 16 },
    acTens:     { y: blockY - 14, z: 24,  r: 9  }
  };

  // Crankshaft pulley / damper (dual groove)
  const damperGrp = new T.Group();
  detail(crankDamper(A.crank.r, 14, matSteelDk), damperGrp);
  const damper2 = detail(crankDamper(A.crank.r - 2, 10, matSteelDk), damperGrp);
  damper2.position.x = 10; // second groove for AC belt
  damperGrp.position.set(beltX1, A.crank.y, A.crank.z);
  reg(damperGrp, 'pulleys');

  // Water pump (body + single groove pulley)
  const wpGrp = new T.Group();
  const wpBody = detail(new T.Mesh(new T.CylinderGeometry(18, 18, 22, 20), matAluDark), wpGrp);
  wpBody.rotation.z = Math.PI / 2; wpBody.position.set(bodyX - 16, A.waterPump.y, A.waterPump.z);
  const wpPul = detail(ribbedPulley(A.waterPump.r, 12, matSteelDk, 5), wpGrp);
  wpPul.position.set(beltX1, A.waterPump.y, A.waterPump.z);
  reg(wpGrp, 'water-pump');

  // Alternator (finned heavy frame + cooling fan + main pulley)
  const altGrp = new T.Group();
  const altBody = alternatorBody(19, 38, matAlu);
  altBody.position.set(bodyX - 22, A.alternator.y, A.alternator.z);
  detail(altBody, altGrp);
  const altPul = detail(ribbedPulley(A.alternator.r, 12, matSteel, 5), altGrp);
  altPul.position.set(beltX1, A.alternator.y, A.alternator.z);
  reg(altGrp, 'alternator');

  // Power steering pump (body + pulley)
  const psGrp = new T.Group();
  const psBody = detail(new T.Mesh(new T.CylinderGeometry(16, 16, 30, 20), matAlu), psGrp);
  psBody.rotation.z = Math.PI / 2; psBody.position.set(bodyX - 20, A.ps.y, A.ps.z);
  const psPul = detail(ribbedPulley(A.ps.r, 12, matSteel, 5), psGrp);
  psPul.position.set(beltX1, A.ps.y, A.ps.z);
  reg(psGrp, 'power-steering-pump');

  // AC compressor (long cylindrical body + clutch pulley in front groove)
  const acGrp = new T.Group();
  const acBody = detail(new T.Mesh(new T.CylinderGeometry(20, 20, 36, 24), matAluDark), acGrp);
  acBody.rotation.z = Math.PI / 2; acBody.position.set(bodyX - 18, A.ac.y, A.ac.z);
  const acPul = detail(ribbedPulley(A.ac.r, 12, matSteelDk, 6), acGrp);
  acPul.position.set(beltX2, A.ac.y, A.ac.z); // driven by secondary belt
  reg(acGrp, 'ac-compressor');

  // Pulleys & Tensioners (Grouped: Main idler, Main tensioner, AC tensioner)
  const pulleysGrp = new T.Group();
  // Main belt tensioner
  const mainTens = detail(tensioner(A.tensioner.r, matSteelDk), pulleysGrp);
  mainTens.position.set(beltX1, A.tensioner.y, A.tensioner.z);
  // Main belt idler
  const mainIdler = detail(ribbedPulley(A.idler.r, 12, matSteel, 4), pulleysGrp);
  mainIdler.position.set(beltX1, A.idler.y, A.idler.z);
  // AC belt tensioner pulley
  const acTens = detail(ribbedPulley(A.acTens.r, 10, matSteel, 4), pulleysGrp);
  acTens.position.set(beltX2, A.acTens.y, A.acTens.z);
  reg(pulleysGrp, 'pulleys');

  // Serpentine Belt 1: Main accessory belt
  const belt1 = buildBelt(
    [A.crank, A.waterPump, A.alternator, A.idler, A.tensioner, A.ps],
    beltX1 + 2, 3.2
  );
  reg(belt1, 'serpentine-belt');

  // Serpentine Belt 2: AC compressor belt [NEW]
  const belt2 = buildBelt(
    [A.crank, A.acTens, A.ac],
    beltX2 + 2, 2.6
  );
  reg(belt2, 'serpentine-belt'); // share ID with belt1 so they disassemble together
}
