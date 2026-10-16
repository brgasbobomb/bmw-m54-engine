// BMW M54 Engine 3D Model - Consolidated App
// All code in one file to avoid module resolution issues in Electron

class Scene {
  constructor(container) {
    this.container = container;
    this.scene = new window.THREE.Scene();
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new window.THREE.Raycaster();
    this.mouse = new window.THREE.Vector2();

    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLighting();
    this.setupEnvironment();
    this.setupControls();
  }

  setupEnvironment() {
    // Image-based lighting from a procedural room -> realistic metal reflections
    if (!window.RoomEnvironment) return;
    try {
      const pmrem = new window.THREE.PMREMGenerator(this.renderer);
      const envScene = new window.RoomEnvironment();
      this.scene.environment = pmrem.fromScene(envScene, 0.04).texture;
    } catch (e) {
      console.warn('environment setup skipped: ' + e.message);
    }
  }

  initScene() {
    // Light studio background (matches product-render references)
    this.scene.background = new window.THREE.Color(0xeef1f5);
    // no fog — engine spans a wide area and must stay crisp
  }

  initCamera() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new window.THREE.PerspectiveCamera(48, width / height, 0.1, 2000);
    this.camera.position.set(360, 165, 245);
    this.camera.lookAt(-10, 12, 8);
  }

  initRenderer() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.renderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = window.THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = window.THREE.SRGBColorSpace;
    this.renderer.toneMapping = window.THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => this.onWindowResize());
  }

  initLighting() {
    const T = window.THREE;
    // Sky/ground hemisphere for soft metal shading
    const hemi = new T.HemisphereLight(0xdfe6ef, 0x2a2a30, 0.65);
    this.scene.add(hemi);

    const ambient = new T.AmbientLight(0xffffff, 0.25);
    this.scene.add(ambient);

    // Key light (top-right, casts shadows)
    const key = new T.DirectionalLight(0xffffff, 1.15);
    key.position.set(280, 320, 220);
    key.castShadow = true;
    key.shadow.mapSize.width = 2048;
    key.shadow.mapSize.height = 2048;
    key.shadow.camera.near = 50;
    key.shadow.camera.far = 1400;
    key.shadow.camera.left = -400;
    key.shadow.camera.right = 400;
    key.shadow.camera.top = 400;
    key.shadow.camera.bottom = -400;
    key.shadow.bias = -0.0004;
    this.scene.add(key);

    // Fill light (front-left, no shadow)
    const fill = new T.DirectionalLight(0xbcd0e8, 0.5);
    fill.position.set(-260, 120, 200);
    this.scene.add(fill);

    // Rim/back light to separate from background
    const rim = new T.DirectionalLight(0xffffff, 0.55);
    rim.position.set(-120, 200, -300);
    this.scene.add(rim);

    // Soft contact shadow on an invisible ground plane (studio look)
    const ground = new T.Mesh(
      new T.PlaneGeometry(3000, 3000),
      new T.ShadowMaterial({ opacity: 0.28 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -98;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  setupControls() {
    this.controls = {
      autoRotate: false,
      autoRotateSpeed: 2,
      enableZoom: true,
      enablePan: true,
      enableRotate: true,
      dampingFactor: 0.05
    };

    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.container.addEventListener('wheel', (e) => this.onMouseWheel(e));
  }

  onMouseMove(event) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onMouseDown(event) {
    if (event.button === 0 && event.target.tagName === 'CANVAS') {
      this.updatePickedObject();
    }
  }

  onMouseWheel(event) {
    event.preventDefault();
    const zoomSpeed = 0.1;
    const direction = this.camera.position.clone().normalize();
    const distance = this.camera.position.length();
    const newDistance = distance + (event.deltaY > 0 ? zoomSpeed * 10 : -zoomSpeed * 10);

    if (newDistance > 50 && newDistance < 400) {
      this.camera.position.copy(direction.multiplyScalar(newDistance));
    }
  }

  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  getRaycasterFromMouse() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return this.raycaster;
  }

  updatePickedObject() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
  }

  addToScene(object) {
    this.scene.add(object);
  }

  render() {
    if (this.controls.autoRotate) {
      const speed = this.controls.autoRotateSpeed * 0.01;
      const center = new window.THREE.Vector3(0, 0, 0);
      const position = this.camera.position;
      const radius = position.distanceTo(center);
      const theta = Math.atan2(position.z, position.x);
      const phi = Math.acos(position.y / radius);

      const newTheta = theta + speed;
      const newX = radius * Math.sin(phi) * Math.cos(newTheta);
      const newY = radius * Math.cos(phi);
      const newZ = radius * Math.sin(phi) * Math.sin(newTheta);

      this.camera.position.set(newX, newY, newZ);
      this.camera.lookAt(center);
    }

    this.renderer.render(this.scene, this.camera);
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }
}

class PartHierarchy {
  constructor(partsDatabase) {
    this.partsDatabase = partsDatabase;
    this.parts = new Map();
    this.assemblies = {
      'Block': [],
      'Head': [],
      'Intake': [],
      'Exhaust': [],
      'Cooling': [],
      'Oil': [],
      'Ignition': [],
      'Accessories': []
    };
    this.visibleParts = new Set();
    this.removedParts = new Set();

    this.initializeHierarchy();
  }

  initializeHierarchy() {
    Object.entries(this.partsDatabase).forEach(([key, part]) => {
      this.parts.set(part.id, part);
      const assembly = part.assembly;
      if (!this.assemblies[assembly]) this.assemblies[assembly] = [];
      this.assemblies[assembly].push(part);
      this.visibleParts.add(part.id);
    });
  }

  getPart(partId) {
    return this.parts.get(partId);
  }

  getPartsByAssembly(assemblyName) {
    return this.assemblies[assemblyName] || [];
  }

  getAllAssemblies() {
    return Object.keys(this.assemblies);
  }

  removePart(partId) {
    this.visibleParts.delete(partId);
    this.removedParts.add(partId);
  }

  restorePart(partId) {
    this.removedParts.delete(partId);
    this.visibleParts.add(partId);
  }

  resetAll() {
    this.removedParts.clear();
    this.visibleParts.clear();
    this.parts.forEach((part) => {
      this.visibleParts.add(part.id);
    });
  }

  isPartVisible(partId) {
    return this.visibleParts.has(partId);
  }

  isPartRemoved(partId) {
    return this.removedParts.has(partId);
  }

  getRemovedParts() {
    return Array.from(this.removedParts);
  }

  getVisibleParts() {
    return Array.from(this.visibleParts);
  }

  getPartRelationships(partId) {
    const part = this.getPart(partId);
    if (!part) return [];
    return part.relationships || [];
  }

  getConnectedParts(partId) {
    const relationships = this.getPartRelationships(partId);
    return relationships
      .map(name => {
        const found = Array.from(this.parts.values()).find(p => p.name === name);
        return found ? found.id : null;
      })
      .filter(id => id !== null);
  }
}

class EngineModel {
  constructor(scene, partsDatabase) {
    this.scene = scene;
    this.partsDatabase = partsDatabase;
    this.hierarchy = new PartHierarchy(partsDatabase);
    this.parts3D = new Map();
    this.engineGroup = new window.THREE.Group();
    this.partsOriginalTransforms = new Map();
    this.scene.add(this.engineGroup);

    // If a real model is configured, app init() will await loadGLB() instead.
    if (!(window.GLTFLoader && window.ENGINE_GLB)) {
      this.generateEngine();
    }
  }

  // Load a real .glb from a URL (used at startup).
  loadGLB(url) {
    return new Promise((resolve, reject) => {
      const loader = new window.GLTFLoader();
      loader.load(url,
        (gltf) => { try { resolve(this._processGltf(gltf)); } catch (e) { reject(e); } },
        undefined,
        (err) => reject(err));
    });
  }

  // Load a real .glb from an ArrayBuffer (used by the in-app "Load .glb" button).
  loadFromBuffer(buffer) {
    return new Promise((resolve, reject) => {
      const loader = new window.GLTFLoader();
      loader.parse(buffer, '',
        (gltf) => { try { this.clearEngine(); resolve(this._processGltf(gltf)); } catch (e) { reject(e); } },
        (err) => reject(err));
    });
  }

  // Remove the current engine geometry so a new model can replace it.
  clearEngine() {
    [...this.engineGroup.children].forEach(c => {
      this.engineGroup.remove(c);
      c.traverse && c.traverse(o => { if (o.geometry) o.geometry.dispose(); });
    });
    this.parts3D.clear();
    this.partsOriginalTransforms.clear();
  }

  // Shared: center + scale a loaded gltf, split into individually-removable
  // meshes, and rebuild the part hierarchy from the model's mesh nodes.
  _processGltf(gltf) {
    const T = window.THREE;
    const root = gltf.scene;
    const box = new T.Box3().setFromObject(root);
    const size = new T.Vector3(); box.getSize(size);
    const center = new T.Vector3(); box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 250 / maxDim;
    root.position.sub(center);
    const wrap = new T.Group();
    wrap.add(root);
    wrap.scale.setScalar(scale);
    this.scene.add(wrap);
    wrap.updateWorldMatrix(true, true);

    const meshes = [];
    root.traverse(o => { if (o.isMesh) meshes.push(o); });

    const db = {};
    let idx = 0;
    meshes.forEach(m => {
      idx++;
      const id = 'part-' + idx;
      m.castShadow = true; m.receiveShadow = true;
      if (m.material) {
        m.material.side = T.FrontSide;
        if (m.material.metalness === undefined) m.material.metalness = 0.6;
      }
      this.engineGroup.attach(m);          // reparent, preserving world transform
      m.userData.partId = id;
      this.parts3D.set(id, m);
      this.storeOriginalTransform(id, m);
      let nm = (m.name || '').replace(/[_\.]+/g, ' ').replace(/\b\d+\b/g, '').replace(/\s+/g, ' ').trim();
      if (!nm) nm = 'Component ' + idx;
      nm = nm.replace(/\b\w/g, c => c.toUpperCase());
      db[id] = {
        id, name: nm, type: 'Engine Component',
        weight: '-', material: (m.material && m.material.name) || 'Alloy',
        assembly: 'Engine', relationships: []
      };
    });

    this.scene.remove(wrap);
    this.hierarchy = new PartHierarchy(db);
    return meshes.length;
  }

  storeOriginalTransform(partId, object) {
    this.partsOriginalTransforms.set(partId, {
      position: object.position.clone(),
      rotation: object.rotation.clone(),
      scale: object.scale.clone()
    });
  }

  getOriginalTransform(partId) {
    return this.partsOriginalTransforms.get(partId);
  }

  generateEngine() {
    const T = window.THREE;

    // ===== Materials =====
    const matBlock    = new T.MeshStandardMaterial({ color: 0xd0d5db, metalness: 0.52, roughness: 0.45 }); // cast aluminum
    const matCover    = new T.MeshStandardMaterial({ color: 0x1f1f21, metalness: 0.12, roughness: 0.82 }); // matte black plastic
    const matCoverAcc = new T.MeshStandardMaterial({ color: 0xcfcaba, metalness: 0.80, roughness: 0.28 }); // silver styling accent
    const matIntake   = new T.MeshStandardMaterial({ color: 0x161618, metalness: 0.05, roughness: 0.88 }); // black intake manifold plastic
    const matExhaust  = new T.MeshStandardMaterial({ color: 0x8a7a6e, metalness: 0.72, roughness: 0.48 }); // heated stainless steel
    const matAlu      = new T.MeshStandardMaterial({ color: 0xe2e6eb, metalness: 0.78, roughness: 0.28 }); // bright aluminum
    const matAluDark  = new T.MeshStandardMaterial({ color: 0x767c85, metalness: 0.62, roughness: 0.48 }); // cast alloy dark
    const matSteel    = new T.MeshStandardMaterial({ color: 0xe0e4eb, metalness: 0.94, roughness: 0.18 }); // polished steel
    const matSteelDk  = new T.MeshStandardMaterial({ color: 0x38393e, metalness: 0.88, roughness: 0.32 }); // dark iron/steel
    const matBelt     = new T.MeshStandardMaterial({ color: 0x121213, metalness: 0.02, roughness: 0.94 }); // rubber
    const matCoil     = new T.MeshStandardMaterial({ color: 0x1a1a1c, metalness: 0.10, roughness: 0.78 }); // black plastic
    const matCeramic  = new T.MeshStandardMaterial({ color: 0xfbfaee, metalness: 0.12, roughness: 0.52 }); // white spark plug ceramic
    const matBlueCap  = new T.MeshStandardMaterial({ color: 0x1a3d90, metalness: 0.22, roughness: 0.50 }); // oil filter blue cap
    const matFace     = new T.MeshStandardMaterial({ color: 0x90969e, metalness: 0.65, roughness: 0.38 }); // pulley faces
    const matGold     = new T.MeshStandardMaterial({ color: 0xc89e4c, metalness: 0.85, roughness: 0.25 }); // brass/copper
    const matRadiator = new T.MeshStandardMaterial({ color: 0x242426, metalness: 0.25, roughness: 0.75 }); // radiator fins
    const matHose     = new T.MeshStandardMaterial({ color: 0x181819, metalness: 0.05, roughness: 0.85 }); // black coolant hoses

    // ===== Slanted Engine Group (Rotated 30 degrees to the exhaust/right side) =====
    const slantedGrp = new T.Group();
    slantedGrp.rotation.x = -30 * Math.PI / 180;
    this.engineGroup.add(slantedGrp);

    // ===== Helpers =====
    const reg = (mesh, id, isSlanted = true) => {       // register a top-level removable part
      mesh.castShadow = true; mesh.receiveShadow = true;
      mesh.userData.partId = id;
      if (isSlanted) {
        slantedGrp.add(mesh);
      } else {
        this.engineGroup.add(mesh);
      }
      if (!this.parts3D.has(id)) this.parts3D.set(id, mesh);
      this.storeOriginalTransform(id, mesh);
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

    // ===== Geometry layout =====
    // X = length (crank axis), Y = up, Z = front/back of car
    const LEN = 280, BW = 78, BH = 72, HEAD_H = 34, COVER_H = 20;
    const blockY = 0;
    const headY  = blockY + BH / 2 + HEAD_H / 2;
    const coverY = headY + HEAD_H / 2 + COVER_H / 2;

    const span = (LEN - 36) / 6;
    const cx = (i) => -LEN / 2 + 22 + i * span + span / 2;

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
    // Block engine mounts
    [-1, 1].forEach(sgn => {
      const mount = detail(new T.Mesh(new T.BoxGeometry(32, 14, 20), matAluDark), blockGrp);
      mount.position.set(sgn * (LEN / 2 - 40), blockY - 14, sgn * (BW / 2 + 9));
    });
    reg(blockGrp, 'engine-block');

    // ----- CYLINDER HEAD -----
    const headGrp = new T.Group();
    // Head main casting
    detail(roundedBox(LEN, HEAD_H, BW + 2, 5, matBlock), headGrp);
    // Hollowed top camshaft pocket
    const pocket = detail(new T.Mesh(new T.BoxGeometry(LEN - 20, 10, BW - 10), new T.MeshStandardMaterial({ color: 0x5a6068, metalness: 0.5, roughness: 0.6 })), headGrp);
    pocket.position.set(0, HEAD_H / 2 - 4, 0);
    // Internal valve seats details
    for (let i = 0; i < 6; i++) {
      for (let v = 0; v < 2; v++) {
        const vsI = detail(new T.Mesh(new T.CylinderGeometry(7, 7, 2, 16), matSteelDk), headGrp);
        vsI.position.set(cx(i), HEAD_H / 2 - 8, 16);
        const vsE = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 2, 16), matSteelDk), headGrp);
        vsE.position.set(cx(i), HEAD_H / 2 - 8, -16);
      }
    }
    headGrp.position.y = headY;
    reg(headGrp, 'cylinder-head');

    // ----- VALVE COVER (Iconic black plastic + dual silver stripes + BMW badge) -----
    const coverGrp = new T.Group();
    // Matte black main cover
    const coverBase = detail(roundedBox(LEN - 10, COVER_H, BW - 8, 9, matCover), coverGrp);
    // Styling lines & Raised coil cover beauty plates
    const beautyPlate = detail(roundedBox(LEN - 28, 4, BW - 22, 2, matCover), coverGrp);
    beautyPlate.position.set(2, COVER_H / 2 + 2, -2);
    // Dual silver stripes
    const stripe1 = detail(new T.Mesh(new T.BoxGeometry(LEN - 45, 1, 1.8), matCoverAcc), coverGrp);
    stripe1.position.set(2, COVER_H / 2 + 4.1, 12);
    const stripe2 = detail(new T.Mesh(new T.BoxGeometry(LEN - 45, 1, 1.8), matCoverAcc), coverGrp);
    stripe2.position.set(2, COVER_H / 2 + 4.1, 8);
    // BMW brand plate
    const badge = detail(new T.Mesh(new T.BoxGeometry(32, 1, 12), matCoverAcc), coverGrp);
    badge.position.set(-30, COVER_H / 2 + 4.1, -12);
    // Textured Oil cap
    const oilCap = detail(new T.Mesh(new T.CylinderGeometry(9, 9, 6, 24), matCover), coverGrp);
    oilCap.position.set(-LEN / 2 + 34, COVER_H / 2 + 3, 18);
    // VANOS front beauty bulge
    const coverVanosBulge = detail(new T.Mesh(new T.CylinderGeometry(15, 15, BW - 10, 24), matCover), coverGrp);
    coverVanosBulge.rotation.x = Math.PI / 2;
    coverVanosBulge.position.set(LEN / 2 - 12, 0, 0);

    coverGrp.position.y = coverY;
    reg(coverGrp, 'cylinder-head'); // Tagged under cylinder-head removable block
    coverGrp.userData.partId = 'cylinder-head';

    // ----- IGNITION COILS (6, Grouped to fix single-part removal bug) -----
    const coilsGrp = new T.Group();
    for (let i = 0; i < 6; i++) {
      const singleCoil = detail(roundedBox(span * 0.64, 14, 22, 2, matCoil), coilsGrp);
      singleCoil.position.set(cx(i), coverY + COVER_H / 2 + 10, -6);
      // Small yellow connectors or markings
      const conn = detail(new T.Mesh(new T.BoxGeometry(4, 6, 6), matSteelDk), coilsGrp);
      conn.position.set(cx(i) - 8, coverY + COVER_H / 2 + 10, -6);
    }
    reg(coilsGrp, 'ignition-coils');

    // ----- SPARK PLUGS (6, Grouped to fix bug) -----
    const sparkPlugsGrp = new T.Group();
    for (let i = 0; i < 6; i++) {
      const body = detail(new T.Mesh(new T.CylinderGeometry(2.8, 2.8, 12, 12), matCeramic), sparkPlugsGrp);
      body.position.set(cx(i), coverY + COVER_H / 2 + 1, -6);
      const metalHex = detail(new T.Mesh(new T.CylinderGeometry(3.6, 3.6, 3, 6), matSteelDk), sparkPlugsGrp);
      metalHex.position.set(cx(i), coverY + COVER_H / 2 - 3, -6);
      const thread = detail(new T.Mesh(new T.CylinderGeometry(2.4, 2.4, 6, 12), matGold), sparkPlugsGrp);
      thread.position.set(cx(i), coverY + COVER_H / 2 - 7, -6);
    }
    reg(sparkPlugsGrp, 'spark-plugs');

    // ----- DOUBLE VANOS ACTUATOR UNIT -----
    const vanosGrp = new T.Group();
    // Silver actuator housing block
    detail(new T.Mesh(new T.BoxGeometry(24, 38, BW - 10), matAlu), vanosGrp);
    // Intake & Exhaust twin actuator cylinder domes (Double VANOS)
    const domeIntake = detail(new T.Mesh(new T.CylinderGeometry(12, 12, 14, 24), matAlu), vanosGrp);
    domeIntake.rotation.z = Math.PI / 2;
    domeIntake.position.set(16, 6, 18);
    const domeExhaust = detail(new T.Mesh(new T.CylinderGeometry(12, 12, 14, 24), matAlu), vanosGrp);
    domeExhaust.rotation.z = Math.PI / 2;
    domeExhaust.position.set(16, 6, -18);
    // Solenoids (cylinder actuators)
    const solIntake = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 15, 18), matSteel), vanosGrp);
    solIntake.rotation.z = Math.PI / 2;
    solIntake.position.set(12, -10, 18);
    const solExhaust = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 15, 18), matSteel), vanosGrp);
    solExhaust.rotation.z = Math.PI / 2;
    solExhaust.position.set(12, -10, -18);
    
    vanosGrp.position.set(LEN / 2 - 4, headY + 4, 0);
    reg(vanosGrp, 'vanos-actuators');

    // ----- INTERNAL MECHANICS: DOHC CAMSHAFTS [NEW] -----
    const camshaftsGrp = new T.Group();
    // Intake camshaft (located on the intake +Z side)
    const shaftI = detail(new T.Mesh(new T.CylinderGeometry(4.5, 4.5, LEN - 24, 16), matSteel), camshaftsGrp);
    shaftI.rotation.z = Math.PI / 2;
    shaftI.position.set(0, headY + 8, 18);
    // Exhaust camshaft (located on the exhaust -Z side)
    const shaftE = detail(new T.Mesh(new T.CylinderGeometry(4.5, 4.5, LEN - 24, 16), matSteel), camshaftsGrp);
    shaftE.rotation.z = Math.PI / 2;
    shaftE.position.set(0, headY + 8, -18);
    // Sprocket gears & Cam lobes (12 lobes per shaft)
    const sprocketI = detail(new T.Mesh(new T.CylinderGeometry(14, 14, 5, 32), matSteelDk), camshaftsGrp);
    sprocketI.rotation.z = Math.PI / 2;
    sprocketI.position.set(LEN / 2 - 12, headY + 8, 18);
    const sprocketE = detail(new T.Mesh(new T.CylinderGeometry(14, 14, 5, 32), matSteelDk), camshaftsGrp);
    sprocketE.rotation.z = Math.PI / 2;
    sprocketE.position.set(LEN / 2 - 12, headY + 8, -18);

    for (let i = 0; i < 6; i++) {
      const angleI = (i * 2 * Math.PI) / 6;
      const angleE = angleI + Math.PI / 3;
      // 2 intake lobes per cylinder
      for (let l = 0; l < 2; l++) {
        const offset = -4 + l * 8;
        const lobeI = detail(new T.Mesh(new T.BoxGeometry(6, 12, 7.5), matSteel), camshaftsGrp);
        lobeI.position.set(cx(i) + offset, headY + 8 + Math.cos(angleI) * 2, 18 + Math.sin(angleI) * 2);
        lobeI.rotation.x = angleI;
        const lobeE = detail(new T.Mesh(new T.BoxGeometry(6, 12, 7.5), matSteel), camshaftsGrp);
        lobeE.position.set(cx(i) + offset, headY + 8 + Math.cos(angleE) * 2, -18 + Math.sin(angleE) * 2);
        lobeE.rotation.x = angleE;
      }
    }
    reg(camshaftsGrp, 'camshafts');

    // ----- INTERNAL MECHANICS: VALVES & SPRINGS (24 pcs) [NEW] -----
    const valvesGrp = new T.Group();
    for (let i = 0; i < 6; i++) {
      for (let l = 0; l < 2; l++) {
        const offset = -4 + l * 8;
        // Intake valves (angled at 12 degrees outwards to +Z)
        const vIntake = new T.Group();
        const stemI = detail(new T.Mesh(new T.CylinderGeometry(1.2, 1.2, 22, 8), matSteel), vIntake);
        const springI = detail(new T.Mesh(new T.CylinderGeometry(3.6, 3.6, 10, 16), matSteelDk), vIntake);
        springI.position.y = 5;
        const discI = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 1, 16), matSteel), vIntake);
        discI.position.y = -11;
        vIntake.rotation.x = 0.21;
        vIntake.position.set(cx(i) + offset, headY - 1, 18);
        detail(vIntake, valvesGrp);

        // Exhaust valves (angled at 12 degrees outwards to -Z)
        const vExhaust = new T.Group();
        const stemE = detail(new T.Mesh(new T.CylinderGeometry(1.2, 1.2, 22, 8), matSteel), vExhaust);
        const springE = detail(new T.Mesh(new T.CylinderGeometry(3.6, 3.6, 10, 16), matSteelDk), vExhaust);
        springE.position.y = 5;
        const discE = detail(new T.Mesh(new T.CylinderGeometry(5.2, 5.2, 1, 16), matSteel), vExhaust);
        discE.position.y = -11;
        vExhaust.rotation.x = -0.21;
        vExhaust.position.set(cx(i) + offset, headY - 1, -18);
        detail(vExhaust, valvesGrp);
      }
    }
    reg(valvesGrp, 'valves');

    // ----- INTERNAL MECHANICS: TIMING CHAIN & GUIDE RAIL [NEW] -----
    const chainGrp = new T.Group();
    // Timing chain loop
    const chainPath = new T.CatmullRomCurve3([
      new T.Vector3(LEN / 2 - 12, headY + 8, 18),
      new T.Vector3(LEN / 2 - 12, headY + 8, -18),
      new T.Vector3(LEN / 2 - 12, blockY - 6, -14),
      new T.Vector3(LEN / 2 - 12, blockY - 6, 14)
    ], true);
    const chainMesh = detail(new T.Mesh(new T.TubeGeometry(chainPath, 64, 2.8, 12, true), matSteelDk), chainGrp);
    // Guide rail plastic strip
    const guideCurve = new T.CatmullRomCurve3([
      new T.Vector3(LEN / 2 - 14, headY + 2, -19),
      new T.Vector3(LEN / 2 - 14, blockY - 2, -15)
    ]);
    detail(new T.Mesh(new T.TubeGeometry(guideCurve, 10, 3.6, 8, false), matCover), chainGrp);
    reg(chainGrp, 'timing-chain');

    // ----- INTERNAL MECHANICS: CRANKSHAFT WITH 12 COUNTERWEIGHTS -----
    const crankGrp = new T.Group();
    // Main journal shaft
    const mainShaft = detail(new T.Mesh(new T.CylinderGeometry(11, 11, LEN + 15, 24), matSteel), crankGrp);
    mainShaft.rotation.z = Math.PI / 2;
    mainShaft.position.set(0, blockY - 6, 0);

    const crankThrow = 12;
    const angles = [0, 2 * Math.PI / 3, 4 * Math.PI / 3, 4 * Math.PI / 3, 2 * Math.PI / 3, 0]; // standard I6 crank configuration
    
    // Create counterweights & crankpins
    for (let i = 0; i < 6; i++) {
      const a = angles[i];
      const pinX = cx(i);
      const pinY = blockY - 6 + Math.cos(a) * crankThrow;
      const pinZ = Math.sin(a) * crankThrow;

      // Crankpin journal
      const pin = detail(new T.Mesh(new T.CylinderGeometry(8, 8, 16, 18), matSteel), crankGrp);
      pin.rotation.z = Math.PI / 2;
      pin.position.set(pinX, pinY, pinZ);

      // Two counterweight webs per crankpin
      [-1, 1].forEach(offset => {
        const web = detail(new T.Mesh(new T.BoxGeometry(8, 38, 18), matSteelDk), crankGrp);
        web.position.set(pinX + offset * 8, blockY - 6 - Math.cos(a) * 8, -Math.sin(a) * 8);
        web.rotation.x = a + Math.PI; // pointing opposite to crankpin throw
      });
    }
    reg(crankGrp, 'crankshaft');

    // ----- INTERNAL MECHANICS: PISTONS & CONNECTING RODS [NEW] -----
    const pistonsGrp = new T.Group();
    const rodsGrp = new T.Group();

    for (let i = 0; i < 6; i++) {
      const a = angles[i];
      const pinY = blockY - 6 + Math.cos(a) * crankThrow;
      const pinZ = Math.sin(a) * crankThrow;
      const rodLen = 52;
      // Slider-crank formula for exact piston height Y
      const pistonY = blockY - 6 + Math.cos(a) * crankThrow + Math.sqrt(rodLen * rodLen - pinZ * pinZ);

      // Pistons (silver alloy cylinders with ring grooves)
      const pistonSingle = new T.Group();
      const pBody = detail(new T.Mesh(new T.CylinderGeometry(17, 17, 18, 24), matAlu), pistonSingle);
      // Piston rings details (dark steel thin cylinders)
      const pRing1 = detail(new T.Mesh(new T.CylinderGeometry(17.2, 17.2, 0.8, 24), matSteelDk), pistonSingle);
      pRing1.position.y = 4;
      const pRing2 = detail(new T.Mesh(new T.CylinderGeometry(17.2, 17.2, 0.8, 24), matSteelDk), pistonSingle);
      pRing2.position.y = 1;
      pistonSingle.position.set(cx(i), pistonY, 0);
      detail(pistonSingle, pistonsGrp);

      // Connecting rods (H-beam steel connecting crankshaft journal to piston)
      const rodSingle = new T.Group();
      const dist = Math.hypot(pistonY - pinY, -pinZ);
      const angleX = Math.atan2(-pinZ, pistonY - pinY);

      const rBeam = detail(new T.Mesh(new T.BoxGeometry(6, dist - 16, 8), matSteel), rodSingle);
      rBeam.position.y = (pistonY - pinY) / 2;
      rBeam.position.z = pinZ / 2;
      rBeam.rotation.x = angleX;

      const rCapBig = detail(new T.Mesh(new T.CylinderGeometry(11, 11, 10, 20), matSteelDk), rodSingle);
      rCapBig.rotation.z = Math.PI / 2;
      rCapBig.position.set(0, 0, pinZ);
      
      const rCapSmall = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 8, 16), matSteelDk), rodSingle);
      rCapSmall.rotation.z = Math.PI / 2;
      rCapSmall.position.set(0, pistonY - pinY, 0);

      rodSingle.position.set(cx(i), pinY, 0);
      detail(rodSingle, rodsGrp);
    }
    reg(pistonsGrp, 'pistons');
    reg(rodsGrp, 'connecting-rods');

    // ----- INTERNAL MECHANICS: OIL PUMP [NEW] -----
    const oilPumpGrp = new T.Group();
    // Pump main body block
    detail(new T.Mesh(new T.BoxGeometry(24, 20, 24), matAluDark), oilPumpGrp);
    // Oil pickup curved pipe
    const pickupPipe = new T.CatmullRomCurve3([
      new T.Vector3(0, 0, 0),
      new T.Vector3(-10, -18, 0),
      new T.Vector3(-14, -30, 4)
    ]);
    detail(new T.Mesh(new T.TubeGeometry(pickupPipe, 12, 4.5, 12, false), matAlu), oilPumpGrp);
    // Pickup mesh screen cup
    const cup = detail(new T.Mesh(new T.CylinderGeometry(12, 12, 6, 18), matSteelDk), oilPumpGrp);
    cup.position.set(-14, -30, 4);
    // Drive chain from crankshaft sprocket
    const pumpChainCurve = new T.CatmullRomCurve3([
      new T.Vector3(LEN / 2 - 58, blockY - 6, 0),
      new T.Vector3(LEN / 2 - 58, blockY - 32, -4),
      new T.Vector3(LEN / 2 - 58, blockY - 32, 4)
    ], true);
    detail(new T.Mesh(new T.TubeGeometry(pumpChainCurve, 16, 1.8, 8, true), matSteelDk), oilPumpGrp);

    oilPumpGrp.position.set(LEN / 2 - 58, blockY - 32, 0);
    reg(oilPumpGrp, 'oil-pump');

    // ----- INTAKE MANIFOLD (6 Curved runners + DISA + Throttle) -----
    const intakeGrp = new T.Group();
    // Matte black intake plenum
    const plenum = detail(new T.Mesh(new T.CylinderGeometry(20, 20, LEN - 50, 28), matIntake), intakeGrp);
    plenum.rotation.z = Math.PI / 2;
    plenum.position.set(-8, headY + 12, BW / 2 + 32);

    // 6 long curved runners wrapping over the top of the head
    for (let i = 0; i < 6; i++) {
      const runCurve = new T.CatmullRomCurve3([
        new T.Vector3(-8, headY + 12, BW / 2 + 32),       // plenum exit
        new T.Vector3(0, headY + 28, BW / 2 + 24),        // arch over head
        new T.Vector3(12, headY + 26, BW / 2 + 10),       // curve down
        new T.Vector3(2, headY + 2, BW / 2 - 1)          // intake port
      ]);
      const runner = detail(new T.Mesh(new T.TubeGeometry(runCurve, 32, 6.4, 16, false), matIntake), intakeGrp);
      runner.position.x = cx(i);
    }
    
    // DISA Valve box (signature M54 component)
    const disa = detail(new T.Mesh(new T.BoxGeometry(20, 26, 14), matIntake), intakeGrp);
    disa.position.set(-LEN / 2 + 75, headY + 12, BW / 2 + 45);

    // Throttle inlet elbow (front curved intake pipe)
    const elbowCurve = new T.CatmullRomCurve3([
      new T.Vector3(LEN / 2 - 25, headY + 12, BW / 2 + 32),
      new T.Vector3(LEN / 2 + 2, headY + 18, BW / 2 + 24),
      new T.Vector3(LEN / 2 + 14, headY + 36, BW / 2 + 10),
      new T.Vector3(LEN / 2 + 10, headY + 54, BW / 2 - 8)
    ]);
    detail(new T.Mesh(new T.TubeGeometry(elbowCurve, 32, 13.5, 20, false), matIntake), intakeGrp);
    reg(intakeGrp, 'intake-manifold');

    // Throttle body unit
    const throttleGrp = new T.Group();
    detail(new T.Mesh(new T.CylinderGeometry(15, 15, 18, 24), matAluDark), throttleGrp);
    // Actuator motor housing on side
    const actBody = detail(new T.Mesh(new T.BoxGeometry(10, 16, 16), matCover), throttleGrp);
    actBody.position.set(0, 0, 14);
    throttleGrp.rotation.z = Math.PI / 2;
    throttleGrp.position.set(LEN / 2 - 23, headY + 12, BW / 2 + 32);
    reg(throttleGrp, 'throttle-body');

    // Fuel Injectors & Fuel Rail (Grouped to fix single-part removal bug)
    const injectorsGrp = new T.Group();
    // Fuel Rail (silver square rail)
    const rail = detail(new T.Mesh(new T.BoxGeometry(LEN - 45, 4, 4), matSteel), injectorsGrp);
    rail.position.set(0, headY + 1, BW / 2 + 12);
    for (let i = 0; i < 6; i++) {
      const inj = detail(new T.Mesh(new T.CylinderGeometry(2.4, 1.8, 14, 10), matSteelDk), injectorsGrp);
      inj.position.set(cx(i), headY - 6, BW / 2 + 12);
      const connector = detail(new T.Mesh(new T.BoxGeometry(4, 5, 5), matCoil), injectorsGrp);
      connector.position.set(cx(i), headY - 2, BW / 2 + 12);
    }
    reg(injectorsGrp, 'fuel-injectors');

    // ----- EXHAUST MANIFOLD (2 separate tubular headers with Catalytic Converters) -----
    const exGrp = new T.Group();
    // M54B30 twin 3-into-1 stainless headers
    const manifoldBanks = [
      { start: 0, end: 3, midX: -60 },
      { start: 3, end: 6, midX: 60 }
    ];
    manifoldBanks.forEach((bank, idx) => {
      // Catalytic converter canister
      const cat = detail(new T.Mesh(new T.CylinderGeometry(15, 15, 34, 24), matExhaust), exGrp);
      cat.position.set(bank.midX, headY - 32, -BW / 2 - 22);
      cat.rotation.x = 0.5;

      for (let i = bank.start; i < bank.end; i++) {
        const exCurve = new T.CatmullRomCurve3([
          new T.Vector3(cx(i), headY - 2, -BW / 2 + 2),       // port
          new T.Vector3(cx(i) * 0.9 + bank.midX * 0.1, headY - 14, -BW / 2 - 12),
          new T.Vector3(bank.midX, headY - 30, -BW / 2 - 20)  // merge into cat
        ]);
        detail(new T.Mesh(new T.TubeGeometry(exCurve, 20, 6.2, 12, false), matExhaust), exGrp);
      }
      
      // Downpipe extending from cat
      const downpipeCurve = new T.CatmullRomCurve3([
        new T.Vector3(bank.midX, headY - 48, -BW / 2 - 30),
        new T.Vector3(bank.midX - 10, headY - 70, -BW / 2 - 34)
      ]);
      detail(new T.Mesh(new T.TubeGeometry(downpipeCurve, 10, 8.5, 12, false), matExhaust), exGrp);
    });
    reg(exGrp, 'exhaust-manifold');

    // Oxygen Sensors (4 total: 2 pre-cat, 2 post-cat)
    const o2Grp = new T.Group();
    manifoldBanks.forEach(bank => {
      // Pre-cat sensor
      const o2Pre = detail(new T.Mesh(new T.CylinderGeometry(2, 2, 8, 10), matSteel), o2Grp);
      o2Pre.position.set(bank.midX, headY - 18, -BW / 2 - 16);
      o2Pre.rotation.x = -0.5;
      // Post-cat sensor
      const o2Post = detail(new T.Mesh(new T.CylinderGeometry(2, 2, 8, 10), matSteel), o2Grp);
      o2Post.position.set(bank.midX - 8, headY - 58, -BW / 2 - 32);
      o2Post.rotation.x = -0.5;
    });
    reg(o2Grp, 'oxygen-sensors');

    // ----- OIL PAN (Tapered front deep sump design) -----
    const panGrp = new T.Group();
    // Mating flange
    detail(roundedBox(LEN - 16, 12, BW + 2, 4, matAluDark), panGrp);
    // Pan body tapering to front deep sump (deep sump is towards +X front of engine bay)
    const panDeep = detail(roundedBox(LEN * 0.44, 28, BW - 6, 6, matAluDark), panGrp);
    panDeep.position.set(LEN * 0.22, -20, 0);
    const panShallow = detail(roundedBox(LEN * 0.46, 14, BW - 6, 6, matAluDark), panGrp);
    panShallow.position.set(-LEN * 0.22, -13, 0);
    // Drain plug
    const plug = detail(new T.Mesh(new T.CylinderGeometry(4, 4, 3, 12), matSteel), panGrp);
    plug.position.set(LEN * 0.22, -35, BW / 2 - 8);
    plug.rotation.z = Math.PI / 2;

    panGrp.position.y = blockY - BH / 2 - 6;
    reg(panGrp, 'oil-pan');

    // ===== FRONT ACCESSORY DRIVE (Dual belt setup) =====
    const beltX1 = LEN / 2 + 18;       // main belt plane
    const beltX2 = LEN / 2 + 28;       // secondary AC belt plane
    const bodyX = LEN / 2 + 3;
    
    // Pulley positions: Y, Z, R (radius)
    const A = {
      crank:      { y: blockY - 6, z: 0,   r: 34 },
      waterPump:  { y: blockY + 28, z: -3,  r: 18 },
      alternator: { y: blockY + 16, z: 38,  r: 15 },
      idler:      { y: blockY + 32, z: 18,  r: 9  },
      tensioner:  { y: blockY + 10, z: -28, r: 11 },
      ps:         { y: blockY - 18, z: -34, r: 13 },
      ac:         { y: blockY - 34, z: 28,  r: 16 },
      acTens:     { y: blockY - 14, z: 24,  r: 9  }
    };

    // Crankshaft pulley / damper (dual groove)
    const damperGrp = new T.Group();
    detail(crankDamper(A.crank.r, 14, matSteelDk), damperGrp);
    const damper2 = detail(crankDamper(A.crank.r - 2, 10, matSteelDk), damperGrp);
    damper2.position.x = 10; // second groove for AC belt
    damperGrp.position.set(beltX1, A.crank.y, A.crank.z);
    reg(damperGrp, 'pulleys');

    // Water pump (body + single groove pulley)
    const wpGrp = new T.Group();
    const wpBody = detail(new T.Mesh(new T.CylinderGeometry(18, 18, 22, 20), matAluDark), wpGrp);
    wpBody.rotation.z = Math.PI / 2; wpBody.position.set(bodyX - 16, A.waterPump.y, A.waterPump.z);
    const wpPul = detail(ribbedPulley(A.waterPump.r, 12, matSteelDk, 5), wpGrp);
    wpPul.position.set(beltX1, A.waterPump.y, A.waterPump.z);
    reg(wpGrp, 'water-pump');

    // Alternator (finned heavy frame + cooling fan + main pulley)
    const altGrp = new T.Group();
    const altBody = alternatorBody(19, 38, matAlu);
    altBody.position.set(bodyX - 22, A.alternator.y, A.alternator.z);
    detail(altBody, altGrp);
    const altPul = detail(ribbedPulley(A.alternator.r, 12, matSteel, 5), altGrp);
    altPul.position.set(beltX1, A.alternator.y, A.alternator.z);
    reg(altGrp, 'alternator');

    // Power steering pump (body + pulley)
    const psGrp = new T.Group();
    const psBody = detail(new T.Mesh(new T.CylinderGeometry(16, 16, 30, 20), matAlu), psGrp);
    psBody.rotation.z = Math.PI / 2; psBody.position.set(bodyX - 20, A.ps.y, A.ps.z);
    const psPul = detail(ribbedPulley(A.ps.r, 12, matSteel, 5), psGrp);
    psPul.position.set(beltX1, A.ps.y, A.ps.z);
    reg(psGrp, 'power-steering-pump');

    // AC compressor (long cylindrical body + clutch pulley in front groove)
    const acGrp = new T.Group();
    const acBody = detail(new T.Mesh(new T.CylinderGeometry(20, 20, 36, 24), matAluDark), acGrp);
    acBody.rotation.z = Math.PI / 2; acBody.position.set(bodyX - 18, A.ac.y, A.ac.z);
    const acPul = detail(ribbedPulley(A.ac.r, 12, matSteelDk, 6), acGrp);
    acPul.position.set(beltX2, A.ac.y, A.ac.z); // driven by secondary belt
    reg(acGrp, 'ac-compressor');

    // Pulleys & Tensioners (Grouped: Main idler, Main tensioner, AC tensioner)
    const pulleysGrp = new T.Group();
    // Main belt tensioner
    const mainTens = detail(tensioner(A.tensioner.r, matSteelDk), pulleysGrp);
    mainTens.position.set(beltX1, A.tensioner.y, A.tensioner.z);
    // Main belt idler
    const mainIdler = detail(ribbedPulley(A.idler.r, 12, matSteel, 4), pulleysGrp);
    mainIdler.position.set(beltX1, A.idler.y, A.idler.z);
    // AC belt tensioner pulley
    const acTens = detail(ribbedPulley(A.acTens.r, 10, matSteel, 4), pulleysGrp);
    acTens.position.set(beltX2, A.acTens.y, A.acTens.z);
    reg(pulleysGrp, 'pulleys');

    // Serpentine Belt 1: Main accessory belt
    const belt1 = buildBelt(
      [A.crank, A.waterPump, A.alternator, A.idler, A.tensioner, A.ps],
      beltX1 + 2, 3.2
    );
    reg(belt1, 'serpentine-belt');

    // Serpentine Belt 2: AC compressor belt [NEW]
    const belt2 = buildBelt(
      [A.crank, A.acTens, A.ac],
      beltX2 + 2, 2.6
    );
    reg(belt2, 'serpentine-belt'); // share ID with belt1 so they disassemble together

    // ----- COOLANT THERMOSTAT HOUSING -----
    const thermoGrp = new T.Group();
    // Thermostat cover (curved plastic flange at front of head)
    const thermoBody = detail(new T.Mesh(new T.CylinderGeometry(11, 11, 16, 18), matCover), thermoGrp);
    thermoBody.rotation.x = Math.PI / 2;
    // Coolant pipe elbow going down
    const pCurve = new T.CatmullRomCurve3([
      new T.Vector3(0, 0, 0),
      new T.Vector3(12, -8, -10),
      new T.Vector3(20, -18, -14)
    ]);
    detail(new T.Mesh(new T.TubeGeometry(pCurve, 12, 7.5, 12, false), matCover), thermoGrp);
    thermoGrp.position.set(LEN / 2 + 2, headY, -8);
    reg(thermoGrp, 'thermostat');

    // ----- OIL FILTER HOUSING (Detailed housing + cooler exchanger) -----
    const ofGrp = new T.Group();
    // Silver adapter block
    detail(new T.Mesh(new T.BoxGeometry(18, 22, 14), matAlu), ofGrp);
    // Filter canister cylinder
    const ofCan = detail(new T.Mesh(new T.CylinderGeometry(12, 12, 28, 20), matAlu), ofGrp);
    ofCan.position.set(0, 16, 0);
    // Black canister cap with ridges
    const ofCap = detail(new T.Mesh(new T.CylinderGeometry(12.5, 12.5, 6, 20), matCover), ofGrp);
    ofCap.position.set(0, 31, 0);
    for (let r = 0; r < 8; r++) {
      const a = (r / 8) * Math.PI * 2;
      const ridge = detail(new T.Mesh(new T.BoxGeometry(2, 6, 1), matCover), ofGrp);
      ridge.position.set(Math.cos(a) * 12.2, 31, Math.sin(a) * 12.2);
      ridge.rotation.y = -a;
    }
    // Oil-to-coolant heat exchanger block (rectangular silver box on housing)
    const cooler = detail(new T.Mesh(new T.BoxGeometry(16, 12, 26), matSteel), ofGrp);
    cooler.position.set(-6, 2, 16);

    ofGrp.position.set(LEN / 2 - 58, blockY + 12, BW / 2 + 15);
    reg(ofGrp, 'oil-filter');

    // ----- STARTER MOTOR -----
    const starterGrp = new T.Group();
    // Main motor cylinder
    detail(new T.Mesh(new T.CylinderGeometry(12.5, 12.5, 34, 18), matSteelDk), starterGrp);
    // Solenoid actuator cylinder on top
    const sol = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 22, 12), matSteel), starterGrp);
    sol.position.set(0, 12, 4);
    starterGrp.rotation.z = Math.PI / 2;
    starterGrp.position.set(-LEN / 2 + 20, blockY - 26, BW / 2 + 12);
    reg(starterGrp, 'starter-motor');

    // ----- FLYWHEEL (Rear crank wheel) -----
    const fly = new T.Mesh(new T.CylinderGeometry(40, 40, 12, 48), matSteelDk);
    fly.rotation.z = Math.PI / 2;
    fly.position.set(-LEN / 2 - 8, blockY - 6, 0);
    reg(fly, 'flywheel');

    // ----- RADIATOR & FANS [NEW] -----
    const radGrp = new T.Group();
    // Radiator center core grid
    detail(new T.Mesh(new T.BoxGeometry(10, 100, 130), matRadiator), radGrp);
    // Frame surround
    detail(new T.Mesh(new T.BoxGeometry(12, 110, 138), matCover), radGrp);
    // Top & bottom caps
    const capT = detail(new T.Mesh(new T.BoxGeometry(14, 6, 138), matCover), radGrp);
    capT.position.y = 53;
    const capB = detail(new T.Mesh(new T.BoxGeometry(14, 6, 138), matCover), radGrp);
    capB.position.y = -53;

    // Dual fans shroud & blades on engine side (-X side)
    const fanZ = [-28, 28];
    fanZ.forEach(fz => {
      const shroud = detail(new T.Mesh(new T.CylinderGeometry(24, 24, 6, 24), matCover), radGrp);
      shroud.rotation.z = Math.PI / 2;
      shroud.position.set(-6, 0, fz);
      const motor = detail(new T.Mesh(new T.CylinderGeometry(6, 6, 8, 12), matSteelDk), radGrp);
      motor.rotation.z = Math.PI / 2;
      motor.position.set(-10, 0, fz);
      // Fan blades
      for (let b = 0; b < 7; b++) {
        const a = (b / 7) * Math.PI * 2;
        const blade = detail(new T.Mesh(new T.BoxGeometry(1, 20, 4), matCover), radGrp);
        blade.position.set(-8, Math.cos(a) * 11, fz + Math.sin(a) * 11);
        blade.rotation.x = a + 0.3;
      }
    });

    radGrp.position.set(LEN / 2 + 105, blockY, 0);
    reg(radGrp, 'radiator', false); // Radiator sits straight, NOT slanted!

    // ----- RADIATOR HOSES [NEW] -----
    const hosesGrp = new T.Group();
    // Upper coolant hose: thermostat housing to radiator top left
    const upperCurve = new T.CatmullRomCurve3([
      new T.Vector3(LEN / 2 + 14, headY - 14, -14),
      new T.Vector3(LEN / 2 + 50, headY - 6, -34),
      new T.Vector3(LEN / 2 + 95, blockY + 45, -34)
    ]);
    detail(new T.Mesh(new T.TubeGeometry(upperCurve, 20, 6.5, 12, false), matHose), hosesGrp);
    // Lower coolant hose: water pump to radiator bottom right
    const lowerCurve = new T.CatmullRomCurve3([
      new T.Vector3(LEN / 2 - 2, blockY + 28, -8),
      new T.Vector3(LEN / 2 + 45, blockY - 12, 38),
      new T.Vector3(LEN / 2 + 95, blockY - 45, 38)
    ]);
    detail(new T.Mesh(new T.TubeGeometry(lowerCurve, 20, 6.5, 12, false), matHose), hosesGrp);
    reg(hosesGrp, 'thermostat'); // group under thermostat/cooling

    // ----- COOLANT EXPANSION TANK -----
    const tank = new T.Mesh(new T.BoxGeometry(26, 44, 22), new T.MeshStandardMaterial({ color: 0xcdc9bc, metalness: 0.1, roughness: 0.6, transparent: true, opacity: 0.8 }));
    tank.position.set(-LEN / 2 + 40, headY + 34, BW / 2 + 42);
    reg(tank, 'coolant-tank', false); // Expansion tank sits straight, NOT slanted!

    // Catch-all: ensure every tagged child in the entire scene has a stored transform
    this.engineGroup.traverse(child => {
      if (child.userData?.partId && !this.partsOriginalTransforms.has(child.userData.partId)) {
        this.storeOriginalTransform(child.userData.partId, child);
      }
    });
  }

  getPart3D(partId) {
    return this.parts3D.get(partId);
  }

  getAllParts3D() {
    return this.parts3D;
  }

  getHierarchy() {
    return this.hierarchy;
  }

  getEngineGroup() {
    return this.engineGroup;
  }
}

