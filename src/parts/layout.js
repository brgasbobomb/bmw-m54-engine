// Shared engine dimensions. X = crank axis (+X = front/pulley end), Y = up, Z = intake(+)/exhaust(-).
export function makeLayout() {
  // ===== Geometry layout =====
  // X = length (crank axis), Y = up, Z = front/back of car
  const LEN = 280, BW = 78, BH = 72, HEAD_H = 34, COVER_H = 20;
  const blockY = 0;
  const headY  = blockY + BH / 2 + HEAD_H / 2;
  const coverY = headY + HEAD_H / 2 + COVER_H / 2;
  // Upright radiator group: centre height and front-face x. Lifted so the viscous fan sits on the water pump axis.
  const radX = LEN / 2 + 105, radY = blockY + 38;

  const span = (LEN - 36) / 6;
  const cx = (i) => -LEN / 2 + 22 + i * span + span / 2;
  return { LEN, BW, BH, HEAD_H, COVER_H, blockY, headY, coverY, span, cx, radX, radY };
}
