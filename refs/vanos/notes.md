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

## Done (fix session)
- Fitting head: 3 Torx-style screws (round head, two crossed hex sockets), steel L-bracket (plate on +Z end + flange over top, centre bolt), black connector plug on -Z side of neck, hose clamp band + screw housing.
- Housing casting detail: 3 ribs on the bridge, rear rims on both barrels, parting-line slab on the lower body, two bolt lugs. Fitting position unchanged (x=4, y=-9, z=44.5).

## Still off
- Not visually verified: preview showed a blank canvas in the narrow pane; check the bracket/plug placement against `vanos.jpeg` by eye (bracket side and plug side are guesses).
- Thin black oil pipe from the hose to the oil filter housing still missing; hose is still a short stub (oil-filter.js owns the VANOS line end; check the two meet).
- Solenoid positions, top face and overall housing shape unverified: `vanos3`-`vanos6` never opened.
- Hubs are flat gold discs; toothed plates and chain live in timing-chain.js, check they line up with the hub centres.
- Bracket flange is a flat plate, not the curved flange in the photo.
- Visual check 2026-11-14 (isolated, intake view, swiftshader; shows only that part, so cross-part clashes can't be seen):
  - Tiny at full-engine zoom; sits at the front end, plausible side. Housing reads as a grey block with gold hubs and a small stub at the bottom; the stub dangles in free air (oil feed from the filter housing is separate). Could not judge clashes with the head/timing cover in isolation.