class InteractionManager {
  constructor(scene, engineModel, onPartSelected) {
    this.scene = scene;
    this.engineModel = engineModel;
    this.onPartSelected = onPartSelected;
    this.selectedPart = null;
    this.highlightedPart = null;
    this.raycaster = new window.THREE.Raycaster();
    this.mouse = new window.THREE.Vector2();
    this.originalMaterials = new Map();

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('click', (e) => this.onClick(e));
  }

  onMouseMove(event) {
    const canvas = event.target;
    if (canvas.tagName !== 'CANVAS') return;

    const rect = canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.updateHighlight();
  }

  updateHighlight() {
    const intersects = this.getIntersects();

    if (this.highlightedPart) {
      this.restoreMaterial(this.highlightedPart);
    }

    if (intersects.length > 0) {
      const object = intersects[0].object;
      this.highlightedPart = object;
      this.highlightPart(object);
    } else {
      this.highlightedPart = null;
    }
  }

  onClick(event) {
    const canvas = event.target;
    if (canvas.tagName !== 'CANVAS') return;

    const intersects = this.getIntersects();

    if (intersects.length > 0) {
      const object = intersects[0].object;
      this.selectPart(object);
    }
  }

  getIntersects() {
    this.raycaster.setFromCamera(this.mouse, this.scene.getCamera());
    return this.raycaster.intersectObjects(this.engineModel.getEngineGroup().children, true);
  }

