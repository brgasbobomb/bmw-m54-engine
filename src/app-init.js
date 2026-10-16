// Simple app initializer that loads modules properly in Electron
window.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Loading BMW M54 Engine Application...');

    // Import modules
    const { Scene } = await import('./Scene.js');
    const { EngineModel } = await import('./EngineModel.js');
    const { InteractionManager } = await import('./InteractionManager.js');
    const { AnimationController } = await import('./AnimationController.js');
    const { UIPanel } = await import('./UIPanel.js');

    console.log('Modules loaded successfully');

    let scene, engineModel, interactionManager, animationController, uiPanel;
    const canvasContainer = document.getElementById('canvas-container');

    async function loadPartsDatabase() {
      const response = await fetch('./data/parts-database.json');
      return await response.json();
    }

    async function init() {
      try {
        // Initialize Three.js scene
        console.log('Initializing scene...');
        scene = new Scene(canvasContainer);

        // Load parts database
        console.log('Loading parts database...');
        const partsDatabase = await loadPartsDatabase();

        // Create engine model
        console.log('Creating engine model...');
        engineModel = new EngineModel(scene.getScene(), partsDatabase);

        // Initialize interaction manager
        console.log('Setting up interaction manager...');
        interactionManager = new InteractionManager(
          scene,
          engineModel,
          (partId) => handlePartSelected(partId)
        );

        // Initialize animation controller
        console.log('Setting up animation controller...');
        animationController = new AnimationController(engineModel);

        // Initialize UI panel
        console.log('Initializing UI...');
        uiPanel = new UIPanel(engineModel.getHierarchy());
        uiPanel.setResetCallback(() => handleResetAll());
        uiPanel.setPartClickCallback((partId) => handlePartClick(partId));

        console.log('✓ Application loaded successfully!');

        // Start render loop
        startRenderLoop();
      } catch (err) {
        console.error('Error during initialization:', err);
        alert('Error loading application: ' + err.message);
      }
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
      const allParts = engineModel.getEngineGroup().children;

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
    await init();

  } catch (err) {
    console.error('Failed to load application:', err);
    document.body.innerHTML = '<div style="color:red;padding:20px;">Error: ' + err.message + '</div>';
  }
});
