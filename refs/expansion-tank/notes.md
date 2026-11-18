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

## Rebuilt 2026-11-18 (session 1 of 3)
- Rounded translucent shell (26x44x22), green coolant fill, neck + cap with grip, black level-sensor block, two spigots on the radiator side, mounting ear. Still one group, id `coolant-tank`, upright.
- Checked in full-engine intake shot: sits beside the radiator, no clash seen. Not checked close-up.

## Still off
- Spigots are not tied to hoses.js (no hose attaches); radiator nipple at z 70 may not meet a spigot (spigot x -15, y +-14 vs nipple y 34 world offset).
- No level markings, no bracket to the radiator, dimensions from memory (no photos).
