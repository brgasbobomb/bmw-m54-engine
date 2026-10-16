// Coolant expansion tank
export function build(c) {
  const { T, reg, LEN, BW, headY } = c;
  // ----- COOLANT EXPANSION TANK -----
  const tank = new T.Mesh(new T.BoxGeometry(26, 44, 22), new T.MeshStandardMaterial({ color: 0xcdc9bc, metalness: 0.1, roughness: 0.6, transparent: true, opacity: 0.8 }));
  tank.position.set(-LEN / 2 + 40, headY + 34, BW / 2 + 42);
  reg(tank, 'coolant-tank', false); // Expansion tank sits straight, NOT slanted!
}
