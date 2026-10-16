// Radiator & fans
export function build(c) {
  const { T, matCover, matSteelDk, matRadiator, reg, detail, LEN, blockY } = c;
  // ----- RADIATOR & FANS [NEW] -----
  const radGrp = new T.Group();
  // Radiator center core grid
  detail(new T.Mesh(new T.BoxGeometry(10, 100, 130), matRadiator), radGrp);
  // Frame surround
  detail(new T.Mesh(new T.BoxGeometry(12, 110, 138), matCover), radGrp);
  // Top & bottom caps
  const capT = detail(new T.Mesh(new T.BoxGeometry(14, 6, 138), matCover), radGrp);
  capT.position.y = 53;
  const capB = detail(new T.Mesh(new T.BoxGeometry(14, 6, 138), matCover), radGrp);
  capB.position.y = -53;

  // Dual fans shroud & blades on engine side (-X side)
  const fanZ = [-28, 28];
  fanZ.forEach(fz => {
    const shroud = detail(new T.Mesh(new T.CylinderGeometry(24, 24, 6, 24), matCover), radGrp);
    shroud.rotation.z = Math.PI / 2;
    shroud.position.set(-6, 0, fz);
    const motor = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 8, 12), matSteelDk), radGrp);
    motor.rotation.z = Math.PI / 2;
    motor.position.set(-10, 0, fz);
    // Fan blades
    for (let b = 0; b < 7; b++) {
      const a = (b / 7) * Math.PI * 2;
      const blade = detail(new T.Mesh(new T.BoxGeometry(1, 20, 4), matCover), radGrp);
      blade.position.set(-8, Math.cos(a) * 11, fz + Math.sin(a) * 11);
      blade.rotation.x = a + 0.3;
    }
  });

  radGrp.position.set(LEN / 2 + 105, blockY, 0);
  reg(radGrp, 'radiator', false); // Radiator sits straight, NOT slanted!
}
