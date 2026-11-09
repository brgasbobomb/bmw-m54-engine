# Valve cover (src/parts/valve-cover.js) — reference notes

Source: `refs/catalog/photo-set.md`, section "Valve cover, coils, rail". Looked at image_7 (cover off, held up
underside-up in front of an E46 engine bay) and image_3 (whole E46 330i M54 on a stand, high front-right view, coils
on). Not opened: image_6 (fuel-rail close-up). Perspective photos, no scale: shapes and relative positions only.

## What the photos show
- Plain black plastic, satin/matte. No silver stripes, no badge plate (the old model's stripes/badge were invented).
- Two levels across the width: a raised flat **plateau on the intake side** (about 40–45 % of the width) and a lower
  **coil trough on the exhaust side** with a low outer rim along the exhaust edge. The trough is closed at the front by
  the nose; the harness clips onto the rim.
- Six round **plug wells in one straight line, off-centre toward the exhaust side** (image_7: the row hugs one long
  edge; image_3: coils in the trough). Each coil stands on its well, connector facing outboard (exhaust side).
- Plateau top: embossed roundel + part-number text on the rear half, yellow high-voltage sticker, oil filler cap.
- **Oil filler cap**: black, BMW mark + oil-can icon on top, on the plateau at the front third (beside the 2nd/3rd coil
  from the front), nearer the coil row than the intake edge.
- **Bolts**: zinc bolts with big washers along the plateau's intake edge (roughly every other cylinder), a few more on
  the nose. Underside shows about 9 perimeter bosses per side plus 2 small centre bosses (between wells 2–3 and 4–5);
  exact top-side pattern not verified.
- **Front nose**: full-width bulbous dome wrapping the VANOS, top at about plateau height, curving down to the front
  flange; it extends well past the first coil. (Underside, inferred to be the same end: wider lobe in the rubber gasket,
  honeycomb baffle and a hose nipple.) The CCV hose leaves the front intake-side corner toward the intake manifold.
- Underside (image_7): rubber perimeter gasket, ribbed oil-separator labyrinth on the intake-side half.
- Fuel rail (image_3): silver rail with two black injector clips in the valley between plateau and intake runners —
  not part of this file.

## Model (valve-cover.js, local y: 0 = cover centre)
- Base body `LEN-10 × (COVER_H-4) × BW-8` = trough level (4 below the plateau); plateau z 3…35, top at `COVER_H/2`;
  rim at z = -33; six lathe wells at `(cx(i), z = -6)` rising to `COVER_H/2 + 3`, which is where `ignition-coils.js`
  puts the coil bottoms; nose cylinder r = 12 at `LEN/2 - 12`; oil cap at `cx(4) - 15, z = 12`; 3 bolts at z = 30.
- Registered as `cylinder-head` (no own entry in parts-database.json).

## Still missing
- Embossed roundel/text, yellow sticker (no yellow material yet), CCV nipple on the nose, harness clips on the rim,
  the gasket lip around the base, nose bolts, centre bolts in the trough.

## Still off
- Nose is a plain round bar (r 12) across the width; photo shows a bulbous dome curving down to the front flange, extending well past the first coil.
- Plug-well row sits at z = −6, near mid-width; photo says it hugs the exhaust edge. Check against coil positions before moving.
- Bolts: only 3 on the plateau (cylinders 2/4/6); photo also has a few on the nose and 2 centre bolts in the trough.
- Missing: embossed roundel/part-number text, yellow HV sticker, CCV nipple/hose on the front intake corner, harness clips on the rim, gasket lip.
- Trough has a rim only along the exhaust edge; nothing closes it at the rear end.
- Oil cap position (cx(4) − 15) not re-checked against which end is "front" in the photos.
- Underside (gasket, oil-separator labyrinth, honeycomb baffle) not modelled; only matters if the cover is shown removed.
