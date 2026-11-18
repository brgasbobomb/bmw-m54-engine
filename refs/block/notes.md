# Engine block (`src/parts/block.js`)

Photos opened (2): `refs/catalog/images/image_1.webp` (whole engine, front 3/4 from above) and
`image_46.jpg` (E46 engine-mount arm, loose, bimmerworld).

## What the photos show
- image_1: the block is almost fully hidden (valve cover, intake, belt drive). Visible: ribbed light-alloy
  lower block behind the starter / A/C bracket, oil-filter housing + cap on the intake side, starter low at the
  rear intake side. Nothing about the exhaust side, skirt or sensors.
- image_46: mount arm is a tapered cast arm: wide hollow box base with 4 bolt ears on the block face, narrowing
  upward/outward to one round bolt-through boss at the top, with a central web inside the box.

## What was built (all inferred from the above + general M54 knowledge, NOT from photos)
- Outer envelope unchanged (LEN x BH x BW) so head, front cover/drive and rear flange still meet it.
- Skirt: box below crank line (y = blockY-6), LEN x 30 x BW+1, flush with front/rear faces; pan flange (BW+2) sits under it.
- Crank-line parting ledge + 7 main-bearing-cap ribs per side (x = cx(0)-span/2 + k*span).
- Mount arms: one per side at x=24, block mid-height (extruded tapered profile, 4 ears, steel boss).
- Bosses: oil-filter pad (matches oil-filter.js position) and starter pad with 2 studs (matches starter.js).
- Sensors: 2 knock sensors (+Z, between cyl 2/3 and 5/6 caps), oil-pressure switch under filter pad,
  crank-pulse sensor near rear on -Z. Placement is a guess; no photo confirms it.

## Session 2 (skirt / flange / sensors)
- No bare-block photo exists in `refs/block/` (notes only) or `refs/catalog/photo-set.md` ("Still missing: bare-block skirt",
  "crank-speed sensor + starter in one frame"). No photos opened; sensor positions therefore remain guesses and are unchanged:
  knock x = cx(0)-span/2 + {2,5}*span, y = blockY+1, z = +BW/2+3 (intake side); oil-pressure switch x = LEN/2-58, y = blockY-10, z = +BW/2+5;
  crank-pulse sensor x = -LEN/2+12, y = blockY-14, z = -BW/2-4.
- Skirt is now a flared trapezoid (half-width BW/2+0.5 at crank line y=blockY-6 -> BW/2+4 at y=blockY-36), extruded along X.
- Bearing-cap ladder: 7 cap plates (roundedBox 9 x 6 x 2*fw+1) on the skirt bottom, 2 bolts per cap per side, angled ribs following the flare.
- Rear bellhousing flange: two bolt lugs per side (z = +-(BW/2+7)) at x=-LEN/2, 2 bolts each, plus a lower pad; centre left open for the flywheel.
- Visual check: page loaded with no console errors, but the preview canvas rendered blank in the headless pane, so the new geometry is NOT visually verified.

## Still off
- Sensor positions unverified (need a bare-block photo, intake and exhaust side).
- Mount-arm x position / height unverified (no installed photo; catalog says brackets installed on a B30 are missing).
- Skirt flare angle / depth and cap spacing are estimates (no bare-block skirt photo); new geometry not visually checked (blank preview).
- Bellhousing flange is lugs + lower pad only, not a full bolt ring; hole pattern invented.
- Lifting eyes (front/rear) not modelled; no photo.
- Old per-cylinder side ribs kept as-is.
- Visual check 2026-11-14 (isolated, intake view, swiftshader; shows only that part, so cross-part clashes can't be seen):
  - Renders, no floating bits or obvious wrong size. Round disc and black rectangle on the upper face and a grey plate at the rear end are unidentified; check what they are (deck features vs leftovers). Skirt ends in black dowel-like stubs, check they are the cap bosses.

## Proportions (session 2026-11-18, layout.js)
Scale: bore spacing 91 mm = span = (LEN-36)/6 = 40.67 units -> **0.4469 units/mm** (1 unit = 2.238 mm).
Crank centreline at y = blockY-6 (unchanged).

| Value | mm | units | Source |
|---|---|---|---|
| Bore spacing | 91 | 40.67 | BMW spec sheet (web) |
| Deck height, crank CL -> deck | 211 | 94.3 | BMW spec sheet (web) |
| Stroke | 89.6 | 40.0 (throw 20.0) | BMW spec sheet (web) |
| Rod length (c-c) | 135 | 60.3 | BMW spec sheet (web) |
| Piston compression height (derived 211-44.8-135) | 31.2 | 14.0 | derived, not looked up |
| Head height | 140 | 62.6 -> HEAD_H 63 | **unconfirmed** (engine-spec sites) |
| Block width BW | – | 78 (unchanged) | **not measured**, left as-is |
| Cover height COVER_H | – | 20 (unchanged) | **not measured**, left as-is |

layout.js now: deckY = blockY-6+94.3 = blockY+88.3; block box bottom kept at blockY-36 (`blockBot`), so BH = 124.3
and the box centre is blockY+26.2 (block.js / oil-pan.js position from `blockBot`). headY = deckY + HEAD_H/2.
Before: deck was at crank+42 (blockY+36) and HEAD_H 34, i.e. block about 45 % and head about 54 % of real height.

### Fit check after the proportion change (computed, plus one intake-side shot)
- Inside the block, nothing pokes through: crank webs reach y≈-28, pins -26 (skirt bottom -36); pistons r 17.15 in bores r 18; bores now run y -32..84.
- Pistons/rods are now too short for the block: throw 12 (real 20.0), rod 52 (real 60.3), crown 11.2 above pin (real 14.0).
  Piston crown at TDC = y 69.2, deck = 88.3 -> crowns stop ~19 units below the deck (they used to poke 33 units into the head).
  Fix belongs in crankshaft.js (crankThrow) and pistons-rods.js (rodLen, piston profile), not done here.
- Stayed at blockY-relative heights while head/cover/intake/exhaust moved up ~81 units: front-drive pulleys (water pump y blockY+66 now
  sits on the block, real one is on the upper block/front cover — probably OK, but the belt run vs head is unchecked),
  radiator/expansion tank (radY = blockY+38), airbox, hoses.js (radiator end fixed, head end moved -> long stretched hoses),
  timing-chain (crank sprocket fixed, cam sprocket follows headY, chain length grows — check it still closes).
- Knock sensors (y blockY+1) and mount arms (blockY-4) now sit in the lower third of a much taller block.

## Still off (block)
- Head height 140 mm unconfirmed; BW and COVER_H never measured.
- Parts above may float or stretch: hoses, timing chain, front drive vs head, airbox/radiator heights — not checked visually except one intake-side shot.

## Bottom end to spec (2026-11-18)
crankshaft.js crankThrow = 20.0 (89.6/2 mm), pistons-rods.js rodLen = 60.3 (135 mm), crown raised to 13.94 above pin (31.2 mm).
Computed: TDC crown y 88.29 = deck (flush); BDC crown 48.3, BDC skirt 21.3 vs counterweight top 16 (5 clear); crankpin boss bottom -36.0
= skirt bottom; rod cap bottom -38.5 (below skirt, above pan top -42). Explode shot renders; pistons not visible in it (inside block).
- Still off: crank web bosses (bx 10) now touch the skirt bottom line; rod caps swing ~2.5 below the skirt into the pan gap (realistic, unchecked visually).
