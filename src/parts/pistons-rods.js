// Pistons & connecting rods
export function build(c) {
  const { T, matAlu, matSteel, matSteelDk, reg, detail, blockY, cx, crankThrow, angles } = c;
  // ----- INTERNAL MECHANICS: PISTONS & CONNECTING RODS [NEW] -----
  const pistonsGrp = new T.Group();
  const rodsGrp = new T.Group();

  for (let i = 0; i < 6; i++) {
    const a = angles[i];
    const pinY = blockY - 6 + Math.cos(a) * crankThrow;
    const pinZ = Math.sin(a) * crankThrow;
    const rodLen = 52;
    // Slider-crank formula for exact piston height Y
    const pistonY = blockY - 6 + Math.cos(a) * crankThrow + Math.sqrt(rodLen * rodLen - pinZ * pinZ);

    // Pistons (silver alloy cylinders with ring grooves)
    const pistonSingle = new T.Group();
    const pBody = detail(new T.Mesh(new T.CylinderGeometry(17, 17, 18, 24), matAlu), pistonSingle);
    // Piston rings details (dark steel thin cylinders)
    const pRing1 = detail(new T.Mesh(new T.CylinderGeometry(17.2, 17.2, 0.8, 24), matSteelDk), pistonSingle);
    pRing1.position.y = 4;
    const pRing2 = detail(new T.Mesh(new T.CylinderGeometry(17.2, 17.2, 0.8, 24), matSteelDk), pistonSingle);
    pRing2.position.y = 1;
    pistonSingle.position.set(cx(i), pistonY, 0);
    detail(pistonSingle, pistonsGrp);

    // Connecting rods (H-beam steel connecting crankshaft journal to piston)
    const rodSingle = new T.Group();
    const dist = Math.hypot(pistonY - pinY, -pinZ);
    const angleX = Math.atan2(-pinZ, pistonY - pinY);

    const rBeam = detail(new T.Mesh(new T.BoxGeometry(6, dist - 16, 8), matSteel), rodSingle);
    rBeam.position.y = (pistonY - pinY) / 2;
    rBeam.position.z = pinZ / 2;
    rBeam.rotation.x = angleX;

    const rCapBig = detail(new T.Mesh(new T.CylinderGeometry(11, 11, 10, 20), matSteelDk), rodSingle);
    rCapBig.rotation.z = Math.PI / 2;
    rCapBig.position.set(0, 0, pinZ);
    
    const rCapSmall = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 8, 16), matSteelDk), rodSingle);
    rCapSmall.rotation.z = Math.PI / 2;
    rCapSmall.position.set(0, pistonY - pinY, 0);

    rodSingle.position.set(cx(i), pinY, 0);
    detail(rodSingle, rodsGrp);
  }
  reg(pistonsGrp, 'pistons');
  reg(rodsGrp, 'connecting-rods');
}
