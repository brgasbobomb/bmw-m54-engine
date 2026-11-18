// Procedural M54B30 builder. Each part lives in its own file and gets a shared context `c`
// (THREE as T, materials, helpers, layout). Build order matters only for parts that
// return values used by later parts (see each file's `return`).
import { makeMaterials } from './materials.js';
import { makeHelpers } from './helpers.js';
import { makeLayout } from './layout.js';
import { build as block } from './block.js';
import { build as head } from './head.js';
import { build as valveCover } from './valve-cover.js';
import { build as ignitionCoils } from './ignition-coils.js';
import { build as sparkPlugs } from './spark-plugs.js';
import { build as vanos } from './vanos.js';
import { build as camshafts } from './camshafts.js';
import { build as valves } from './valves.js';
import { build as timingChain } from './timing-chain.js';
import { build as crankshaft } from './crankshaft.js';
import { build as pistonsRods } from './pistons-rods.js';
import { build as oilPump } from './oil-pump.js';
import { build as intake } from './intake.js';
import { build as airbox } from './airbox.js';
import { build as exhaust } from './exhaust.js';
import { build as oilPan } from './oil-pan.js';
import { build as frontDrive } from './front-drive.js';
import { build as thermostat } from './thermostat.js';
import { build as oilFilter } from './oil-filter.js';
import { build as starter } from './starter.js';
import { build as flywheel } from './flywheel.js';
import { build as bellhousing } from './bellhousing.js';
import { build as radiator } from './radiator.js';
import { build as hoses } from './hoses.js';
import { build as expansionTank } from './expansion-tank.js';
import { build as ccv } from './ccv.js';

const PARTS = [
  block,
  head,
  valveCover,
  ignitionCoils,
  sparkPlugs,
  vanos,
  camshafts,
  valves,
  timingChain,
  crankshaft,
  pistonsRods,
  oilPump,
  intake,
  airbox,
  exhaust,
  oilPan,
  frontDrive,
  thermostat,
  oilFilter,
  starter,
  flywheel,
  bellhousing,
  radiator,
  hoses,
  expansionTank,
  ccv
];

export function buildProceduralEngine(model) {
  const T = window.THREE;
  const c = { T, ...makeMaterials(T), motion: model.motion = [] }; // motion: fns(crankAngle) for "Run engine"

  // Root group, mirrored across Z. Part files are written with +Z = intake, which in this
  // right-handed scene would put the intake on the car's right. The real M54 has the intake on
  // the left (driver side) and exhaust on the right, so the whole engine is flipped once here.
  // Don't flip individual parts.
  const rootGrp = new T.Group();
  rootGrp.scale.z = -1;
  model.engineGroup.add(rootGrp);
  c.rootGrp = rootGrp;

  // Slanted engine group (rotated 30 degrees toward the exhaust side)
  const slantedGrp = new T.Group();
  slantedGrp.rotation.x = -30 * Math.PI / 180;
  rootGrp.add(slantedGrp);
  c.slantedGrp = slantedGrp;

  Object.assign(c, makeHelpers(c, model), makeLayout());
  for (const build of PARTS) Object.assign(c, build(c) || {});
}
