// Engine block
export function build(c) {
  const { T, matBlock, matAluDark, reg, detail, roundedBox, LEN, BW, BH, blockY, cx } = c;
  // ----- ENGINE BLOCK -----
  const blockGrp = new T.Group();
  // Main block casing
  detail(roundedBox(LEN, BH, BW, 8, matBlock), blockGrp);
  // Cylinder bores (6 hollow visual channels on top)
  for (let i = 0; i < 6; i++) {
    const bore = detail(new T.Mesh(new T.CylinderGeometry(18, 18, BH - 8, 24), new T.MeshStandardMaterial({ color: 0x101012, roughness: 0.9 })), blockGrp);
    bore.position.set(cx(i), 4, 0);
    // External reinforcing structural ribs on block sides
    const ribL = detail(new T.Mesh(new T.BoxGeometry(4, BH - 12, 3), matBlock), blockGrp);
    ribL.position.set(cx(i), 0, BW / 2 + 1);
    const ribR = detail(new T.Mesh(new T.BoxGeometry(4, BH - 12, 3), matBlock), blockGrp);
    ribR.position.set(cx(i), 0, -BW / 2 - 1);
  }
  // Block engine mounts
  [-1, 1].forEach(sgn => {
    const mount = detail(new T.Mesh(new T.BoxGeometry(32, 14, 20), matAluDark), blockGrp);
    mount.position.set(sgn * (LEN / 2 - 40), blockY - 14, sgn * (BW / 2 + 9));
  });
  reg(blockGrp, 'engine-block');
}
