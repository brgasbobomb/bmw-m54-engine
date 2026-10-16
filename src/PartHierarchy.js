export class PartHierarchy {
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
      if (this.assemblies[assembly]) {
        this.assemblies[assembly].push(part);
      }
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
