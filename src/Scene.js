export class Scene {
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
    this.setupControls();
  }

  initScene() {
    this.scene.background = new window.THREE.Color(0x1a1a1a);
    this.scene.fog = new window.THREE.Fog(0x1a1a1a, 300, 500);
  }

  initCamera() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new window.THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(150, 120, 150);
    this.camera.lookAt(0, 0, 0);
  }

  initRenderer() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.renderer = new window.THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = window.THREE.PCFShadowShadowMap;

    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => this.onWindowResize());
  }

  initLighting() {
    const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new window.THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(200, 150, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -300;
    directionalLight.shadow.camera.right = 300;
    directionalLight.shadow.camera.top = 300;
    directionalLight.shadow.camera.bottom = -300;
    this.scene.add(directionalLight);

    const pointLight = new window.THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(-150, 100, -100);
    this.scene.add(pointLight);
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

  updatePickedObject() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
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
