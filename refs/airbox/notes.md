# Airbox + MAF (src/parts/airbox.js) — reference notes

Photos here: `airbox-1.jpg` (E46 bay from above, viewed), `airbox-2.jpg`, `airbox-3.jpg` (not opened).
Catalog `image_36.jpg` (Z4 M54 bay from the front-left, viewed). Findings below; don't re-open.

## What the photos show (seen once)
- airbox-1: the airbox is a low, flat, black rectangular box beside the front half of the engine, not ahead of it.
  Its front edge is about level with the valve-cover front end. Length along the crank ≈ 0.3–0.45 of the valve cover
  length, width across the car ≈ 1.1–1.3 × the cover width, height ≈ 0.35–0.4 of its width.
- The MAF sits on the box's rear-inboard corner; a short ribbed elbow runs from it back to the throttle body.
- image_36: same layout (Z4); the box top is flush with the manifold top, the boot is a short fat elbow.

## Scale (valve cover as the ruler)
- Valve cover length = 6·span = 244. Airbox length = 0.33 × 244 ≈ 80; with the MAF (40) the pair is ≈ 0.49 × cover.
- Airbox width = 1.1 × BW; height 38 (y 14…52, seam lip 32). The old box was 99 × 98 × 64 and stood 100 ahead of the
  front end (x to 244), which hid the front of the engine.

## As modelled
- MAF rear face (`bootEnd`, from intake.js) at x 34, y 36, z 108; MAF L 40, front flange only (the boot clamps over the
  rear spigot). Airbox starts 6 past the MAF front, so x ≈ 80…160.
- Boot (intake.js, only the boot changed): short cubic elbow, 16/20 handle lengths, radius 13.6 at the throttle flaring
  to 17.8 at the MAF, runs 9 over the MAF spigot; clamp ring at the end.
- Explode (src/explode.js): maf-sensor 270, airbox 330 (was 380 / 470).

## Still off
- Positions (y 36, z 108) are by eye; the boot's start height in the upright frame wasn't computed. Check the elbow
  from the intake side that it meets the throttle flange cleanly.
- Explode view at 100% not viewed; distances reduced by calculation only.
- Airbox lid detail (filter cover ribs, snorkel route, MAF plug direction) by eye only.