  selectPart(object) {
    let partObject = object;
    while (partObject && !partObject.userData.partId) {
      partObject = partObject.parent;
    }

    if (!partObject || !partObject.userData.partId) return;

    this.selectedPart = partObject;
    const partId = partObject.userData.partId;
    this.onPartSelected?.(partId);
  }

  highlightPart(object) {
    if (!object.material) return;

    const originalMaterial = object.material;
    if (!this.originalMaterials.has(object)) {
      this.originalMaterials.set(object, originalMaterial.clone());
    }

    const newMaterial = originalMaterial.clone();
    newMaterial.emissive = new window.THREE.Color(0xff6b35);
    newMaterial.emissiveIntensity = 0.5;
    object.material = newMaterial;
  }

  restoreMaterial(object) {
    if (this.originalMaterials.has(object)) {
      object.material = this.originalMaterials.get(object);
    }
  }

  clearSelection() {
    if (this.selectedPart) {
      this.restoreMaterial(this.selectedPart);
      this.selectedPart = null;
    }
  }

  getSelectedPart() {
    return this.selectedPart;
  }

  getSelectedPartId() {
    return this.selectedPart?.userData.partId || null;
  }
}

class AnimationController {
  constructor(engineModel = null) {
    this.engineModel = engineModel;
    this.activeAnimations = new Map();
    this.animationFrameId = null;
  }

