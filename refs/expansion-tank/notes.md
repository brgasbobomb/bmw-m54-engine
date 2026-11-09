# Expansion tank notes

No photos used. Facts below are from memory and **unverified**. Layout comment in code points to `refs/engine-bay/notes.md` for the placement.

## What `src/parts/expansion-tank.js` builds now (id `coolant-tank`, upright: `reg(..., false)`)
- A single translucent cream `BoxGeometry(26, 44, 22)`, 80% opacity.
- Position x = LEN/2 + 98, y = radY + 34, z = 69 + 12 = 81 (intake-side end of the radiator, 1 unit clear; radiator frame is x 239…251, y radY ±56, z ±69).
- No cap, hoses, neck, level sensor, or brackets.

## Real E46 / M54 facts to follow (unverified)
- Plastic tank, white/translucent with level markings, mounted beside the radiator on the left (intake side) in front of the engine.
- Screw-on pressure cap on the top (about 1.4 bar), often with a thin neck on the upper side.
- Hoses: top-of-radiator bleed/vent line and lower coolant feed to the system; E46 M54 uses a small level sensor in the tank.
- Roughly a rounded rectangular tank of ~1.5 L total; cap sits at the highest point of the cooling system.

## Still off
- Plain box, no cap, neck, mount, hose spigots or level sensor.
- Dimensions and exact position not checked against reference photos.
- Not connected to hoses.js (check which hoses attach).
