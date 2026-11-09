// Crankshaft: 7 main journals, 6 pins, 12 webs (8 full counterweights + 4 small), snout, rear flange.
// Counts from the RealOEM diagram, see refs/crankshaft/notes.md.
export function build(c) {
  const { T, matSteel, matSteelDk, reg, detail, LEN, blockY, cx, span } = c;
  const crankGrp = new T.Group();
  const axisY = blockY - 6;
  const crankThrow = 12;
  const angles = [0, 2 * Math.PI / 3, 4 * Math.PI / 3, 4 * Math.PI / 3, 2 * Math.PI / 3, 0]; // standard I6 crank configuration
  const webT = 6, pinLen = 14, webOff = pinLen / 2 + webT / 2;

  const cyl = (r, len, x, mat = matSteel, y = axisY, z = 0) => {
    const m = detail(new T.Mesh(new T.CylinderGeometry(r, r, len, 24), mat), crankGrp);
    m.rotation.z = Math.PI / 2;
    m.position.set(x, y, z);
    return m;
  };

  // 7 main journals between/outside the pins
  for (let k = 0; k < 7; k++) cyl(10, span - 2 * webOff - pinLen / 2 + webT + 2, cx(0) - span / 2 + k * span);

  // Web profile in (sx, sy): weight lobe toward +sy, crankpin boss at (0, -crankThrow)
  const webGeo = (R, halfDeg) => {
    const h = halfDeg * Math.PI / 180, bx = 10;
    const s = new T.Shape();
    s.moveTo(-bx, -crankThrow);
    s.lineTo(R * Math.cos(Math.PI / 2 + h), R * Math.sin(Math.PI / 2 + h));
    s.absarc(0, 0, R, Math.PI / 2 + h, Math.PI / 2 - h, true);
    s.lineTo(bx, -crankThrow);
    s.absarc(0, -crankThrow, bx, 0, -Math.PI, true);
    const g = new T.ExtrudeGeometry(s, { depth: webT, bevelEnabled: false, curveSegments: 20 });
    g.translate(0, 0, -webT / 2);
    g.rotateY(Math.PI / 2); // extrusion along X
    return g;
  };
  const bigGeo = webGeo(22, 65), smallGeo = webGeo(15, 40);

  for (let i = 0; i < 6; i++) {
    const a = angles[i], x = cx(i);
    cyl(8, pinLen, x, matSteel, axisY + Math.cos(a) * crankThrow, Math.sin(a) * crankThrow);
    const geo = (i === 2 || i === 3) ? smallGeo : bigGeo; // photo: middle pins carry thin webs
    [-1, 1].forEach(o => {
      const web = detail(new T.Mesh(geo, matSteelDk), crankGrp);
      web.position.set(x + o * webOff, axisY, 0);
      web.rotation.x = a + Math.PI; // lobe opposite the crankpin
    });
  }

  // Front snout (+X): collar, stepped nose, keyway
  const front = LEN / 2;
  cyl(13, 5, cx(5) + span / 2 + 7);
  cyl(9, front + 7 - (cx(5) + span / 2), (front + 7 + cx(5) + span / 2) / 2);
  const key = detail(new T.Mesh(new T.BoxGeometry(14, 2, 3), matSteelDk), crankGrp);
  key.position.set(front + 1, axisY + 9, 0);

  // Rear flange (-X) with pilot and 6 bolt bosses
  const rear = -LEN / 2;
  cyl(24, 8, rear + 4, matSteelDk);
  cyl(7, 6, rear - 2);
  for (let b = 0; b < 6; b++) {
    const t = b * Math.PI / 3;
    cyl(2.5, 3, rear + 9.5, matSteel, axisY + Math.cos(t) * 17, Math.sin(t) * 17);
  }

  reg(crankGrp, 'crankshaft');
  return { angles, crankThrow };
}
