# Bellhousing notes

No photos used; shape from memory of an E46 manual (Getrag) housing. Dimensions unverified.

## What `src/parts/bellhousing.js` builds (id `bellhousing`, in the slanted group, same origin as flywheel.js)
- Lathe shell, 3 mm wall: r 51 at the block face tapering to r 46 over 44 mm rearward, open both ends (flywheel visible from behind).
- Front flange ring (r 50-58) on the block face, rear gearbox flange ring (r 44-55), 10 bolt heads on each.
- 8 thin ribs along the cone; round starter boss (r 15) on +Z at y -12 / z 43.4 where the starter nose enters.
- Database entry `bellhousing` added; relationships: Flywheel, Starter Motor, Engine Block.

## Checked
- 2026-11-18 (session 1): one intake close-up (`npm run shot -- intake --focus bellhousing --zoom 1`). Reads as a bell behind the block with flanges; flywheel no longer bare.

- Rear and below checked 2026-11-18: round flanged bell, bolt heads evenly spaced, flywheel ring gear and clutch face visible from behind; no clipping with block or oil pan seen. Starter boss still not clearly seen from these angles.

## Still off
- Starter boss not clearly visible in the shot; check the starter nose really enters the shell.
- Ribs look like diagonal stripes, not cast ribs; wall looks too thin/wavy from some angles.
- No inspection cover, clutch slave cylinder bore, bolt-hole pattern or locating dowels; real housing is much wider at the bottom and closed by the gearbox.
- Block lugs/pad vs front ring: no clip seen from rear/below, not checked close-up.
