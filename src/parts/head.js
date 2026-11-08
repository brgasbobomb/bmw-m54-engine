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
  const W = BW + 2, hh = HEAD_H / 2;
  const matEdge = new T.MeshStandardMaterial({ color: 0x8a9096, metalness: 0.7, roughness: 0.45 });
  const matGasket = new T.MeshStandardMaterial({ color: 0x1c1d1f, metalness: 0.1, roughness: 0.9 });
  const box = (sx, sy, sz, x, y, z, m) => {
    const b = detail(new T.Mesh(new T.BoxGeometry(sx, sy, sz), m), headGrp);
    b.position.set(x, y, z);
    return b;
  };
  // Gasket line: dark MLS gasket edge peeking out under the head
  box(LEN + 1.2, 1.4, W + 1.2, 0, -hh - 0.3, 0, matGasket);
  // Casting edge lines: bright machined strips on the long top and bottom edges + vertical corners
  for (const s of [-1, 1]) {
    box(LEN - 8, 1, 1.4, 0, hh - 0.5, s * (W / 2 - 0.2), matEdge);
    box(LEN - 8, 1, 1.4, 0, -hh + 2.2, s * (W / 2 - 0.2), matEdge);
    for (const e of [-1, 1]) box(1.4, HEAD_H - 4, 1.4, e * (LEN / 2 - 0.2), 0, s * (W / 2 - 0.2), matEdge);
  }
  // Side faces: raised port flanges (intake +Z: 1 per cylinder, exhaust -Z: 2 per cylinder)
  for (let i = 0; i < 6; i++) {
    box(30, HEAD_H - 14, 2.4, cx(i), -1, W / 2 + 0.8, matEdge);
    for (const o of [-1, 1]) {
      box(13, HEAD_H - 16, 2.4, cx(i) + o * 9, -1, -W / 2 - 0.8, matEdge);
      const stud = detail(new T.Mesh(new T.CylinderGeometry(1.1, 1.1, 5, 8), matSteelDk), headGrp);
      stud.rotation.x = Math.PI / 2;
      stud.position.set(cx(i) + o * 9, hh - 6, -W / 2 - 3);
    }
    for (const o of [-1, 1]) {
      const stud = detail(new T.Mesh(new T.CylinderGeometry(1.1, 1.1, 5, 8), matSteelDk), headGrp);
      stud.rotation.x = Math.PI / 2;
      stud.position.set(cx(i) + o * 13, hh - 6, W / 2 + 3);
    }
  }
  // Lifting eyes: boss + ring at front and rear end, exhaust side
  for (const e of [-1, 1]) {
    box(6, 9, 10, e * (LEN / 2 + 2), hh - 6, -BW / 4, matBlock);
    const ring = detail(new T.Mesh(new T.TorusGeometry(5, 1.5, 8, 20), matBlock), headGrp);
    ring.rotation.y = Math.PI / 2;
    ring.position.set(e * (LEN / 2 + 6), hh + 1, -BW / 4);
  }
  headGrp.position.y = headY;
  reg(headGrp, 'cylinder-head');
}
