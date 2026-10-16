// Cylinder head
export function build(c) {
  const { T, matBlock, matSteelDk, reg, detail, roundedBox, LEN, BW, HEAD_H, headY, cx } = c;
  // ----- CYLINDER HEAD -----
  const headGrp = new T.Group();
  // Head main casting
  detail(roundedBox(LEN, HEAD_H, BW + 2, 5, matBlock), headGrp);
  // Hollowed top camshaft pocket
  const pocket = detail(new T.Mesh(new T.BoxGeometry(LEN - 20, 10, BW - 10), new T.MeshStandardMaterial({ color: 0x5a6068, metalness: 0.5, roughness: 0.6 })), headGrp);
  pocket.position.set(0, HEAD_H / 2 - 4, 0);
  // Internal valve seats details
  for (let i = 0; i < 6; i++) {
    for (let v = 0; v < 2; v++) {
      const vsI = detail(new T.Mesh(new T.CylinderGeometry(7, 7, 2, 16), matSteelDk), headGrp);
      vsI.position.set(cx(i), HEAD_H / 2 - 8, 16);
      const vsE = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 2, 16), matSteelDk), headGrp);
      vsE.position.set(cx(i), HEAD_H / 2 - 8, -16);
    }
  }
  headGrp.position.y = headY;
  reg(headGrp, 'cylinder-head');
}
