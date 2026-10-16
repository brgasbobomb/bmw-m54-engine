// Flywheel
export function build(c) {
  const { T, matSteelDk, reg, LEN, blockY } = c;
  // ----- FLYWHEEL (Rear crank wheel) -----
  const fly = new T.Mesh(new T.CylinderGeometry(40, 40, 12, 48), matSteelDk);
  fly.rotation.z = Math.PI / 2;
  fly.position.set(-LEN / 2 - 8, blockY - 6, 0);
  reg(fly, 'flywheel');
}
