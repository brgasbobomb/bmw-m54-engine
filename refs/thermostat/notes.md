# Thermostat housing

Source: refs/catalog/images/image_20.jpg (OEM 11531436823 / 11531437040, "Front drive" in photo-set.md).

## What the photo shows
- Cast-aluminium body: flat flange with open thermostat bay on top, thermostat (brass pin, coil spring, cap disc) held by two cast arms.
- Two large side necks (one each side), 2 ribs near the hose end. Neck axes are roughly parallel, slightly angled down.
- Black 2-pin temperature sensor connector hanging from the front-lower side of the left neck.
- Flange has ~3 bolt ears around the bay.

## Model
- Origin = (LEN/2+2, headY, -8). Necks are generated from the hose start points in `hoses.js` (upper: LEN/2+14, headY-14, -14; lower: LEN/2-2, blockY+28, -8), so changing those moves the necks. Neck r=6.2 vs hose tube r=6.5.
- Sensor, 3 hex bolts, thermostat internals are simple primitives.

## Checked (front view, radiator removed)
- Housing sits on the front face at the head/block joint; brass thermostat disc faces forward; upper neck leaves upward, lower neck downward with the sensor boss/connector below it. Elbowed, opposed necks read correctly and the hoses meet them. No geometry changed.
- Viewing tip: the parts list REMOVES a part on click (restore via the "Removed parts" chip). The scene is not exposed on `window`; orbit with drag/scroll.

## Still off
- Bolt count/positions guessed (photo shows ~3 only partly); not verified against the real head-face bolt pattern.
- Exact side/height of the housing on the head face not compared with a real E46 photo (only checked that it looks plausible).
