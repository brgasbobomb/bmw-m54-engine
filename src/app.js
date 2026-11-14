import { buildProceduralEngine } from './parts/index.js';
import { initExplode, explodedPosition } from './explode.js';

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
    this.setupAO();
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

  // Ground-truth AO so gaps between parts darken. #ao-toggle disables only the AO pass, so the look stays the same otherwise.
  setupAO() {
    const T = window.THREE, w = this.container.clientWidth, h = this.container.clientHeight;
    if (!window.GTAOPass) return;
    const pr = this.renderer.getPixelRatio();
    // multisampled target keeps edges antialiased through the composer
    const rt = new T.WebGLRenderTarget(w * pr, h * pr, { type: T.HalfFloatType, samples: 4 });
    this.composer = new window.EffectComposer(this.renderer, rt);
    this.composer.addPass(new window.RenderPass(this.scene, this.camera));
    const ao = new window.GTAOPass(this.scene, this.camera, w, h);
    ao.updateGtaoMaterial({ radius: 14, distanceFallOff: 1, thickness: 8, scale: 1, samples: 16 });
    ao.blendIntensity = 0.9;
    this.composer.addPass(this.ao = ao);
    this.composer.addPass(new window.OutputPass());
  }

  initScene() {
    // Light studio background (matches product-render references)
    // CSS, not scene.background: through the composer the background and the ground shadow would get
    // tone-mapped (greyed, shadow washed out). Transparent canvas keeps both exact.
    this.container.style.background = '#eef1f5';
    // no fog — engine spans a wide area and must stay crisp
  }

  initCamera() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new window.THREE.PerspectiveCamera(48, width / height, 0.1, 5000);
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
    key.shadow.mapSize.width = 1024; // lower res = wider PCF penumbra = softer shadow
    key.shadow.mapSize.height = 1024;
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
    this.controls = new window.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(-10, 12, 8); // same point initCamera looks at
    this.controls.mouseButtons.MIDDLE = window.THREE.MOUSE.PAN; // sidebar hint says "Middle mouse to pan"
    this.controls.enableDamping = true;
    this.controls.minDistance = 50;
    this.controls.maxDistance = 2500;

    document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    document.addEventListener('mousedown', (e) => this.onMouseDown(e));
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

  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.composer?.setSize(width, height);
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
    this.controls.update(); // damping needs a per-frame update
    if (this.composer) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
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
    buildProceduralEngine(this);

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
    document.addEventListener('pointerdown', (e) => { this.downX = e.clientX; this.downY = e.clientY; });
    document.addEventListener('click', (e) => this.onClick(e));
    document.addEventListener('pointerup', (e) => this.onRightClick(e));
  }

  // Still right-click on a part: remove everything else (right-drag still pans).
  onRightClick(event) {
    if (event.button !== 2 || event.target.tagName !== 'CANVAS') return;
    if (Math.hypot(event.clientX - this.downX, event.clientY - this.downY) > 5) return;
    for (const hit of this.getIntersects()) {
      let o = hit.object;
      while (o && !o.userData.partId) o = o.parent;
      if (o?.visible) { this.onPartIsolate?.(o.userData.partId); return; }  // hidden parts still raycast
    }
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
    // a camera drag also ends in a click; only a still click selects a part
    if (Math.hypot(event.clientX - this.downX, event.clientY - this.downY) > 5) return;

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
    this.explodeAmount = 0; // restored parts return to their exploded spot
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
          pos: partObject.userData.explodeBase
            ? explodedPosition(partObject, this.explodeAmount) : stored.position,
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
    this.partNumber = document.getElementById('part-number');
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
    this.partNumber.textContent = part.partNumber || 'unverified';

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
    this.partNumber.textContent = '—';
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
    let explodeParts = [], explodeCur = 0, camK = 0; // camK: explode amount the camera distance already accounts for (null = Reset All, skip until back at 0)
    const explodeSlider = document.getElementById('explode-slider');
    const canvasContainer = document.getElementById('canvas-container');

    document.getElementById('ao-toggle').addEventListener('change', e => { if (scene.ao) scene.ao.enabled = e.target.checked; });

    // Aim the camera at the engine from the front-left corner, slightly above.
    // Front = +X, car's left = intake = -Z on screen (engine is mirrored across Z once).
    function frameView() {
      const group = engineModel.getEngineGroup();
      group.updateMatrixWorld(true);
      const T = window.THREE;
      const box = new T.Box3();
      explodeParts.forEach(p => box.expandByObject(p));
      const sphere = box.getBoundingSphere(new T.Sphere());
      const cam = scene.getCamera();
      const halfFov = Math.min(cam.fov, 2 * Math.atan(Math.tan(cam.fov * Math.PI / 360) * cam.aspect) * 180 / Math.PI) * Math.PI / 360;
      const dist = sphere.radius / Math.sin(halfFov) * 1.05;
      const dir = new T.Vector3(1, 0.45, -1).normalize();
      const place = d => {
        cam.position.copy(sphere.center).addScaledVector(dir, d);
        cam.lookAt(sphere.center);
        cam.updateMatrixWorld(true);
      };
      place(dist);
      // the sphere is loose for an elongated engine: rescale so the box corners just touch the frame
      let ext = 0;
      for (let i = 0; i < 8; i++) {
        const c = new T.Vector3(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z);
        c.project(cam);
        ext = Math.max(ext, Math.abs(c.x), Math.abs(c.y));
      }
      place(dist * ext * 1.05);
      scene.controls.target.copy(sphere.center);
      scene.controls.update();
    }

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
        interactionManager.onPartIsolate = (partId) => handlePartIsolate(partId);

        console.log('Setting up animation controller...');
        animationController = new AnimationController(engineModel);

        console.log('Initializing UI...');
        uiPanel = new UIPanel(engineModel.getHierarchy());
        uiPanel.setResetCallback(() => handleResetAll());
        uiPanel.setPartClickCallback((partId) => handlePartClick(partId));

        explodeParts = initExplode(engineModel.getEngineGroup());
        explodeSlider.addEventListener('input', () => {
          animationController.explodeAmount = Number(explodeSlider.value);
        });

        setupModelLoader();

        console.log('✓ Application loaded successfully!');

        frameView();

        startRenderLoop();
        window.__shot = { scene, frameView, isolate: handlePartIsolate }; // used by scripts/shot.mjs
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
        explodeParts = initExplode(engineModel.getEngineGroup());
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
      if (!engineModel.getPart3D(partId)) return;
      // every object registered under this id (the valve cover shares 'cylinder-head')
      const objects = explodeParts.filter(p => p.userData.partId === partId);

      const hierarchy = engineModel.getHierarchy();

      if (hierarchy.isPartVisible(partId)) {
        hierarchy.removePart(partId);
        uiPanel.addRemovedPart(partId);
        objects.forEach(o => animationController.removePart(o, () => { o.visible = false; }));
      } else {
        hierarchy.restorePart(partId);
        uiPanel.removeFromRemovedParts(partId);
        objects.forEach(o => animationController.restorePart(o, () => { o.visible = true; }));
      }
    }

    function handlePartIsolate(partId) {
      const hierarchy = engineModel.getHierarchy();
      for (const id of engineModel.getAllParts3D().keys()) {
        if (id !== partId && hierarchy.isPartVisible(id)) handlePartClick(id);
      }
    }

    function handleResetAll() {
      explodeSlider.value = 0;
      animationController.explodeAmount = 0;
      const hierarchy = engineModel.getHierarchy();
      const allParts = explodeParts;

      allParts.forEach(part => {
        if (part.userData?.partId && !hierarchy.isPartVisible(part.userData.partId)) {
          animationController.restorePart(part, () => {
            part.visible = true;
            animationController.setOpacityRecursive(part, 1.0);
          });
        }
      });

      hierarchy.resetAll();
      frameView();
      camK = null;
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

    // Eases toward the slider value; parts that are removed or mid-animation are left alone.
    function updateExplode() {
      const target = animationController.explodeAmount;
      if (explodeCur === target) return;
      explodeCur = Math.abs(target - explodeCur) < 0.002 ? target : explodeCur + (target - explodeCur) * 0.15;
      // ease the camera out along its view ray so the exploded engine stays in frame
      if (camK !== null) {
        const cam = scene.getCamera(), tgt = scene.controls.target, k = 1.6;
        cam.position.sub(tgt).multiplyScalar((1 + k * explodeCur) / (1 + k * camK)).add(tgt);
        camK = explodeCur;
      } else if (explodeCur === 0) camK = 0;
      explodeParts.forEach(p => {
        if (p.visible && !animationController.isAnimating(p)) p.position.copy(explodedPosition(p, explodeCur));
      });
    }

    // Run engine: crank angle advances at the slider rpm (log scale, 10 rpm slow-motion .. 750 rpm idle).
    // Parts animate only children of their registered groups, so explode/removal keep working.
    // Angle decreases so the pistons reach TDC in firing order 1-5-3-6-2-4 with the crankshaft.js pin angles.
    const runToggle = document.getElementById('run-toggle'), rpmSlider = document.getElementById('rpm-slider');
    const rpmValue = document.getElementById('rpm-value');
    const rpm = () => Math.round(10 * Math.pow(75, Number(rpmSlider.value)));
    const showRpm = () => { rpmValue.textContent = rpm() + ' rpm'; };
    rpmSlider.addEventListener('input', showRpm); showRpm();
    let crankAngle = 0, lastT = performance.now();
    function updateRun() {
      const now = performance.now(), dt = Math.min(0.1, (now - lastT) / 1000);
      lastT = now;
      if (!runToggle.checked || !engineModel.motion) return;
      crankAngle = (crankAngle - dt * rpm() / 60 * 2 * Math.PI) % (4 * Math.PI); // 4π: cams turn once per two crank turns
      engineModel.motion.forEach(f => f(crankAngle));
    }

    function startRenderLoop() {
      function animate() {
        requestAnimationFrame(animate);
        updateExplode();
        updateRun();
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


export { EngineModel };