  setOpacityRecursive(object, opacity) {
    object.traverse(child => {
      if (child.isMesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach(mat => {
          if (!mat.userData.isClonedForFade) {
            child.material = mat.clone();
            child.material.userData.isClonedForFade = true;
          }
          child.material.transparent = true;
          child.material.opacity = opacity;
        });
      }
    });
  }

  removePart(partObject, callback) {
    if (!partObject) return;

    const startPos = partObject.position.clone();
    const startRot = partObject.rotation.clone();
    const startScale = partObject.scale.clone();
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      partObject.rotation.x = startRot.x + Math.PI / 2 * progress;
      partObject.rotation.y = startRot.y + Math.PI / 4 * progress;

      const direction = partObject.position.clone().normalize();
      const slideDistance = 150 * progress;
      partObject.position.copy(startPos).add(direction.multiplyScalar(slideDistance));

      this.setOpacityRecursive(partObject, 1 - progress * 0.8);

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        partObject.visible = false;
        this.activeAnimations.delete(partObject);
        callback?.();
      }
    };

    this.activeAnimations.set(partObject, { startTime, duration });
    animate();
  }

  restorePart(partObject, callback) {
    if (!partObject) return;

    partObject.visible = true;
    const startPos = partObject.position.clone();
    const startRot = partObject.rotation.clone();
    const duration = 1000;
    const startTime = Date.now();

    const originalData = this.getOriginalTransform(partObject);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      partObject.position.lerpVectors(startPos, originalData.pos, easeProgress);
      partObject.rotation.x = startRot.x + (originalData.rot.x - startRot.x) * easeProgress;
      partObject.rotation.y = startRot.y + (originalData.rot.y - startRot.y) * easeProgress;

      this.setOpacityRecursive(partObject, 0.2 + progress * 0.8);

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      } else {
        this.setOpacityRecursive(partObject, 1.0);
        this.activeAnimations.delete(partObject);
        callback?.();
      }
    };

    this.activeAnimations.set(partObject, { startTime, duration });
    animate();
  }

  getOriginalTransform(partObject) {
    if (this.engineModel && partObject.userData?.partId) {
      const stored = this.engineModel.getOriginalTransform(partObject.userData.partId);
      if (stored) {
        return {
          pos: stored.position,
          rot: stored.rotation
        };
      }
    }
    return {
      pos: new window.THREE.Vector3(0, 0, 0),
      rot: { x: 0, y: 0, z: 0 }
    };
  }

  stopAnimation(partObject) {
    if (this.activeAnimations.has(partObject)) {
      cancelAnimationFrame(this.animationFrameId);
      this.activeAnimations.delete(partObject);
    }
  }

  stopAllAnimations() {
    cancelAnimationFrame(this.animationFrameId);
    this.activeAnimations.clear();
  }

  isAnimating(partObject) {
    return this.activeAnimations.has(partObject);
  }
}

