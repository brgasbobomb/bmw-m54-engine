// Exhaust manifolds & O2 sensors
export function build(c) {
  const { T, matExhaust, matSteel, reg, detail, BW, headY, cx } = c;
  // ----- EXHAUST MANIFOLD (2 separate tubular headers with Catalytic Converters) -----
  const exGrp = new T.Group();
  // M54B30 twin 3-into-1 stainless headers
  const manifoldBanks = [
    { start: 0, end: 3, midX: -60 },
    { start: 3, end: 6, midX: 60 }
  ];
  manifoldBanks.forEach((bank, idx) => {
    // Catalytic converter canister
    const cat = detail(new T.Mesh(new T.CylinderGeometry(15, 15, 34, 24), matExhaust), exGrp);
    cat.position.set(bank.midX, headY - 32, -BW / 2 - 22);
    cat.rotation.x = 0.5;

    for (let i = bank.start; i < bank.end; i++) {
      const exCurve = new T.CatmullRomCurve3([
        new T.Vector3(cx(i), headY - 2, -BW / 2 + 2),       // port
        new T.Vector3(cx(i) * 0.9 + bank.midX * 0.1, headY - 14, -BW / 2 - 12),
        new T.Vector3(bank.midX, headY - 30, -BW / 2 - 20)  // merge into cat
      ]);
      detail(new T.Mesh(new T.TubeGeometry(exCurve, 20, 6.2, 12, false), matExhaust), exGrp);
    }
    
    // Downpipe extending from cat
    const downpipeCurve = new T.CatmullRomCurve3([
      new T.Vector3(bank.midX, headY - 48, -BW / 2 - 30),
      new T.Vector3(bank.midX - 10, headY - 70, -BW / 2 - 34)
    ]);
    detail(new T.Mesh(new T.TubeGeometry(downpipeCurve, 10, 8.5, 12, false), matExhaust), exGrp);
  });
  reg(exGrp, 'exhaust-manifold');

  // Oxygen Sensors (4 total: 2 pre-cat, 2 post-cat)
  const o2Grp = new T.Group();
  manifoldBanks.forEach(bank => {
    // Pre-cat sensor
    const o2Pre = detail(new T.Mesh(new T.CylinderGeometry(2, 2, 8, 10), matSteel), o2Grp);
    o2Pre.position.set(bank.midX, headY - 18, -BW / 2 - 16);
    o2Pre.rotation.x = -0.5;
    // Post-cat sensor
    const o2Post = detail(new T.Mesh(new T.CylinderGeometry(2, 2, 8, 10), matSteel), o2Grp);
    o2Post.position.set(bank.midX - 8, headY - 58, -BW / 2 - 32);
    o2Post.rotation.x = -0.5;
  });
  reg(o2Grp, 'oxygen-sensors');
}
