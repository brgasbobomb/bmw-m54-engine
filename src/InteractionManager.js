import * as THREE from 'three';

export class InteractionManager {
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
    const objects = this.engineModel.getEngineGroup().children.filter(
      child => !(child instanceof THREE.Group) || child.userData.partId
    );
    return this.raycaster.intersectObjects(objects, true);
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
