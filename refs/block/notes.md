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

## Still off
- Sensor positions unverified (need a bare-block photo, intake and exhaust side).
- Mount-arm x position / height unverified (no installed photo; catalog says brackets installed on a B30 are missing).
- Skirt is a plain slab: real block has flared, ribbed skirt with the bearing-cap ladder visible and bellhousing flange at rear.
- Lifting eyes (front/rear) not modelled; no photo.
- Old per-cylinder side ribs kept as-is.
