# Oil pump notes

No photos used. Facts below are from memory and **unverified**.

## What `src/parts/oil-pump.js` builds now (id `oil-pump`)
- Rounded-box alu body (16×20×32) at x = LEN/2−7, y = blockY−44, two mounting ears at z = ±17.
- +X face: rotor housing disc r 12.5, rotor pocket, outer rotor r 5.6, inner rotor r 3.4 (gerotor look), shaft r 1.8.
- Relief-valve cylinder r 3.6 along Z on the intake (+Z) side, z = 22.
- 9-tooth sprocket (pitch 5.45) at x = LEN/2+3 (same plane as the crank's second row), nut, and a chain loop to a 14-tooth crank sprocket at y = blockY−6.
- Pickup: flanged tube dropping from the body underside, running back along −X ~66 units, ending in a flat strainer cup (r 11, squashed in Z) in the sump. Support bracket midway.
- Everything is `detail()` inside one group; no separate sub-parts.

## Real M54 facts to follow (unverified)
- Chain-driven gerotor pump on the front of the engine, driven by a single-row chain from the crankshaft, sitting at the front of the sump area (not in the block front cover).
- Pump is bolted into the upper oil pan / front of the block, with the pickup running down into the sump toward the rear (E46 sump is deep at the front for the front axle clearance).
- Pressure relief valve is integral with the pump body, not a long separate cylinder.
- Pickup pipe has a screen/strainer cup; connection to the pump by bolted flange with O-ring.
- Oil pump chain has a spring/hydraulic tensioner; the model has none.

## Still off
- No chain tensioner or guide on the pump chain.
- Relief valve is a plain cylinder poking out the side, probably too big and too far out; real one sits inside the casting.
- No pump cover plate, bolts, or visible fasteners.
- Pump position/size vs. oil-pan.js sump not checked against references.
- Sprocket tooth counts (9 / 14) and chain pitch are guesses.
