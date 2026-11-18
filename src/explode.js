// Explode view: part id → [x, y, z, distance], in the part files' axes (+X front, Y up,
// +Z intake) but upright, i.e. before the 30° slant, so "up" is up on screen.
// An id registered more than once (pulleys, belt) takes a list:
// the nth registered object gets the nth entry, in build order (src/parts/index.js).
// The engine block stays put; ids not listed don't move.
// Global spread factor: raise to push every part further apart at 100%.
const EXPLODE_SCALE = 1;
export const EXPLODE = {
  'cylinder-head':      [0, 1, 0, 180],
  'valve-cover':        [0, 1, 0, 400],
  'ignition-coils':     [0, 1, 0, 560],
  'spark-plugs':        [0, 1, 0, 480],
  'camshafts':          [0, 1, 0, 320],
  'valves':             [0, 1, 0, 250],
  'vanos-actuators':    [1, 1, 0, 300],
  'timing-chain':       [1, 0.3, 0, 200],
  'pistons':            [0, 1, 0, 110],
  'connecting-rods':    [0, 1, 0, 50],
  'crankshaft':         [0, -1, 0, 90],
  'oil-pump':           [0, -1, 0, 170],
  'oil-pan':            [0, -1, 0, 260],
  'intake-manifold':    [0, 0.3, 1, 200],
  'throttle-body':      [0.4, 0.3, 1, 290],
  'maf-sensor':         [0.5, 0.4, 1, 270],
  'airbox':             [0.6, 0.4, 1, 330],
  'fuel-injectors':     [0, 0.5, 1, 120],
  'exhaust-manifold':   [0, -0.2, -1, 200],
  'oxygen-sensors':     [0, -0.2, -1, 300],
  'pulleys':            [[1, 0, 0, 220], [1, 0.3, 0, 280]], // crank damper, idler/tensioner pulleys
  'serpentine-belt':    [[1, 0, 0, 340], [1, 0, 0, 340]],
  'water-pump':         [1, -0.3, 0, 180],
  'alternator':         [1, 0.3, 1, 260],
  'power-steering-pump': [1, 0, -1, 260],
  'ac-compressor':      [1, -0.3, 1, 260],
  'thermostat':         [[1, 0.6, 0, 160], [1, 0.8, 0, 120]], // thermostat, hoses
  'oil-filter':         [0.3, 0.2, 1, 200],
  'flywheel':           [-1, 0, 0, 160],
  'starter-motor':      [-1, 0, 1, 230],
  'radiator':           [1, 0, 0, 480],
  'coolant-tank':       [1, 0.3, 1, 400],
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
      .transformDirection(toParent).multiplyScalar(e[3] * EXPLODE_SCALE);
  });
  return parts;
}

// Position of a part at explode amount t (0..1), in its parent's space.
export function explodedPosition(part, t) {
  return part.userData.explodeBase.clone().addScaledVector(part.userData.explodeDir, t);
}
