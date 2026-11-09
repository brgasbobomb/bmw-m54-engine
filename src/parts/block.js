// Engine block
export function build(c) {
  const { T, matBlock, matAluDark, reg, detail, roundedBox, LEN, BW, BH, blockY, cx } = c;
  // ----- ENGINE BLOCK -----
  const blockGrp = new T.Group();
  // Main block casing
  detail(roundedBox(LEN, BH, BW, 8, matBlock), blockGrp);
  // Cylinder bores (6 hollow visual channels on top)
  for (let i = 0; i < 6; i++) {
    const bore = detail(new T.Mesh(new T.CylinderGeometry(18, 18, BH - 8, 24), new T.MeshStandardMaterial({ color: 0x101012, roughness: 0.9 })), blockGrp);
    bore.position.set(cx(i), 4, 0);
    // External reinforcing structural ribs on block sides
    const ribL = detail(new T.Mesh(new T.BoxGeometry(4, BH - 12, 3), matBlock), blockGrp);
    ribL.position.set(cx(i), 0, BW / 2 + 1);
    const ribR = detail(new T.Mesh(new T.BoxGeometry(4, BH - 12, 3), matBlock), blockGrp);
    ribR.position.set(cx(i), 0, -BW / 2 - 1);
  }
  const add = (g, x, y, z, rot) => { const m = detail(new T.Mesh(...g), blockGrp); m.position.set(x, y, z); if (rot) m.rotation.set(...rot); return m; };
  const ZAX = [Math.PI / 2, 0, 0]; // cylinder axis -> Z
  // Flared skirt: trapezoid profile (z,y) extruded along X, narrow at the crank line, wider at the pan rail
  const sk = new T.Shape(), hw = BW / 2 + 0.5, fw = BW / 2 + 4, y0 = blockY - 6, y1 = blockY - 36;
  [[-hw, y0], [hw, y0], [fw, y1], [-fw, y1]].forEach(([z, y], i) => i ? sk.lineTo(z, y) : sk.moveTo(z, y));
  const skirt = detail(new T.Mesh(new T.ExtrudeGeometry(sk, { depth: LEN, bevelEnabled: false }), matBlock), blockGrp);
  skirt.rotation.y = -Math.PI / 2; skirt.position.x = LEN / 2; // extrude axis z -> x
  add([new T.BoxGeometry(LEN, 2, BW + 3), matBlock], 0, y0, 0); // crank-line parting ledge
  // Bearing-cap ladder (7 caps): cap plate across the skirt bottom, outer ribs along the flared face, cap bolts
  for (let k = 0; k < 7; k++) {
    const x = cx(0) - c.span / 2 + k * c.span;
    detail(roundedBox(9, 6, 2 * fw + 1, 1.5, c.matAluDark), blockGrp).position.set(x, y1 + 1, 0);
    [-1, 1].forEach(sz => {
      const r = add([new T.BoxGeometry(5, 28, 4), matBlock], x, blockY - 21, sz * (BW / 2 + 4));
      r.rotation.x = sz * Math.atan2(fw - hw, y0 - y1); // follow the flare
      [-1, 1].forEach(dx => add([new T.CylinderGeometry(1.6, 1.6, 2, 8), c.matSteel], x + dx * 3, y1 - 2, sz * (fw - 4)));
    });
  }
  // Rear bellhousing flange: bolt lugs either side of the crank axis plus a lower pad (centre left open for the flywheel)
  [-1, 1].forEach(sz => {
    detail(roundedBox(7, 40, 14, 2, matBlock), blockGrp).position.set(-LEN / 2 + 3.5, blockY - 12, sz * (BW / 2 + 7));
    add([new T.CylinderGeometry(2.5, 2.5, 8, 10), c.matSteel], -LEN / 2 - 0.5, blockY - 6, sz * (BW / 2 + 9), [0, 0, Math.PI / 2]);
    add([new T.CylinderGeometry(2.5, 2.5, 8, 10), c.matSteel], -LEN / 2 - 0.5, blockY - 28, sz * (BW / 2 + 9), [0, 0, Math.PI / 2]);
  });
  detail(roundedBox(7, 8, BW + 6, 2, matBlock), blockGrp).position.set(-LEN / 2 + 3.5, blockY - 34, 0);
  // Engine-mount arms (photo: tapered cast arm, 4-ear box base, bolt-through boss at top), one per side
  const arm = new T.Shape(); // x = outward from block face, y = up
  [[0, -14], [0, 10], [20, 26], [28, 26], [28, 18], [12, -14]].forEach(([u, v], i) => i ? arm.lineTo(u, v) : arm.moveTo(u, v));
  [-1, 1].forEach(sz => {
    const g = new T.Group();
    const body = new T.Mesh(new T.ExtrudeGeometry(arm, { depth: 22, bevelEnabled: false }), matAluDark);
    body.position.z = -11; g.add(body);
    const boss = new T.Mesh(new T.CylinderGeometry(6, 6, 24, 16), c.matSteelDk);
    boss.rotation.x = Math.PI / 2; boss.position.set(24, 22, 0); g.add(boss);
    [[-9, -12], [9, -12], [-9, 8], [9, 8]].forEach(([z, y]) => { const e = new T.Mesh(new T.CylinderGeometry(3, 3, 3, 10), matAluDark); e.rotation.z = Math.PI / 2; e.position.set(1.5, y, z); g.add(e); });
    g.rotation.y = -sz * Math.PI / 2; g.position.set(24, blockY - 4, sz * BW / 2);
    g.traverse(m => { if (m.isMesh) m.castShadow = m.receiveShadow = true; });
    blockGrp.add(g);
  });
  // Bosses for bolt-on parts (oil-filter and starter positions match their part files)
  add([new T.CylinderGeometry(17, 17, 6, 24), matAluDark], LEN / 2 - 58, blockY + 12, BW / 2 + 2, ZAX); // oil-filter housing pad
  add([new T.BoxGeometry(30, 26, 6), matAluDark], -LEN / 2 + 20, blockY - 26, BW / 2 + 3);               // starter pad
  [-8, 8].forEach(dx => add([new T.CylinderGeometry(1.8, 1.8, 10, 8), c.matSteel], -LEN / 2 + 20 + dx, blockY - 26, BW / 2 + 8, ZAX));
  // Sensors (positions from engine knowledge; photos don't show the bare block): 2 knock, oil-pressure switch, crank-pulse sensor
  [2, 5].forEach(k => {
    const x = cx(0) - c.span / 2 + k * c.span;
    add([new T.CylinderGeometry(3.5, 3.5, 7, 12), c.matSteelDk], x, blockY + 1, BW / 2 + 3, ZAX);
    add([new T.BoxGeometry(6, 5, 6), c.matSteelDk], x, blockY + 1, BW / 2 + 8);
  });
  add([new T.CylinderGeometry(3, 3, 8, 10), c.matSteel], LEN / 2 - 58, blockY - 10, BW / 2 + 5, ZAX);
  add([new T.CylinderGeometry(3, 3, 9, 10), c.matSteelDk], -LEN / 2 + 12, blockY - 14, -BW / 2 - 4, ZAX);
  reg(blockGrp, 'engine-block');
}
