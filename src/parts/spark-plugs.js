// Spark plugs
export function build(c) {
  const { T, matSteelDk, matCeramic, matGold, reg, detail, COVER_H, coverY, cx } = c;
  // ----- SPARK PLUGS (6, Grouped to fix bug) -----
  const sparkPlugsGrp = new T.Group();
  for (let i = 0; i < 6; i++) {
    const body = detail(new T.Mesh(new T.CylinderGeometry(2.8, 2.8, 12, 12), matCeramic), sparkPlugsGrp);
    body.position.set(cx(i), coverY + COVER_H / 2 + 1, -6);
    const metalHex = detail(new T.Mesh(new T.CylinderGeometry(3.6, 3.6, 3, 6), matSteelDk), sparkPlugsGrp);
    metalHex.position.set(cx(i), coverY + COVER_H / 2 - 3, -6);
    const thread = detail(new T.Mesh(new T.CylinderGeometry(2.4, 2.4, 6, 12), matGold), sparkPlugsGrp);
    thread.position.set(cx(i), coverY + COVER_H / 2 - 7, -6);
  }
  reg(sparkPlugsGrp, 'spark-plugs');
}
