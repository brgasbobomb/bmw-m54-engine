// Clutch bellhousing (manual E46 transmission housing front), see refs/bellhousing/notes.md.
// Local X = crank axis, rear (-X) = gearbox side. Group origin on the block rear face, on the crank axis (same as flywheel.js).
export function build(c) {
  const { T, matAlu, matSteel, reg, detail, LEN, blockY } = c;
  const g = new T.Group();
  const dbl = (m) => { const k = m.clone(); k.side = T.DoubleSide; return k; };
  const add = (geo, mat, x, y, z, rz = 0) => { const m = detail(new T.Mesh(geo, mat), g); m.position.set(x, y, z); m.rotation.z = rz; return m; };
  // Revolved shell; profile (r, h) with h rearward of the block face. Open at both ends so the flywheel shows from behind.
  const lathe = (pts, mat) => {
    const m = detail(new T.Mesh(new T.LatheGeometry(pts.map(([r, h]) => new T.Vector2(r, h)), 56), dbl(mat)), g);
    m.rotation.z = Math.PI / 2; m.position.x = 0; m.scale.x = -1; // lathe axis Y -> X, h rearward = -X
    return m;
  };
  lathe([[43, 0], [51, 0], [51, 6], [47, 22], [46, 44], [43, 44], [44, 22], [43, 6], [43, 0]], matAlu); // tapered wall, 3 thick
  lathe([[44, 41], [55, 41], [55, 47], [44, 47], [44, 41]], matAlu);                                 // rear gearbox flange ring
  lathe([[50, 0], [58, 0], [58, 5], [50, 5], [50, 0]], matAlu);                                      // front block flange ring
  // bolt heads round the rear flange and front flange
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * Math.PI * 2 + 0.2;
    add(new T.CylinderGeometry(2.4, 2.4, 2.4, 6), matSteel, -48.2, Math.cos(a) * 51, Math.sin(a) * 51, Math.PI / 2);
    add(new T.CylinderGeometry(2.4, 2.4, 2.4, 6), matSteel, 6.2 - 6.4, Math.cos(a + 0.3) * 54, Math.sin(a + 0.3) * 54, Math.PI / 2).position.x = -6.2;
  }
  // Ribs along the cone, 8 around
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2 + Math.PI / 8;
    const r = add(new T.BoxGeometry(34, 2.4, 2.4), matAlu, -22, Math.cos(a) * 49.4, Math.sin(a) * 49.4);
    r.rotation.x = a; r.rotation.z = Math.atan2(-4, 34) * -1;
  }
  // Starter boss on the intake side (+Z), 45 mm off the axis and 12 below it (starter.js is at y blockY-18, z 43.4, crank axis y blockY-6)
  add(new T.CylinderGeometry(15, 15, 14, 24), matAlu, -9, -12, 43.4, Math.PI / 2);
  add(new T.CylinderGeometry(9.5, 9.5, 15, 24), matAlu, -9, -12, 43.4, Math.PI / 2).material = dbl(matAlu);

  g.position.set(-LEN / 2, blockY - 6, 0);
  reg(g, 'bellhousing');
}
