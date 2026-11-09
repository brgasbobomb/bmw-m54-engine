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

## Still off
- Necks are now elbowed and opposed (see refs/hoses/notes.md) but unchecked visually.
- Bolt count/positions guessed (photo shows 3 only partly).
- Not checked against the real mounting position on the head face.
