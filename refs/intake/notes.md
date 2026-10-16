# Intake (src/parts/intake.js) — reference notes

Photos in this folder:
- `air intake hose.jpeg` (not viewed yet; presumably the inlet boot. Look at it before refining the boot/throttle end.)

Catalog photos used (section "Intake manifold and DISA" in `refs/catalog/photo-set.md`):
- `refs/catalog/images/image_31.jpg`, `image_32.jpg`: loose M54B30 manifold with DISA, fuel rail and injectors, two views. `image_33.jpg` was not opened.

## What the photos show (seen once, don't re-open)
- Black moulded plastic, two welded shells: a long, low, boxy plenum (wider front-to-back than tall, rounded edges, not a round tube) with a thin weld-seam flange strip running around its middle.
- Six short runner horns from the head flange up into the plenum. They are not smooth tubes: each carries a raised rib frame, a "comb". One U-shaped rim per runner (round end toward the head, open end at the plenum), tied together by a spine rib along the plenum wall that faces the head. The injector sits in the U.
- Head flange: a thin plate along all six runners with a row of bolts.
- Fuel rail: slim bar just above the flange, injectors standing down into the runners, small clips holding the rail to the manifold.
- DISA: a round bore/boss on top of the plenum around mid-length, with hoses/stubs. The inlet (throttle) side is at one end of the plenum.

## Uncertain (seen, not confirmed)
- That the mid-plenum round bore is the DISA (likely), and exactly where along X it sits (modelled at the runner centre, x ≈ +4).
- Which end the throttle body is on (kept at the +X front end like the old model) and which way the boot leaves it.
- Exact horn slope and rim-frame height (modelled by eye).

## Still missing (catalog list)
- Square-on outer-wall elevation at manifold height, removed DISA cartridge, verified factory barcode/sticker location, direct top plan, lower support-bolt close-up.

## As modelled (units ≈ 0.45 per real mm, +Z = intake side, all relative to the head intake face z = BW/2)
- Plenum: rounded box 231 (x) × 26 (y) × 28 (z), centre z = face + 38, y = headY + 11. Outer reach is z = face + 52, top y = headY + 24. The old 40-unit-diameter cylinder reached y = headY + 32 and the same z, so the gain is height and volume (about 40 % less plenum), not reach. Seam strip 234 × 1.6 × 33 at mid-height.
- Head flange plate 245 × 24 × 4 on the face; 7 hex bolts (r 3) at y = headY + 3, one in each gap between runners and one past each end.
- Horns 22 × 13, ~29 long, rising ~13° from the flange to the plenum wall. Rim bars 1.8 square, ±8.4 from the centre line, joined by a half-ring torus at the head end. Spine 227 × 3 × 4.5 on the plenum wall.
- DISA pot r 7 on top of the plenum with a flange, an alloy cap and a short stub toward −X. No hoses.
- Throttle body: alloy r 12 × 18 at the +X end of the plenum, axis along X, flange on the plenum side, actuator box on the +Z face. Inlet boot r 11, ribbed, rises 15 over its length, clamps at both ends, dark cap on the open end.
- Fuel rail 4.5 square at y = headY + 18, z = face + 5; injectors r 2.3→1.8 × 14 standing in each U, connector block on the outer side.
- Not modelled yet: DISA hoses, rail clips, lower support bolts/bracket, the airbox end of the boot.
