// Explode view: part id → [x, y, z, distance], in the part files' axes (+X front, Y up,
// +Z intake) but upright, i.e. before the 30° slant, so "up" is up on screen.
// An id registered more than once (valve cover reuses 'cylinder-head') takes a list:
// the nth registered object gets the nth entry, in build order (src/parts/index.js).
// The engine block stays put; ids not listed don't move.
export const EXPLODE = {
  'cylinder-head':      [[0, 1, 0, 55], [0, 1, 0, 120]], // head, valve cover
  'ignition-coils':     [0, 1, 0, 160],
  'spark-plugs':        [0, 1, 0, 140],
  'camshafts':          [0, 1, 0, 85],
  'valves':             [0, 1, 0, 70],
  'vanos-actuators':    [1, 1, 0, 90],
  'timing-chain':       [1, 0, 0, 60],
  'pistons':            [0, 1, 0, 25],
  'connecting-rods':    [0, 1, 0, 10],
  'crankshaft':         [0, -1, 0, 35],
  'oil-pump':           [0, -1, 0, 60],
  'oil-pan':            [0, -1, 0, 95],
  'intake-manifold':    [0, 0.2, 1, 90],
  'throttle-body':      [0.4, 0.2, 1, 120],
  'fuel-injectors':     [0, 0.3, 1, 55],
  'exhaust-manifold':   [0, -0.2, -1, 90],
  'oxygen-sensors':     [0, -0.2, -1, 120],
  'pulleys':            [[1, 0, 0, 110], [1, 0, 0, 90]], // crank damper, idler/tensioner pulleys
  'serpentine-belt':    [[1, 0, 0, 130], [1, 0, 0, 130]],
  'water-pump':         [1, 0, 0, 70],
  'alternator':         [1, 0.3, 1, 90],
  'power-steering-pump': [1, 0, -1, 90],
  'ac-compressor':      [1, -0.3, 1, 90],
  'thermostat':         [[1, 0.5, 0, 70], [1, 0.5, 0, 50]], // thermostat, hoses
  'oil-filter':         [0.3, 0.5, 1, 70],
  'flywheel':           [-1, 0, 0, 70],
  'starter-motor':      [-1, 0, 1, 90],
  'radiator':           [1, 0, 0, 90],
  'coolant-tank':       [1, 0, 1, 90],
};

// Top-level part objects (registered with reg()), in build order. Each gets
// userData.explodeBase (its assembled position) and userData.explodeDir (unit
// direction in its parent's local space, times distance).
export function initExplode(engineGroup) {
  const T = window.THREE;
  const seen = {};
  const parts = [];
  const walk = (o) => o.children.forEach(ch => (ch.userData.partId ? parts.push(ch) : walk(ch)));
  engineGroup.updateWorldMatrix(true, true);
  walk(engineGroup);
  // Table frame = engineGroup with Z flipped (index.js mirrors the root across Z).
  const tableToGroup = new T.Matrix4().makeScale(1, 1, -1).premultiply(engineGroup.matrixWorld);
  parts.forEach(p => {
    const n = seen[p.userData.partId] = (seen[p.userData.partId] ?? -1) + 1;
    let e = EXPLODE[p.userData.partId];
    if (e && Array.isArray(e[0])) e = e[n];
    p.userData.explodeBase = p.position.clone();
    if (!e) { p.userData.explodeDir = new T.Vector3(); return; }
    const toParent = new T.Matrix4().copy(p.parent.matrixWorld).invert().multiply(tableToGroup);
    p.userData.explodeDir = new T.Vector3(e[0], e[1], e[2]).normalize()
      .transformDirection(toParent).multiplyScalar(e[3]);
  });
  return parts;
}

// Position of a part at explode amount t (0..1), in its parent's space.
export function explodedPosition(part, t) {
  return part.userData.explodeBase.clone().addScaledVector(part.userData.explodeDir, t);
}
