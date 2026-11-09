// Oil pump (refs/timing-chain/timing-chain-3.webp): cast body on the pan front, crescent-free gerotor housing + rotor,
// shaft with drive sprocket, chain from the crank's second row, pressure relief valve, pickup pipe down into the sump (oil-pan.js).
export function build(c) {
  const { T, matAlu, matAluDark, matSteel, matSteelDk, reg, detail, sprocket, chainLoop, roundedBox, LEN, blockY } = c;
  const g = new T.Group();
  const PITCH = 5.45, XO = LEN / 2 + 3, crankV = blockY - 6;
  const px = LEN / 2 - 7, py = blockY - 44;            // pump axis (x of body centre, y of shaft)
  const put = (m, x, y, z) => { m.position.set(x, y, z); return detail(m, g); };
  const cylX = (r, len, mat, x, y, z) => { const m = put(new T.Mesh(new T.CylinderGeometry(r, r, len, 24), mat), x, y, z); m.rotation.z = Math.PI / 2; return m; };

  // Body with mounting ears, rotor housing disc on the +X face, relief valve cylinder on the intake side
  put(roundedBox(16, 20, 32, 2, matAluDark), px, py, 0);
  for (const z of [-17, 17]) put(roundedBox(10, 6, 8, 1.5, matAluDark), px - 2, py + 7, z);
  cylX(12.5, 7, matAluDark, px + 11.5, py, 0);
  cylX(9, 2, matSteelDk, px + 15.5, py, 0);                       // rotor pocket
  cylX(5.6, 3, matSteel, px + 16, py, 0).rotation.y = 0;           // outer rotor
  cylX(3.4, 4, matSteelDk, px + 16.5, py, 0);                      // inner rotor
  cylX(1.8, 18, matSteel, px + 14, py, 0);                         // shaft out to the sprocket
  const relief = put(new T.Mesh(new T.CylinderGeometry(3.6, 3.6, 16, 14), matAlu), px - 2, py + 2, 22);
  relief.rotation.x = Math.PI / 2;

  // Drive sprocket (9 teeth) on the shaft, plane XO like the crank's second row, and the chain loop between them
  put(sprocket(9, PITCH, 4, matSteelDk), XO, py, 0);
  cylX(2.6, 2, matSteel, XO + 2.5, py, 0);                         // nut
  const r = (n) => n * PITCH / (2 * Math.PI);
  g.add(chainLoop([{ z: 0, y: crankV, r: r(14) }, { z: 0, y: py, r: r(9) }], PITCH, XO, matSteel).mesh);

  // Pickup: flanged pipe leaves the body underside, runs back along -X, ends in a flat strainer cup low in the deep sump
  const pipe = new T.CatmullRomCurve3([
    new T.Vector3(px - 4, py - 10, 0), new T.Vector3(px - 8, py - 16, 0), new T.Vector3(px - 26, py - 22, 0),
    new T.Vector3(px - 52, py - 28, 0), new T.Vector3(px - 66, py - 31, 0)]);
  detail(new T.Mesh(new T.TubeGeometry(pipe, 32, 3.2, 12, false), matAlu), g);
  put(new T.Mesh(new T.CylinderGeometry(4.6, 4.6, 3, 14), matAlu), px - 6, py - 10, 0);  // flange at the body
  const cup = put(new T.Mesh(new T.CylinderGeometry(11, 11, 4, 24), matSteelDk), px - 66, py - 33, 0);
  cup.scale.set(1, 1, 0.8);
  put(new T.Mesh(new T.CylinderGeometry(3.6, 3.6, 4, 12), matAlu), px - 66, py - 30, 0);   // neck into the cup
  put(roundedBox(14, 3, 6, 1, matAlu), px - 50, py - 24, 0);                                 // support bracket

  reg(g, 'oil-pump');
}