class UIPanel {
  constructor(hierarchy) {
    this.hierarchy = hierarchy;
    this.setupUI();
  }

  setupUI() {
    this.resetBtn = document.getElementById('reset-btn');
    this.partName = document.getElementById('part-name');
    this.partType = document.getElementById('part-type');
    this.partWeight = document.getElementById('part-weight');
    this.partMaterial = document.getElementById('part-material');
    this.partAssembly = document.getElementById('part-assembly');
    this.relationshipsList = document.getElementById('part-relationships');
    this.partsList = document.getElementById('parts-list');
    this.removedPartsIcons = document.getElementById('removed-parts-icons');

    this.populatePartsList();
    this.displayDefaultInfo();
    this.updateRemovedPartsBar();
  }

  populatePartsList() {
    this.partsList.innerHTML = '';
    const assemblies = this.hierarchy.getAllAssemblies();

    assemblies.forEach(assembly => {
      const parts = this.hierarchy.getPartsByAssembly(assembly);
      if (parts.length === 0) return;

      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'parts-category';
      categoryDiv.style.marginBottom = '12px';

      const categoryTitle = document.createElement('div');
      categoryTitle.style.fontSize = '11px';
      categoryTitle.style.fontWeight = '700';
      categoryTitle.style.color = '#ff6b35';
      categoryTitle.style.marginBottom = '6px';
      categoryTitle.style.textTransform = 'uppercase';
      categoryTitle.textContent = assembly;

      categoryDiv.appendChild(categoryTitle);

      const partsDiv = document.createElement('div');
      partsDiv.style.display = 'grid';
      partsDiv.style.gap = '4px';

      parts.forEach(part => {
        const partItem = document.createElement('div');
        partItem.className = 'part-item';
        partItem.textContent = part.name;
        partItem.dataset.partId = part.id;
        partItem.addEventListener('click', () => this.onPartClick?.(part.id));

        partsDiv.appendChild(partItem);
      });

      categoryDiv.appendChild(partsDiv);
      this.partsList.appendChild(categoryDiv);
    });
  }

