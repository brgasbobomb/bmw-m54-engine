import { Scene } from './Scene.js';
import { EngineModel } from './EngineModel.js';
import { InteractionManager } from './InteractionManager.js';
import { AnimationController } from './AnimationController.js';
import { UIPanel } from './UIPanel.js';

let scene, engineModel, interactionManager, animationController, uiPanel;
const canvasContainer = document.getElementById('canvas-container');

async function loadPartsDatabase() {
  const response = await fetch('./data/parts-database.json');
  return await response.json();
}

async function init() {
  // Initialize Three.js scene
  scene = new Scene(canvasContainer);

  // Load parts database
  const partsDatabase = await loadPartsDatabase();

  // Create engine model
  engineModel = new EngineModel(scene.getScene(), partsDatabase);

  // Initialize interaction manager
  interactionManager = new InteractionManager(
    scene,
    engineModel,
    (partId) => handlePartSelected(partId)
  );

  // Initialize animation controller
  animationController = new AnimationController(engineModel);

  // Initialize UI panel
  uiPanel = new UIPanel(engineModel.getHierarchy());
  uiPanel.setResetCallback(() => handleResetAll());
  uiPanel.setPartClickCallback((partId) => handlePartClick(partId));

  // Start render loop
  startRenderLoop();
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
    // Remove part
    hierarchy.removePart(partId);
    uiPanel.addRemovedPart(partId);
    animationController.removePart(part3D, () => {
      part3D.visible = false;
    });
  } else {
    // Restore part
    hierarchy.restorePart(partId);
    uiPanel.removeFromRemovedParts(partId);
    animationController.restorePart(part3D, () => {
      part3D.visible = true;
    });
  }
}

function handleResetAll() {
  const hierarchy = engineModel.getHierarchy();
  const allParts = hierarchy.getEngineGroup ?
    engineModel.getEngineGroup().children :
    Array.from(engineModel.getAllParts3D().values());

  allParts.forEach(part => {
    if (part.userData?.partId && !hierarchy.isPartVisible(part.userData.partId)) {
      animationController.restorePart(part, () => {
        part.visible = true;
        if (part.material) {
          part.material.opacity = 1;
        }
      });
    }
  });

  hierarchy.resetAll();
  uiPanel.displayDefaultInfo();
  uiPanel.clearHighlight();
  uiPanel.updateRemovedPartsBar();

  // Ensure all parts are visible
  setTimeout(() => {
    engineModel.getEngineGroup().children.forEach(part => {
      part.visible = true;
      if (part.material) {
        part.material.opacity = 1;
      }
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

// Start the application
init().catch(console.error);
