// Geometry helpers shared by all parts.
// reg(mesh, id, isSlanted=true): register a top-level removable part.
// detail(mesh, group): add a sub-mesh to a part group.
export function makeHelpers(c, model) {
  const { T, slantedGrp, matFace, matSteel, matSteelDk, matBelt } = c;
  // ===== Helpers =====
  const reg = (mesh, id, isSlanted = true) => {       // register a top-level removable part
    mesh.castShadow = true; mesh.receiveShadow = true;
    mesh.userData.partId = id;
    if (isSlanted) {
      slantedGrp.add(mesh);
    } else {
      c.rootGrp.add(mesh);
    }
    if (!model.parts3D.has(id)) model.parts3D.set(id, mesh);
    model.storeOriginalTransform(id, mesh);
  };
  const detail = (mesh, group) => { // sub-mesh added to a group
    mesh.castShadow = true; mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  // Rounded, beveled box (cast-metal look) via extruded rounded-rect. Dims ~ w,h,d.
  const roundedBox = (w, h, d, r, mat) => {
    const iw = Math.max(1, w - 2 * r), ih = Math.max(1, h - 2 * r);
    const x = -iw / 2, y = -ih / 2;
    const sh = new T.Shape();
    sh.moveTo(x + r, y);
    sh.lineTo(x + iw - r, y); sh.quadraticCurveTo(x + iw, y, x + iw, y + r);
    sh.lineTo(x + iw, y + ih - r); sh.quadraticCurveTo(x + iw, y + ih, x + iw - r, y + ih);
    sh.lineTo(x + r, y + ih); sh.quadraticCurveTo(x, y + ih, x, y + ih - r);
    sh.lineTo(x, y + r); sh.quadraticCurveTo(x, y, x + r, y);
    const geo = new T.ExtrudeGeometry(sh, {
      depth: Math.max(1, d - 2 * r), bevelEnabled: true,
      bevelThickness: r, bevelSize: r, bevelSegments: 2, steps: 1, curveSegments: 4
    });
    geo.center();
    const m = new T.Mesh(geo, mat);
    m.castShadow = true; m.receiveShadow = true;
    return m;
  };

  // V-ribbed pulley: grooved rim (lathe) + recessed face + raised hub + center bolt.
  const ribbedPulley = (radius, width, rimMat, grooves) => {
    grooves = grooves || 6;
    const g = new T.Group();
    const half = width / 2;
    const pts = [];
    pts.push(new T.Vector2(radius * 0.52, -half));
    pts.push(new T.Vector2(radius * 0.80, -half));
    const gw = width / grooves;
    for (let i = 0; i <= grooves; i++) {
      const y = -half + i * gw;
      const r = (i % 2 === 0) ? radius : radius * 0.87;
      pts.push(new T.Vector2(r, y));
    }
    pts.push(new T.Vector2(radius * 0.80, half));
    pts.push(new T.Vector2(radius * 0.52, half));
    const rim = new T.Mesh(new T.LatheGeometry(pts, 40), rimMat);
    rim.rotation.z = Math.PI / 2;
    rim.castShadow = true; rim.receiveShadow = true;
    g.add(rim);
    // recessed darker center face
    const face = new T.Mesh(new T.CylinderGeometry(radius * 0.52, radius * 0.52, width * 0.45, 28), matFace);
    face.rotation.z = Math.PI / 2;
    g.add(face);
    // raised hub
    const hub = new T.Mesh(new T.CylinderGeometry(radius * 0.22, radius * 0.22, width * 1.05, 20), rimMat);
    hub.rotation.z = Math.PI / 2;
    g.add(hub);
    // center bolt
    const bolt = new T.Mesh(new T.CylinderGeometry(radius * 0.09, radius * 0.09, width * 1.15, 8), matSteel);
    bolt.rotation.z = Math.PI / 2;
    g.add(bolt);
    g.castShadow = true; g.receiveShadow = true;
    return g;
  };

  // Crank damper: big ribbed disc + raised hub + bolt circle
  const crankDamper = (radius, width, mat) => {
    const g = new T.Group();
    detail(ribbedPulley(radius, width, mat, 7), g);
    const hub = detail(new T.Mesh(new T.CylinderGeometry(radius * 0.32, radius * 0.32, width * 1.5, 28), matSteelDk), g);
    hub.rotation.z = Math.PI / 2;
    const bore = detail(new T.Mesh(new T.CylinderGeometry(radius * 0.13, radius * 0.13, width * 1.7, 22), matSteel), g);
    bore.rotation.z = Math.PI / 2;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const b = detail(new T.Mesh(new T.CylinderGeometry(radius * 0.045, radius * 0.045, width * 1.55, 10), matSteel), g);
      b.rotation.z = Math.PI / 2;
      b.position.set(0, Math.cos(a) * radius * 0.6, Math.sin(a) * radius * 0.6);
    }
    return g;
  };

  // Finned alternator body (cooling vents at the rear)
  const alternatorBody = (radius, length, mat) => {
    const g = new T.Group();
    const body = detail(new T.Mesh(new T.CylinderGeometry(radius, radius, length, 30), mat), g);
    body.rotation.z = Math.PI / 2;
    const cap = detail(new T.Mesh(new T.CylinderGeometry(radius * 0.95, radius * 0.7, length * 0.18, 30), matSteelDk), g);
    cap.rotation.z = Math.PI / 2;
    cap.position.x = -length * 0.55;
    const fins = 26;
    for (let i = 0; i < fins; i++) {
      const a = (i / fins) * Math.PI * 2;
      const fin = detail(new T.Mesh(new T.BoxGeometry(length * 0.12, radius * 0.7, 1.4), matSteelDk), g);
      fin.position.set(-length * 0.62, Math.cos(a) * radius * 0.5, Math.sin(a) * radius * 0.5);
      fin.rotation.x = a;
    }
    return g;
  };

  // Poly-V belt round a set of pulleys in the Y-Z plane, centred on x=beltX, `width` along X.
  // Pulleys with inner:true are wrapped from the inside (idler pushing the belt in).
  const buildBelt = (pulleys, beltX, width = 10, ribs = 6) => {
    let cy = 0, cz = 0;
    pulleys.forEach(p => { cy += p.y; cz += p.z; });
    cy /= pulleys.length; cz /= pulleys.length;
    const ord = pulleys.slice().sort((a, b) =>
      Math.atan2(a.z - cz, a.y - cy) - Math.atan2(b.z - cz, b.y - cy));
    const n = ord.length;
    const tan = [];
    for (let i = 0; i < n; i++) {
      const A = ord[i], B = ord[(i + 1) % n];
      const dy = B.y - A.y, dz = B.z - A.z;
      const L = Math.hypot(dy, dz) || 1;
      const base = Math.atan2(dz, dy);
      const sA = A.inner ? -A.r : A.r, sB = B.inner ? -B.r : B.r;   // signed radius: inner wrap = cross tangent
      const g = Math.acos(Math.max(-1, Math.min(1, (sA - sB) / L)));
      const ang = base + g;
      tan.push({
        depart: { y: A.y + sA * Math.cos(ang), z: A.z + sA * Math.sin(ang) },
        arrive: { y: B.y + sB * Math.cos(ang), z: B.z + sB * Math.sin(ang) }
      });
    }
    const pts = [];
    for (let i = 0; i < n; i++) {
      const prev = tan[(i - 1 + n) % n], cur = tan[i], A = ord[i];
      const a0 = Math.atan2(prev.arrive.z - A.z, prev.arrive.y - A.y);
      const a1 = Math.atan2(cur.depart.z - A.z, cur.depart.y - A.y);
      let da = a1 - a0;
      if (A.inner) { while (da > 0) da -= Math.PI * 2; } else { while (da < 0) da += Math.PI * 2; }
      const steps = Math.max(2, Math.ceil(Math.abs(da) / 0.2));
      for (let st = 0; st <= steps; st++) {
        const a = a0 + da * st / steps;
        pts.push({ y: A.y + A.r * Math.cos(a), z: A.z + A.r * Math.sin(a) });
      }
    }
    // Cross-section [x, r] (r = outward from the pulley rim): flat back, V-ribs sitting in the grooves
    const hw = width / 2, pw = width / ribs;
    const prof = [[-hw, 1.8], [hw, 1.8], [hw, 0.5]];
    for (let k = 0; k < ribs; k++) prof.push([hw - (k + 0.5) * pw, -0.9], [hw - (k + 1) * pw, 0.5]);
    const N = pts.length, M = prof.length, pos = [], idx = [];
    for (let i = 0; i < N; i++) {
      const a = pts[(i - 1 + N) % N], b = pts[(i + 1) % N], p = pts[i];
      const ty = b.y - a.y, tz = b.z - a.z, tl = Math.hypot(ty, tz) || 1;
      const ny = tz / tl, nz = -ty / tl;   // outward normal of the counter-clockwise loop
      for (const [x, r] of prof) pos.push(beltX + x, p.y + ny * r, p.z + nz * r);
    }
    for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
      const i2 = (i + 1) % N, j2 = (j + 1) % M;
      idx.push(i * M + j, i2 * M + j, i * M + j2, i2 * M + j, i2 * M + j2, i * M + j2);
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const belt = new T.Mesh(geo, matBelt);
    belt.castShadow = true; belt.receiveShadow = true;
    return belt;
  };
  // Chain sprocket on the X axis, centre at (x, y, z): N teeth, root radius r. Teeth are trapezoids.
  const sprocket = (n, pitch, thick, mat) => {
    const r = n * pitch / (2 * Math.PI), s = new T.Shape();
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 2 * Math.PI, w = Math.PI / n * 0.5;
      [[a - w, r - 1.6], [a - w * 0.5, r + 0.9], [a + w * 0.5, r + 0.9], [a + w, r - 1.6]]
        .forEach(([t, rr], k) => (i + k ? s.lineTo : s.moveTo).call(s, Math.cos(t) * rr, Math.sin(t) * rr));
    }
    const g = new T.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false });
    g.rotateY(Math.PI / 2); // shape (u,v) -> (-z,y), extrusion -> +x
    g.translate(-thick / 2, 0, 0);
    const m = new T.Mesh(g, mat); m.castShadow = true; m.receiveShadow = true;
    return m;
  };
  // Closed chain around circles [{z,y,r}] listed counter-clockwise in the (z,y) plane. Returns a roller-chain
  // InstancedMesh (alternating wide/narrow plates, ~pitch long) at plane x, plus the straight runs for rails.
  // shortcut: 2-circle loops only (all chains in this engine), upgrade for idlers.
  const chainLoop = (circles, pitch, x, mat) => {
    const [A, B] = circles, d = Math.hypot(B.z - A.z, B.y - A.y), a = Math.atan2(B.y - A.y, B.z - A.z);
    const nAB = a - Math.acos((A.r - B.r) / d), nBA = a + Math.PI - Math.acos((B.r - A.r) / d);
    const pts = [], arc = (C, t0, t1) => {
      while (t1 < t0) t1 += 2 * Math.PI;
      for (let t = t0; t < t1; t += 0.05) pts.push([C.z + C.r * Math.cos(t), C.y + C.r * Math.sin(t)]);
    };
    arc(A, nBA, nAB); arc(B, nAB, nBA);
    pts.push(pts[0]);
    const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const N = Math.round(cum[cum.length - 1] / pitch), step = cum[cum.length - 1] / N;
    const im = new T.InstancedMesh(new T.BoxGeometry(1, 2.2, 1), mat, N), o = new T.Object3D();
    const at = (s) => { let i = 1; while (cum[i] < s && i < pts.length - 1) i++; const f = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1);
      return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f]; };
    for (let k = 0; k < N; k++) {
      const [z0, y0] = at(k * step), [z2, y2] = at(((k + 1) * step) % cum[cum.length - 1]);
      o.position.set(x, y0, z0); o.rotation.set(-Math.atan2(y2 - y0, z2 - z0), 0, 0);
      o.scale.set(k % 2 ? 2.6 : 4.2, 1, step * 0.92); o.updateMatrix(); im.setMatrixAt(k, o.matrix);
    }
    im.castShadow = true;
    const run = (C, D, n) => ({ p: [C.z + C.r * Math.cos(n), C.y + C.r * Math.sin(n)], q: [D.z + D.r * Math.cos(n), D.y + D.r * Math.sin(n)], n });
    return { mesh: im, runs: [run(A, B, nAB), run(B, A, nBA)] };
  };
  return { reg, detail, roundedBox, ribbedPulley, crankDamper, alternatorBody, buildBelt, sprocket, chainLoop };
}
