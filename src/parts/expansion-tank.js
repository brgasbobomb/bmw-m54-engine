// Coolant expansion tank
export function build(c) {
  const { T, reg, LEN, blockY } = c;
  // ----- COOLANT EXPANSION TANK -----
  // E46: on the intake-side (+Z) end of the radiator, ahead of the airbox (refs/engine-bay/notes.md).
  const tank = new T.Mesh(new T.BoxGeometry(26, 44, 22), new T.MeshStandardMaterial({ color: 0xcdc9bc, metalness: 0.1, roughness: 0.6, transparent: true, opacity: 0.8 }));
  // Radiator frame is x 239…251, y ±56, z ±69: front faces flush, tops level, 1 unit clear of its side.
  tank.position.set(LEN / 2 + 98, blockY + 34, 69 + 12);
  reg(tank, 'coolant-tank', false); // Expansion tank sits straight, NOT slanted!
}
