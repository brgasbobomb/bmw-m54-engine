# Double VANOS (src/parts/vanos.js) — reference notes

Photos in this folder:
- `vanos.jpeg` — viewed: Pelican Parts close-up of the VANOS oil feed fitting
- `vanos2.jpeg` — viewed: engine bay from above, valve cover off, cam hubs visible
- `vanos3.jpeg` … `vanos6.jpeg` — NOT viewed yet (only 2 photos opened, per CLAUDE.md rule 3)

## What the photos show

`vanos.jpeg` (intake side, next to the oil filter housing):
- Dull grey, grimy cast aluminium (not polished).
- A cylindrical arm enters the engine at the upper left and ends in a boxy head. The head's face carries
  3 Torx screws in a triangle (one on top, two below). A stamped steel L-bracket with a curved flange sits on its right.
- A vertical neck under the head ends in a chrome union nut. Below that, a clamped black rubber hose boot, plus a
  thin black pipe leading sideways towards the oil filter.
- A black rectangular connector plug sits just left of the neck.

`vanos2.jpeg` (front of the head, front of the car at the bottom of the shot):
- Two large round hubs at the front of the head, one per camshaft (exhaust on the left, intake on the right).
  They are gold/bronze (oil-baked), like the camshafts. Each is a toothed sprocket plate with the timing chain
  around both, a raised central cylindrical boss and a centre bolt. The chain tensioner/guide is on the left.
- Intake manifold on the right, oil filter housing at the lower right.

## What the model does now

Group origin is (LEN/2 - 4, headY + 4, 0). Local +X = front, +Z = intake.
- Housing: rounded cast block 24 x 24 x 66, two hub barrels (r 14.5) at z = ±18 / y = +4, a bridge between them.
- Hubs on the barrel fronts: bright flange ring r 11.5, gold hub r 8.5, hex centre bolt, ring of 6 hex bolts.
- Solenoids below the hubs (y = -9): black can r 5.6, dark flange, black plug box pointing outboard.
- Oil feed fitting on +Z: arm, boxy head with 3 bolts on its +X face, neck, steel union nut, black hose down.
- Materials: `matBlock` casting, `matAlu` machined flanges, `matGold` hubs, `matCoil` solenoids, `matHose` hose.

## Still missing

- The steel bracket around the fitting head and the thin black oil pipe from the fitting to the oil filter housing.
- Sprocket plates and chain belong to `timing-chain.js`, not here.
- Check `vanos3`–`vanos6` for the real unit's solenoid positions and top face, then correct the layout above.

## Still off
- Steel L-bracket on the fitting head and the thin black oil pipe to the filter housing: missing (see also oil-filter.js VANOS line; check the two meet).
- Black rectangular connector plug beside the fitting neck: missing. Fitting screws are hex, photo shows Torx (3 in a triangle: layout matches).
- Hose boot has no clamp; the hose is a short stub that stops in mid-air.
- Solenoid positions, top face and overall housing shape are unverified: `vanos3`–`vanos6` were never opened.
- Housing is a generic rounded box; real unit is grimy dull cast aluminium with more casting detail.
- Hubs are flat gold discs; toothed plates and chain are in timing-chain.js, so check they line up with the hub centres.
