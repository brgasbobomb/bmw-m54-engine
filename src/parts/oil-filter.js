// Oil filter housing (M54: vertical cartridge canister, plastic cap; no oil/coolant cooler on the E46 part)
export function build(c) {
  const { T, matCover, matAlu, matAluDark, matSteel, matHose, reg, detail, LEN, BW, blockY } = c;
  const g = new T.Group();
  const add = (geo, mat, x, y, z, rot) => {
    const m = detail(new T.Mesh(geo, mat), g); m.position.set(x, y, z); if (rot) m.rotation.set(...rot); return m;
  };
  const ZAX = [Math.PI / 2, 0, 0], XAX = [0, 0, Math.PI / 2];
  // local z = -10 is the block pad face (block.js: pad centre BW/2+2, 6 thick; group sits at BW/2+15)

  // Mounting flange on the block pad + three bolt heads
  add(new T.BoxGeometry(30, 28, 3), matAluDark, 0, 4, -8.5);
  for (const [x, y] of [[-11, -6], [11, -6], [0, 14]])
    add(new T.CylinderGeometry(2.6, 2.6, 2.5, 6), matSteel, x, y + 4, -6.5, ZAX);
  // Cast body: lower bracket block, then the canister seat above it (canister axis = local Y)
  add(new T.BoxGeometry(24, 24, 14), matAlu, 0, 3, -1);
  add(new T.CylinderGeometry(13, 13, 14, 24), matAlu, 0, 16, 0);
  // Canister shell with cooling ribs on the outside
  add(new T.CylinderGeometry(12, 12, 20, 24), matAlu, 0, 26, 0);
  for (const y of [20, 24, 28, 32])
    add(new T.CylinderGeometry(12.6, 12.6, 1.2, 24), matAlu, 0, y, 0);
  // Black plastic cap, ridged edge, hex drain/service nut on top
  add(new T.CylinderGeometry(12.8, 12.8, 7, 24), matCover, 0, 38, 0);
  for (let r = 0; r < 12; r++) {
    const a = (r / 12) * Math.PI * 2;
    const ridge = add(new T.BoxGeometry(2, 7, 1.2), matCover, Math.cos(a) * 12.8, 38, Math.sin(a) * 12.8);
    ridge.rotation.y = -a;
  }
  add(new T.CylinderGeometry(4, 4, 3, 6), matCover, 0, 43, 0);
  // Oil pressure + temperature sensor stubs on the outboard (+Z) side
  for (const [x, y] of [[-6, 6], [6, 6]]) {
    add(new T.CylinderGeometry(2.4, 2.4, 7, 10), matSteel, x, y, 9, ZAX);
    add(new T.BoxGeometry(4, 4, 5), matCover, x, y, 14);
  }
  // Line connections: VANOS feed from a banjo under the housing, running forward (+X) and up to the VANOS feed hose
  add(new T.CylinderGeometry(3.2, 3.2, 3, 12), matSteel, 0, -6, 8, XAX);                 // banjo eye
  add(new T.CylinderGeometry(1.8, 1.8, 7, 8), matSteel, 0, -6, 8, ZAX).position.set(0, -6, 11); // banjo bolt
  const line = new T.CatmullRomCurve3([
    new T.Vector3(3, -6, 8), new T.Vector3(10, -9, 8), new T.Vector3(28, -8, 2), new T.Vector3(50, 0, -7), new T.Vector3(58, 6, -9.5), new T.Vector3(58, 14, -9.5)]);
  detail(new T.Mesh(new T.TubeGeometry(line, 24, 1.6, 8, false), matSteel), g);
  add(new T.CylinderGeometry(2.6, 2.6, 4, 8), matSteel, 58, 12.5, -9.5);                    // union under vanos.js feed hose end (world x=LEN/2, y=headY-26.9, z=44.5)

  g.position.set(LEN / 2 - 58, blockY + 12, BW / 2 + 15);
  reg(g, 'oil-filter');
}
