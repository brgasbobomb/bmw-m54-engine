export class UIPanel {
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
    this.partName.textContent = 'Engine Block';
    this.partType.textContent = 'Main Assembly';
    this.partWeight.textContent = '130 kg';
    this.partMaterial.textContent = 'Aluminum Alloy';
    this.partAssembly.textContent = 'Block';
    this.relationshipsList.innerHTML = '<p class="placeholder">Select a part to view relationships</p>';
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