  displayPartInfo(partId) {
    const part = this.hierarchy.getPart(partId);
    if (!part) {
      this.displayDefaultInfo();
      return;
    }

    this.partName.textContent = part.name;
    this.partType.textContent = part.type;
    this.partWeight.textContent = part.weight;
    this.partMaterial.textContent = part.material;
    this.partAssembly.textContent = part.assembly;

    this.displayRelationships(part.id);
    this.highlightPartInList(part.id);
  }

  displayRelationships(partId) {
    const relationships = this.hierarchy.getPartRelationships(partId);

    if (relationships.length === 0) {
      this.relationshipsList.innerHTML = '<p class="placeholder">No related parts</p>';
      return;
    }

    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';
    list.style.margin = '0';

    relationships.forEach(relName => {
      const item = document.createElement('li');
      item.style.padding = '4px 0';
      item.style.borderBottom = '1px solid #444';
      item.textContent = relName;
      list.appendChild(item);
    });

    this.relationshipsList.innerHTML = '';
    this.relationshipsList.appendChild(list);
  }

  displayDefaultInfo() {
    this.partName.textContent = 'No part selected';
    this.partType.textContent = '—';
    this.partWeight.textContent = '—';
    this.partMaterial.textContent = '—';
    this.partAssembly.textContent = '—';
    this.relationshipsList.innerHTML = '<p class="placeholder">Click a part to view its details</p>';
  }

