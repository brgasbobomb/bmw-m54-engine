// Oil pan: RWD E46 cast pan, deep sump at front (+X), shallow rear with sloped ramp. See refs/oil-pan/notes.md
export function build(c) {
  const { T, matAluDark, matSteel, reg, detail, roundedBox, LEN, BW, BH, blockY } = c;
  const panGrp = new T.Group();
  const W = BW - 6, L = LEN - 16;
  // Mating flange
  detail(roundedBox(L, 12, BW + 2, 4, matAluDark), panGrp);

  // Side profile (X,Y) extruded across Z: shallow rear, smooth ramp, deep front, sloped front face
  const s = new T.Shape();
  s.moveTo(-L / 2, -6);
  s.lineTo(-L / 2, -20);
  s.lineTo(-L * 0.08, -20);
  s.bezierCurveTo(-L * 0.02, -20, -L * 0.02, -40, L * 0.06, -40);
  s.lineTo(L * 0.38, -40);
  s.lineTo(L / 2, -14);
  s.lineTo(L / 2, -6);
  s.closePath();
  const body = detail(new T.Mesh(new T.ExtrudeGeometry(s, { depth: W, bevelEnabled: false }), matAluDark), panGrp);
  body.position.z = -W / 2;

  // Ribs on the shallow rear section, both sides
  for (const sz of [1, -1]) for (const x of [-0.42, -0.34, -0.26]) {
    const rib = detail(roundedBox(4, 12, 3, 1, matAluDark), panGrp);
    rib.position.set(x * L, -13, sz * (W / 2 + 1));
  }
  // Flange bolts along both long edges
  const bolts = 10;
  for (const sz of [1, -1]) for (let i = 0; i < bolts; i++) {
    const b = detail(new T.Mesh(new T.CylinderGeometry(2.2, 2.2, 2, 6), matSteel), panGrp);
    b.position.set(-L / 2 + 8 + (i * (L - 16)) / (bolts - 1), -6.5, sz * (BW / 2 - 1));
  }
  // Drain plug, low on the deep section's intake-side wall
  const plug = detail(new T.Mesh(new T.CylinderGeometry(4, 4, 3, 12), matSteel), panGrp);
  plug.position.set(L * 0.22, -35, W / 2 + 1);
  plug.rotation.x = Math.PI / 2;
  // Oil level sensor, front-lower of the deep section
  const sensor = detail(roundedBox(10, 8, 8, 2, matSteel), panGrp);
  sensor.position.set(L / 2 - 6, -24, 0);
  // Dipstick tube stub, exhaust side near the front
  const tube = detail(new T.Mesh(new T.CylinderGeometry(2.5, 2.5, 26, 8), matSteel), panGrp);
  tube.position.set(L * 0.3, 7, -W / 2 + 2);

  panGrp.position.y = blockY - BH / 2 - 6;
  reg(panGrp, 'oil-pan');
}
