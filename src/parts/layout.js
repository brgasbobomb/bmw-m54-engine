// Shared engine dimensions. X = crank axis (+X = front/pulley end), Y = up, Z = intake(+)/exhaust(-).
export function makeLayout() {
  // ===== Geometry layout =====
  // X = length (crank axis), Y = up, Z = front/back of car
  // Scale: 91 mm bore spacing = span -> 0.4469 units/mm (refs/block/notes.md). BW, COVER_H not measured.
  const MM = (280 - 36) / 6 / 91;
  const LEN = 280, BW = 78, HEAD_H = Math.round(140 * MM), COVER_H = 20; // head 140 mm unconfirmed
  const blockY = 0;
  const crankY = blockY - 6;
  const deckY  = crankY + 211 * MM;  // deck height 211 mm (BMW spec)
  const blockBot = blockY - 36;      // pan rail, unchanged
  const BH = deckY - blockBot;       // block box spans blockBot..deckY (not centred on blockY)
  const headY  = deckY + HEAD_H / 2;
  const coverY = headY + HEAD_H / 2 + COVER_H / 2;
  // Upright radiator group: centre height and front-face x. Lifted so the viscous fan sits on the water pump axis.
  const radX = LEN / 2 + 105, radY = blockY + 38;

  const span = (LEN - 36) / 6;
  const cx = (i) => -LEN / 2 + 22 + i * span + span / 2;
  return { MM, crankY, deckY, blockBot, LEN, BW, BH, HEAD_H, COVER_H, blockY, headY, coverY, span, cx, radX, radY };
}
