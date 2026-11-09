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
