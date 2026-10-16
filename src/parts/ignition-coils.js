// Ignition coils
export function build(c) {
  const { T, matSteelDk, matCoil, reg, detail, roundedBox, COVER_H, coverY, span, cx } = c;
  // ----- IGNITION COILS (6, Grouped to fix single-part removal bug) -----
  const coilsGrp = new T.Group();
  for (let i = 0; i < 6; i++) {
    const singleCoil = detail(roundedBox(span * 0.64, 14, 22, 2, matCoil), coilsGrp);
    singleCoil.position.set(cx(i), coverY + COVER_H / 2 + 10, -6);
    // Small yellow connectors or markings
    const conn = detail(new T.Mesh(new T.BoxGeometry(4, 6, 6), matSteelDk), coilsGrp);
    conn.position.set(cx(i) - 8, coverY + COVER_H / 2 + 10, -6);
  }
  reg(coilsGrp, 'ignition-coils');
}
