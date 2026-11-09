// Timing drive: primary chain crank -> intake cam, secondary chain intake cam -> exhaust cam (two chains per refs/timing-chain/notes.md).
// Instanced links, real sprocket ratios, fixed guide + curved tensioner rail + hydraulic piston (primary), pad tensioner + guide (secondary).
export function build(c) {
  const { T, matSteel, matSteelDk, matAlu, matAluDark, matCover, matGold, reg, detail, sprocket, chainLoop, LEN, headY, blockY } = c;
  const g = new T.Group();
  const PITCH = 5.45, crankV = blockY - 6, camV = headY + 8, camZ = 18;
  const XP = LEN / 2, XS = LEN / 2 - 6, XO = LEN / 2 + 3; // primary plane, secondary plane, oil-pump row on the crank
  const place = (m, x, y, z) => { m.position.set(x, y, z); return detail(m, g); };
  const rOf = (n) => n * PITCH / (2 * Math.PI);

  // Sprockets (teeth: crank 12, cam primary 24 = 2:1, secondary cam sprockets 16, crank pump row 14)
  place(sprocket(12, PITCH, 4, matSteelDk), XP, crankV, 0);
  place(sprocket(14, PITCH, 4, matSteelDk), XO, crankV, 0);
  place(sprocket(24, PITCH, 4, matSteelDk), XP, camV, camZ);
  for (const s of [1, -1]) {
    place(sprocket(16, PITCH, 4, matSteelDk), XS, camV, s * camZ);
    const hub = place(new T.Mesh(new T.CylinderGeometry(6, 6, 12, 18), matGold), XS + 2, camV, s * camZ);
    hub.rotation.z = Math.PI / 2;
  }

  // Chains
  const prim = chainLoop([{ z: 0, y: crankV, r: rOf(12) }, { z: camZ, y: camV, r: rOf(24) }], PITCH, XP, matSteel);
  const sec = chainLoop([{ z: -camZ, y: camV, r: rOf(16) }, { z: camZ, y: camV, r: rOf(16) }], PITCH, XS, matSteel);
  g.add(prim.mesh, sec.mesh);

  // Rail: flat strip along a run, pushed `off` outside the chain and bowed by `bow`; thickness 3, width 6 (along X)
  const rail = (run, x, off, bow, mat, w = 6) => {
    const nz = Math.cos(run.n), ny = Math.sin(run.n), P = (t, o) => new T.Vector3(x, run.p[1] + (run.q[1] - run.p[1]) * t + ny * o, run.p[0] + (run.q[0] - run.p[0]) * t + nz * o);
    const curve = new T.CatmullRomCurve3([P(0.05, off), P(0.5, off + bow), P(0.95, off)]);
    const sh = new T.Shape(); sh.moveTo(-1.5, -w / 2); sh.lineTo(1.5, -w / 2); sh.lineTo(1.5, w / 2); sh.lineTo(-1.5, w / 2);
    place(new T.Mesh(new T.ExtrudeGeometry(sh, { extrudePath: curve, steps: 16, bevelEnabled: false }), mat), 0, 0, 0);
    return { P, nz, ny };
  };
  const cylAlong = (r, len, mat, at, nz, ny) => { // cylinder with its axis along (z,y) direction n, centred at `at`
    const m = place(new T.Mesh(new T.CylinderGeometry(r, r, len, 14), mat), at.x, at.y, at.z);
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), new T.Vector3(0, ny, nz)); return m;
  };

  // Primary: fixed guide on the intake-side run, curved tensioner rail on the exhaust-side run with the piston behind it
  rail(prim.runs[0], XP, 4, 0, matCover);
  const tr = rail(prim.runs[1], XP, 4, 3, matCover);
  const at = tr.P(0.62, 9), n = [tr.nz, tr.ny];
  cylAlong(3.4, 10, matSteel, at, ...n);
  cylAlong(4.4, 12, matAluDark, tr.P(0.62, 17), ...n);
  cylAlong(3, 3, matAlu, tr.P(0.62, 24), ...n).geometry.rotateY(0);
  for (const t of [0.05, 0.95]) place(new T.Mesh(new T.CylinderGeometry(2.4, 2.4, 8, 10), matSteel), XP, tr.P(t, 4).y, tr.P(t, 4).z).rotation.z = Math.PI / 2;

  // Secondary: pad tensioner on the top run (housing above, pad pressing down), fixed guide arm on the bottom run
  rail(sec.runs[0], XS, 4, 0, matCover);
  const pad = rail(sec.runs[1], XS, 3.5, 1.5, matCover, 6);
  const top = pad.P(0.5, 6);
  place(new T.Mesh(new T.BoxGeometry(9, 8, 12), matAluDark), XS, top.y + 4, top.z);
  place(new T.Mesh(new T.CylinderGeometry(3.2, 3.2, 6, 14), matAlu), XS, top.y + 9, top.z);

  reg(g, 'timing-chain');
}