  setHierarchy(hierarchy) {
    this.hierarchy = hierarchy;
  }

  highlightPartInList(partId) {
    const items = document.querySelectorAll('.part-item');
    items.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.partId === partId) {
        item.classList.add('active');
      }
    });
  }

  clearHighlight() {
    const items = document.querySelectorAll('.part-item');
    items.forEach(item => item.classList.remove('active'));
  }

  setResetCallback(callback) {
    this.resetBtn.addEventListener('click', callback);
  }

  setPartClickCallback(callback) {
    this.onPartClick = callback;
  }

  updateRemovedPartsBar() {
    const removedParts = this.hierarchy.getRemovedParts();
    this.removedPartsIcons.innerHTML = '';

    if (removedParts.length === 0) {
      const emptyItem = document.createElement('div');
      emptyItem.className = 'removed-part-icon empty';
      emptyItem.textContent = 'No removed parts';
      this.removedPartsIcons.appendChild(emptyItem);
      return;
    }

    removedParts.forEach(partId => {
      const part = this.hierarchy.getPart(partId);
      if (!part) return;

      const icon = document.createElement('div');
      icon.className = 'removed-part-icon';
      icon.title = part.name;
      icon.innerHTML = `<span>${part.name}</span>`;
      icon.dataset.partId = partId;
      icon.addEventListener('click', () => this.onPartClick?.(partId));

      this.removedPartsIcons.appendChild(icon);
    });
  }

  addRemovedPart(partId) {
    const removedCount = this.hierarchy.getRemovedParts().length;

    if (removedCount === 1) {
      this.removedPartsIcons.innerHTML = '';
    }

    const part = this.hierarchy.getPart(partId);
    if (!part) return;

    const icon = document.createElement('div');
    icon.className = 'removed-part-icon';
    icon.title = part.name;
    icon.innerHTML = `<span>${part.name}</span>`;
    icon.dataset.partId = partId;
    icon.addEventListener('click', () => this.onPartClick?.(partId));

    this.removedPartsIcons.appendChild(icon);
  }

  removeFromRemovedParts(partId) {
    const icon = this.removedPartsIcons.querySelector(`[data-part-id="${partId}"]`);
    if (icon) {
      icon.remove();
    }

    const removedCount = this.hierarchy.getRemovedParts().length;
    if (removedCount === 0) {
      const emptyItem = document.createElement('div');
      emptyItem.className = 'removed-part-icon empty';
      emptyItem.textContent = 'No removed parts';
      this.removedPartsIcons.appendChild(emptyItem);
    }
  }
}

