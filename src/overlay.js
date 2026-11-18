// Debug: photo backdrop + opacity slider + camera preset, for comparing the model to a reference photo.
export function initOverlay(container, scene) {
  const img = Object.assign(document.createElement('img'), { src: 'refs/intake/user-engine-stand-photo.webp' });
  Object.assign(img.style, { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain',
    opacity: 0.5, pointerEvents: 'none', display: 'none', zIndex: 5 });
  container.appendChild(img);

  const bar = document.createElement('div');
  Object.assign(bar.style, { position: 'absolute', left: '8px', bottom: '8px', zIndex: 6, font: '12px sans-serif',
    color: '#fff', background: 'rgba(0,0,0,.6)', padding: '4px 8px', borderRadius: '4px', display: 'flex', gap: '8px', alignItems: 'center' });
  bar.innerHTML = '<label><input type="checkbox" id="ov-on"> Overlay</label>' +
    '<input type="range" id="ov-op" min="0" max="1" step="0.05" value="0.5" style="display:none">' +
    '<button id="ov-cam" style="display:none">Photo angle</button>';
  container.appendChild(bar);
  const $ = id => bar.querySelector(id);

  $('#ov-on').onchange = e => {
    img.style.display = e.target.checked ? 'block' : 'none';
    $('#ov-op').style.display = $('#ov-cam').style.display = e.target.checked ? '' : 'none';
  };
  $('#ov-op').oninput = e => { img.style.opacity = e.target.value; };
  // Photo: intake side from above, front (pulley) at left, rear receding. Camera is the car's left, ahead of mid-length.
  $('#ov-cam').onclick = () => {
    const cam = scene.getCamera(), c = scene.controls, d = cam.position.distanceTo(c.target);
    cam.position.copy(c.target).addScaledVector(new window.THREE.Vector3(1, 1.15, -0.9).normalize(), d * 0.65);
    cam.lookAt(c.target);
    c.update();
  };
}
