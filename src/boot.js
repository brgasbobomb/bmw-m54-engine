// ES-module boot: expose THREE + GLTFLoader as globals BEFORE DOMContentLoaded,
// so the classic app.js (which uses window.THREE) can load a real .glb model.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

window.THREE = THREE;
window.GLTFLoader = GLTFLoader;
window.RoomEnvironment = RoomEnvironment;

// Startup model. null => boot to the built-in procedural M54 (no external asset).
// To auto-load a model on startup instead, set this to a path, e.g.
//   window.ENGINE_GLB = './models/your-m54.glb';
// You can also load any .glb at runtime with the "Load .glb…" button in the UI.
window.ENGINE_GLB = null;

console.log('boot: THREE r' + THREE.REVISION + ' + GLTFLoader ready');