// Application Initialization
window.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Loading BMW M54 Engine Application...');

    let scene, engineModel, interactionManager, animationController, uiPanel;
    const canvasContainer = document.getElementById('canvas-container');

    async function loadPartsDatabase() {
      const response = await fetch('./data/parts-database.json');
      return await response.json();
    }

    async function init() {
      try {
        console.log('Initializing scene...');
        scene = new Scene(canvasContainer);

        console.log('Loading parts database...');
        const partsDatabase = await loadPartsDatabase();

        console.log('Creating engine model...');
        engineModel = new EngineModel(scene.getScene(), partsDatabase);

        if (window.GLTFLoader && window.ENGINE_GLB) {
          try {
            console.log('Loading GLB model: ' + window.ENGINE_GLB);
            const count = await engineModel.loadGLB(window.ENGINE_GLB);
            console.log('GLB loaded with ' + count + ' meshes');
          } catch (e) {
            console.error('GLB load failed (' + e.message + '), using procedural engine');
            engineModel.generateEngine();
          }
        }

        console.log('Setting up interaction manager...');
        interactionManager = new InteractionManager(
          scene,
          engineModel,
          (partId) => handlePartSelected(partId)
        );

        console.log('Setting up animation controller...');
        animationController = new AnimationController(engineModel);

        console.log('Initializing UI...');
        uiPanel = new UIPanel(engineModel.getHierarchy());
        uiPanel.setResetCallback(() => handleResetAll());
        uiPanel.setPartClickCallback((partId) => handlePartClick(partId));

        setupModelLoader();

        console.log('✓ Application loaded successfully!');

        startRenderLoop();
      } catch (err) {
        console.error('Error during initialization:', err);
        alert('Error: ' + err.message);
      }
    }

    function setupModelLoader() {
      const btn = document.getElementById('load-model-btn');
      const input = document.getElementById('model-file');
      const status = document.getElementById('model-status');
      const title = document.getElementById('model-title');
      if (!btn || !input) return;

      const setStatus = (msg, isError) => {
        if (!status) return;
        status.textContent = msg;
        status.classList.toggle('error', !!isError);
        status.classList.toggle('show', !!msg);
      };

      // Shared: swap in a model from an ArrayBuffer and refresh everything.
      async function applyModel(buffer, name) {
        const count = await engineModel.loadFromBuffer(buffer);
        uiPanel.setHierarchy(engineModel.getHierarchy());
        uiPanel.populatePartsList();
        uiPanel.updateRemovedPartsBar();
        uiPanel.displayDefaultInfo();
        uiPanel.clearHighlight();
        if (title) title.textContent = name.replace(/\.(glb|gltf)$/i, '');
        setStatus('Loaded ' + count + ' parts from ' + name, false);
        return count;
      }

      btn.addEventListener('click', () => input.click());
      input.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!window.GLTFLoader) { setStatus('GLTF loader unavailable', true); return; }
        setStatus('Loading ' + file.name + '…', false);
        try {
          await applyModel(await file.arrayBuffer(), file.name);
        } catch (err) {
          console.error('Model load failed:', err);
          setStatus('Failed to load ' + file.name + ': ' + err.message, true);
        }
        input.value = ''; // allow re-loading the same file
      });

      // Programmatic loader (useful for scripting/testing): window.loadEngineModel(url)
      window.loadEngineModel = async (url) => {
        setStatus('Loading ' + url + '…', false);
        try {
          const res = await fetch(url);
          return await applyModel(await res.arrayBuffer(), url.split('/').pop());
        } catch (err) {
          setStatus('Failed to load ' + url + ': ' + err.message, true);
          throw err;
        }
      };
    }

    function handlePartSelected(partId) {
      const part = engineModel.getHierarchy().getPart(partId);
      if (!part) return;
      uiPanel.displayPartInfo(partId);
    }

    function handlePartClick(partId) {
      const part3D = engineModel.getPart3D(partId);
      if (!part3D) return;

      const hierarchy = engineModel.getHierarchy();

      if (hierarchy.isPartVisible(partId)) {
        hierarchy.removePart(partId);
        uiPanel.addRemovedPart(partId);
        animationController.removePart(part3D, () => {
          part3D.visible = false;
        });
      } else {
        hierarchy.restorePart(partId);
        uiPanel.removeFromRemovedParts(partId);
        animationController.restorePart(part3D, () => {
          part3D.visible = true;
        });
      }
    }

    function handleResetAll() {
      const hierarchy = engineModel.getHierarchy();
      const allParts = Array.from(engineModel.getAllParts3D().values());

      allParts.forEach(part => {
        if (part.userData?.partId && !hierarchy.isPartVisible(part.userData.partId)) {
          animationController.restorePart(part, () => {
            part.visible = true;
            animationController.setOpacityRecursive(part, 1.0);
          });
        }
      });

      hierarchy.resetAll();
      uiPanel.displayDefaultInfo();
      uiPanel.clearHighlight();
      uiPanel.updateRemovedPartsBar();

      setTimeout(() => {
        allParts.forEach(part => {
          part.visible = true;
          animationController.setOpacityRecursive(part, 1.0);
        });
      }, 1500);
    }

    function startRenderLoop() {
      function animate() {
        requestAnimationFrame(animate);
        scene.render();
      }
      animate();
    }

    await init();

  } catch (err) {
    console.error('Failed to load application:', err);
    document.body.innerHTML = '<div style="color:red;padding:20px;">Error: ' + err.message + '</div>';
  }
});
