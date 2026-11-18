// Coolant expansion tank
export function build(c) {
  const { T, reg, detail, roundedBox, LEN, radY } = c;
  // E46: on the intake-side (+Z) end of the radiator, ahead of the airbox (refs/engine-bay/notes.md).
  const g = new T.Group();
  const plastic = new T.MeshPhysicalMaterial({ color: 0xe8e4d4, roughness: 0.45, transparent: true, opacity: 0.55 });
  const coolant = new T.MeshStandardMaterial({ color: 0x3fae5a, roughness: 0.3, transparent: true, opacity: 0.55 });
  const black = new T.MeshStandardMaterial({ color: 0x151515, roughness: 0.7 });
  const cap = new T.MeshStandardMaterial({ color: 0xd8d3c0, roughness: 0.5 });

  detail(roundedBox(26, 44, 22, 3, plastic), g);                          // shell
  const fill = detail(roundedBox(22, 26, 18, 2, coolant), g); fill.position.y = -8; // coolant level
  const neck = detail(new T.Mesh(new T.CylinderGeometry(5.5, 5.5, 5, 20), cap), g); neck.position.y = 24.5;
  const lid = detail(new T.Mesh(new T.CylinderGeometry(7.5, 7.5, 4, 24), cap), g); lid.position.y = 29;
  const grip = detail(new T.Mesh(new T.BoxGeometry(14, 2, 3), cap), g); grip.position.y = 31.5;
  // level sensor block on the side + spigots toward the radiator (-X side faces the radiator) and the hose (+X)
  detail(new T.Mesh(new T.BoxGeometry(6, 8, 8), black), g).position.set(0, -8, 12);
  [[-13, 14], [-13, -14]].forEach(([x, y]) => {
    const s = detail(new T.Mesh(new T.CylinderGeometry(2.6, 2.6, 6, 12), black), g);
    s.rotation.z = Math.PI / 2; s.position.set(x - 2, y, 0);
  });
  // mounting ear
  detail(new T.Mesh(new T.BoxGeometry(8, 3, 14), plastic), g).position.set(0, -23, 0);

  // Radiator frame is x 239…251, y radY ±56, z ±69: front faces flush, tops level, 1 unit clear of its side.
  g.position.set(LEN / 2 + 98, radY + 34, 69 + 12);
  reg(g, 'coolant-tank', false); // Expansion tank sits straight, NOT slanted!
}
