// Exhaust manifolds & O2 sensors. M54B30: two stamped 3-into-1 manifolds, each with a close-coupled cat
// and a pipe to a 2-bolt flange. Photo notes: refs/exhaust/notes.md
export function build(c) {
  const { T, matExhaust, matSteel, matGold, matHose, reg, detail, roundedBox, BW, headY, span, cx } = c;
  const matScale = new T.MeshStandardMaterial({ color: 0x3d3a37, metalness: 0.6, roughness: 0.62 }); // heat-scaled pressed steel
  const matRust = new T.MeshStandardMaterial({ color: 0x6f4a33, metalness: 0.35, roughness: 0.85 });  // flange plates
  const V = (x, y, z) => new T.Vector3(x, y, z);
  const py = headY - 2, fz = -BW / 2 - 3;   // port centre height; flange plate centre (head face at Z = -40)

  // ----- EXHAUST MANIFOLD (front + rear 3-into-1, cat, pipe) -----
  const exGrp = new T.Group();

  // Stamped clamshell runner: oval section with the welded seam lip on both sides
  const lipped = (a, b, lip) => {
    const s = new T.Shape(), n = 12, t = 0.6;
    const th = Math.asin(t / b);  // angle where the lip meets the oval
    s.moveTo(a + lip, -t); s.lineTo(a + lip, t);
    for (let k = 0; k <= n; k++) { const q = th + (Math.PI - 2 * th) * k / n; s.lineTo(a * Math.cos(q), b * Math.sin(q)); }
    s.lineTo(-a - lip, t); s.lineTo(-a - lip, -t);
    for (let k = 0; k <= n; k++) { const q = Math.PI + th + (Math.PI - 2 * th) * k / n; s.lineTo(a * Math.cos(q), b * Math.sin(q)); }
    return s;
  };
  const runnerShape = lipped(7.5, 5.5, 2.2);
  // Paths start along -Z with a little -Y so the extrude frame puts the oval's long axis along X
  const runner = pts => detail(new T.Mesh(new T.ExtrudeGeometry(runnerShape,
    { steps: 24, bevelEnabled: false, extrudePath: new T.CatmullRomCurve3(pts) }), matScale), exGrp);

  // Flattened oval cat: cones at both ends, two beads near the outlet, seam ridge along both sides
  const catGeo = new T.LatheGeometry([[6, 0], [6, 2], [7.7, 6], [12.9, 9.5], [14, 11], [14, 50], [14.9, 51], [14, 52],
    [14, 54], [14.9, 55], [14, 56], [14, 61], [12.9, 62.5], [7.7, 66], [6, 70], [6, 72]]
    .map(([r, h]) => new T.Vector2(r, h)), 28).rotateX(Math.PI / 2);
  const finGeo = new T.BoxGeometry(2.4, 1, 50);
  const cat = (inlet, dir) => {
    const outlet = inlet.clone().addScaledVector(dir, 72);
    const can = detail(new T.Mesh(catGeo, matExhaust), exGrp);
    can.position.copy(inlet);
    can.quaternion.setFromRotationMatrix(new T.Matrix4().lookAt(outlet, inlet, V(0, 0, 1)));
    can.scale.y = 0.75;   // local y is engine Z: flat side towards the block
    [-1, 1].forEach(s => detail(new T.Mesh(finGeo, matExhaust), can).position.set(s * 14.6, 0, 36));
    return outlet;
  };

  // Pipe from the cat to a 2-bolt outlet flange with studs
  const studGeo = new T.CylinderGeometry(1.2, 1.2, 8, 8);
  const pipe = pts => {
    detail(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 48, 6.5, 14, false), matExhaust), exGrp);
    const end = pts[pts.length - 1];
    detail(roundedBox(3, 30, 15, 0.5, matRust), exGrp).position.copy(end);
    [-11, 11].forEach(dy => {
      const st = detail(new T.Mesh(studGeo, matSteel), exGrp);
      st.rotation.z = Math.PI / 2; st.position.set(end.x - 4, end.y + dy, end.z);
    });
  };

  // Per bank: flange plate with copper nuts, 3 runners into a collector
  const banks = [
    { ports: [0, 1, 2], C: V(cx(1), py - 26, -66) },     // rear, cyl 4-6 (further out, see the rear cat)
    { ports: [3, 4, 5], C: V(cx(4) + 4, py - 24, -57) }  // front, cyl 1-3
  ];
  const nutGeo = new T.CylinderGeometry(2.3, 2.3, 2.2, 6), blobGeo = new T.SphereGeometry(1, 20, 14);
  banks.forEach(({ ports, C }) => {
    const mid = cx(ports[1]);
    detail(roundedBox(3 * span - 4, 24, 4, 1.5, matRust), exGrp).position.set(mid, py, fz);
    // nuts top and bottom at both ends and between the ports (count not verified, see notes)
    [-1.5 * span + 6, -span / 2, span / 2, 1.5 * span - 6].forEach(dx => [-8.5, 8.5].forEach(dy => {
      const nut = detail(new T.Mesh(nutGeo, matGold), exGrp);
      nut.rotation.x = Math.PI / 2; nut.position.set(mid + dx, py + dy, fz - 3);
    }));
    ports.forEach(i => {
      const x = cx(i);
      runner([V(x, py, fz), V(x, py - 1, fz - 7), V(x + (C.x - x) * 0.35, py - 11, -55), C]);
    });
    const blob = detail(new T.Mesh(blobGeo, matScale), exGrp);
    blob.position.copy(C); blob.scale.set(13, 10, 8.5);
  });
  const [B, A] = banks.map(b => b.C);

  // Rear bank: cat straight off the collector, diagonal down and back, short pipe. Cat at Z -70 so it
  // passes outboard of the block's side boss (X -116..-84, Y -21..-7, out to Z -58).
  const dB = V(-0.7, -0.72, 0).normalize(), outB = cat(V(B.x - 2, B.y - 3, -70), dB);
  pipe([outB, outB.clone().addScaledVector(dB, 6), V(-124, -39, -70), V(-134, -40, -70), V(-150, -40, -70)]);
  // Front bank: elbow down from the collector, cat along the block past the flange end, S-bend outboard of the rear cat
  const dA = V(-1, -0.12, 0).normalize(), inA = V(56, 8, -60);
  detail(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(
    [A, V(A.x - 2, 15, -59), V(60, 8.5, -60), inA.clone().addScaledVector(dA, 2)]), 16, 6.5, 14, false), matExhaust), exGrp);
  const outA = cat(inA, dA);
  // S-bend spread over even steps: its tightest bend (~15) must stay above the pipe radius 6.5 or the inner wall folds
  pipe([outA, outA.clone().addScaledVector(dA, 6), V(-36, -6, -63), V(-52, -20, -74), V(-68, -35, -86),
    V(-84, -40, -89), V(-100, -40, -89), V(-150, -40, -89)]);
  reg(exGrp, 'exhaust-manifold');

  // ----- O2 SENSORS (4: before and after each cat) -----
  const o2Grp = new T.Group();
  const hexGeo = new T.CylinderGeometry(3.6, 3.6, 3, 6), bodyGeo = new T.CylinderGeometry(2.8, 2.8, 12, 14),
    bootGeo = new T.CylinderGeometry(1.8, 1.8, 6, 10);
  const o2 = (p, dir) => {
    const s = new T.Group();
    detail(new T.Mesh(hexGeo, matGold), s).position.y = 1.5;   // brass hex on the weld bung
    detail(new T.Mesh(bodyGeo, matSteel), s).position.y = 9;
    detail(new T.Mesh(bootGeo, matHose), s).position.y = 18;   // cable boot
    s.position.copy(p);
    s.quaternion.setFromUnitVectors(V(0, 1, 0), dir.normalize());
    o2Grp.add(s);
  };
  [A, B].forEach(C => o2(V(C.x + 6, C.y, C.z - 7), V(0, 0.8, -0.6)));   // pre-cat, on the collector
  [-70, -89].forEach(z => o2(V(-138, -35, z - 2), V(0, 1, -0.3)));     // post-cat, just before the outlet flange
  reg(o2Grp, 'oxygen-sensors');
}
