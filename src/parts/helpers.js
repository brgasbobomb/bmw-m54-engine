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
      model.engineGroup.add(mesh);
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

  // 3-spoke tensioner: pulley + triangular hub
  const tensioner = (radius, mat) => {
    const g = new T.Group();
    detail(ribbedPulley(radius, 11, matSteel, 5), g);
    const hub = detail(new T.Mesh(new T.CylinderGeometry(radius * 0.5, radius * 0.5, 6, 6), matSteelDk), g);
    hub.rotation.z = Math.PI / 2; hub.position.x = -7;
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const spoke = detail(new T.Mesh(new T.BoxGeometry(5, radius * 1.3, 4), matSteelDk), g);
      spoke.position.x = -7;
      spoke.rotation.x = a;
    }
    return g;
  };

  // Serpentine belt wrapping the outside of a set of pulleys in the Y-Z plane at x=beltX
  const buildBelt = (pulleys, beltX, width = 3.8) => {
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
      const g = Math.acos(Math.max(-1, Math.min(1, (A.r - B.r) / L)));
      const ang = base + g;
      tan.push({
        depart: { y: A.y + A.r * Math.cos(ang), z: A.z + A.r * Math.sin(ang) },
        arrive: { y: B.y + B.r * Math.cos(ang), z: B.z + B.r * Math.sin(ang) }
      });
    }
    const pts = [];
    for (let i = 0; i < n; i++) {
      const prev = tan[(i - 1 + n) % n], cur = tan[i], A = ord[i];
      let a0 = Math.atan2(prev.arrive.z - A.z, prev.arrive.y - A.y);
      let a1 = Math.atan2(cur.depart.z - A.z, cur.depart.y - A.y);
      let da = a1 - a0; while (da < 0) da += Math.PI * 2;
      const steps = Math.max(2, Math.ceil(da / 0.25));
      for (let st = 0; st <= steps; st++) {
        const a = a0 + da * st / steps;
        pts.push(new T.Vector3(beltX, A.y + A.r * Math.cos(a), A.z + A.r * Math.sin(a)));
      }
      pts.push(new T.Vector3(beltX, cur.arrive.y, cur.arrive.z));
    }
    const curve = new T.CatmullRomCurve3(pts, true, 'catmullrom', 0.0);
    const geo = new T.TubeGeometry(curve, pts.length * 2, width, 8, true);
    const belt = new T.Mesh(geo, matBelt);
    belt.scale.x = 0.5;               // flatten into a band
    return belt;
  };
  return { reg, detail, roundedBox, ribbedPulley, crankDamper, alternatorBody, tensioner, buildBelt };
}
