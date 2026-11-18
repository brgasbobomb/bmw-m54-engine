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

## CCV nipple (hand-over for ccv.js) — added session 2
- Lives in valve-cover.js inside `coverGrp` (parent of cover meshes; `coverGrp.position.y = coverY` = 63; inside the 30° slanted group; +X front, +Z intake).
- Cover-group-local coords (x, y, z): base (126, 3, 26); tilted 45° about X, axis direction (0, 0.707, 0.707) (up + out toward +Z/intake).
  Barb tip centre ≈ (126, 15.7, 38.7) local → **y ≈ 78.7 in slanted-group coords** (coverY 63 + 15.7).
- Outer diameter: stem 16 mm, barb collar 19 mm at the tip. Hose should slip over the stem (ID ≈ 16) and head toward the intake manifold (−X/+Z… i.e. along +Z then rearward).
- Nose is now an upper half-ellipsoid: centre (128, −10, 0), radii (16, 20, 34) — front flange tip at x = 144, top at plateau height, starts just ahead of the first coil (cx(5) = 105.7, well r 8).
- Oil cap: x axis has +X = front; cx(4)−15 = 50 is between the 2nd and 3rd coil from the FRONT (cx(5)=105.7 is front), on the plateau at z = 12. Consistent with the photo; left unchanged.

## BMW roundel — session 3
- Canvas-drawn roundel texture (blue/white quadrants, black ring, "BMW" lettering, chrome rim) on a `CircleGeometry` decal with a clearcoat `MeshPhysicalMaterial`. Plateau decal r = 10 at `(cx(1), z = 17)`, oil-cap decal r = 5.6. No photos opened.
- Hidden under the intake plenum until the intake is removed.

## Still missing
- Embossed roundel/text, yellow sticker (no yellow material yet), harness clips on the rim, the gasket lip around the base, nose bolts, centre bolts in the trough.

## Still off
- Roundel: lettering is Helvetica Bold, not BMW's own face; mirroring of the text (engine is mirrored across Z in index.js) not verified at readable zoom; clearcoat glare washes out the oil-cap decal. No part-number text yet.
- Dome/nipple added but NOT visually verified: the one screenshot showed an empty viewport (static server, no canvas content) — check in Electron.
- Dome front tip (x = 144) overshoots base body end (x = 135) by ~9; check the front flange looks right.
- Plug-well row sits at z = −6, near mid-width; photo says it hugs the exhaust edge. Check against coil positions before moving.
- Bolts: only 3 on the plateau (cylinders 2/4/6); photo also has a few on the nose and 2 centre bolts in the trough.
- Missing: embossed roundel/part-number text, yellow HV sticker, harness clips on the rim, gasket lip.
- Trough has a rim only along the exhaust edge; nothing closes it at the rear end.
- Underside (gasket, oil-separator labyrinth, honeycomb baffle) not modelled; only matters if the cover is shown removed.
- Visual check 2026-11-14 (isolated, intake view, swiftshader; shows only that part, so cross-part clashes can't be seen):
  - Same shot as head (shared id). Cover top is mostly black with light-grey well bottoms; roundel/decals not readable at this zoom. Nothing floating. Cover rim looks proud of the head flange at the exhaust edge, check at close zoom.

- Review 2026-11-18 (`npm run shot -- top|exhaust --only cylinder-head`, cover + head isolated). Rule 9: 3 sessions already spent, so no rebuild; findings only.
  - OK: six wells now sit along the exhaust edge, plateau reads as a raised strip with a darker inset panel, roundel on the plateau and cap decal visible, nose dome with the CCV nipple at the front, no floating pieces.
  - Wrong/missing (unchanged from the lists above): rim only on the exhaust edge and open at the rear end, no yellow HV sticker, no harness clips, no gasket lip, only 3 plateau bolts (photo has more, plus 2 trough and a few nose bolts), no part-number text, underside not modelled.
  - New: CCV nipple stands nearly vertical in the exhaust view; the notes call it a 45 deg up-and-out barb toward the intake, so recheck it against ccv.js.

## Session 4 (user-requested, overrides rule 9) — reference `reference-top-aftermarket.png`
Aftermarket cover, top view, product shot (front/dome at left, intake edge at bottom: oil hole, label recess and CCV nipple sit on it). Read once; no need to reopen:
- Flat black plastic. Two raised flanks along the long edges, each with a row of ~9-10 small round bolt bosses; a central recessed channel between them.
- In the channel: one silver (aluminium) stiffener plate per cylinder, each with the large plug-well hole and small bolt holes either side.
- Large keyhole-shaped oil-filler opening on the intake flank near the front third; a rectangular label recess just behind it (toward the rear).
- Bulbous front dome; short thick CCV stub out of the front intake corner.
Model changes: plateau/rim replaced by two raised flanks (exhaust z -35..-16, intake z 10..35), a silver plate + 2 bolts per cylinder in the channel (z -3), 10 bolt bosses per flank, label recess at x -26. Roundel, oil cap, wells, nose and CCV stub unchanged. Checked in top and exhaust-side isolated shots: layout matches the photo.
Still off: wells/plates not segmented like the photo's stamped plates; oil opening modelled as an installed cap, not the keyhole; underside, harness clips, yellow HV sticker, gasket lip still missing; CCV stub angle still to recheck vs ccv.js.
