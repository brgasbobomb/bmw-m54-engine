# Radiator + fan — reference notes

Source: `refs/engine-bay/` (viewed `engine bay.jpeg` and `engine bay2.jpeg`; the third is a MAF close-up, not opened).

## What the photos show
- The radiator core, end tanks, shroud and fan are NOT visible in any photo: the front panel / radiator support and the
  engine-driven parts hide them. So core, shroud and fan are built from E46 knowledge, not from the photos.
  The photos do not contradict a belt-driven viscous fan (no electric fan motors visible at the engine side).
- Left (intake, +Z) end: the coolant expansion tank with a round black cap and a "KALT/COLD min/max" label sits ahead of
  and below the airbox, right at the radiator's left end. A thick black hose with a worm-drive clamp passes beside/under it
  toward the front, ribbed hose sections nearby.
- In `engine bay2.jpeg` the tank looks dark grey/black, not white-translucent (see `engine-bay/notes.md`).

## Differences / open points
- Photos suggest the hose beside the expansion tank runs to the +Z (left) end. `hoses.js` has the upper hose at −Z and
  the lower at +Z. Kept as is (task said to line up with hoses.js); worth checking in a later session.

## As modelled (`src/parts/radiator.js`, group frame: x ±6 rear→front, origin at radiator centre)
- Envelope unchanged: x ±6, y ±56, z ±69, so the expansion tank (z 70…92) still sits 1 unit off the +Z side.
- Core 10 × 100 × 122 with canvas fin/tube texture; top and bottom rails; plastic end tanks (z ±65, 8 wide) with ribs.
- Hose necks point rearward (−X) at y +38 (−Z tank, upper) and y −38 (+Z tank, lower); hose ends in `hoses.js` meet them.
- Small nipple on the +Z tank into the expansion tank at y 34.
- Shroud: plate with Ø88 opening at x −9…−6, ring Ø90 behind it; viscous fan Ø~90, 9 pitched blades, clutch hub and a
  short drive stub toward the water pump (not tied to the pump position).

## Size check (session 2) — no geometry change
Photo `engine bay.jpeg` (opened): radiator not visible (hidden by front panel), so it gives no direct scale; used engine height instead.
- Model engine height: oil-pan plug at y≈-77 up to valve-cover top y=90 → ~170 units. Real M54 pan-bottom→cover-top ≈ 640 mm → **0.266 units/mm** (block width 78 u ↔ ~300 mm agrees, so Y/Z scale is consistent).
- X is NOT the same scale (valve cover 270 u ↔ ~560 mm = 0.45 u/mm; model engine is stretched along the crank axis), so valve-cover length must not be used for the radiator's Y/Z size.
- Real E46 non-M 330i aftermarket core: ~580 W × 445 H × 40 mm (XTREM listing; Cooling Solutions 58×45 cm). Not an OEM spec.
- Scaled: core ≈ **154 W × 118 H units**. Current core is 122 × 100 (138 × 112 with tanks/rails) → current radiator is already ~20% SMALLER than true scale vs this engine.
- Conclusion: the real radiator is wider than the engine, so it hides it in the front view too. Making it smaller would be less accurate, so size left unchanged. If a smaller look is wanted anyway, a ~0.85× (core 104 × 85) keeps fan hole Ø88 barely inside; needs shroud/neck/hose/tank re-lay.

## Decision (session 3)
E46 core ~650 x 440 x 32 mm at 0.266 u/mm (Y/Z scale from engine height). Applied: height 100→116 (tanks/rails follow, rails y ±61), thickness 10→8.5.
Width left at 122 core / 138 overall: hoses.js necks (z ±65, y ±38 unchanged) and the expansion tank (z 70…92) pin it; true scale would be ~173.
Hose side settled: upper −Z, lower +Z stays (photo only hints at +Z; cannot change hoses.js here).

## Still off
- Width (z) still 138 not true-scale 173: tank necks at z ±65 are fixed by `hoses.js` and the expansion tank sits at z 70+. Widening needs both moved.
- Hose side: kept upper −Z / lower +Z (hoses.js is fixed and the photo is not conclusive); revisit only together with hoses.js.
- Core/shroud/fan not visible in any photo: dimensions from E46 knowledge/aftermarket listings.
- Fan stub not tied to actual pump nose geometry.
- (Added from code review) Shroud is a flat plate plus a short ring: no side walls/funnel to the core, no mounting tabs.
- Fan: blades are 9 identical flat boxes; no viscous-clutch detail (bimetal spring, fins on the hub face).
- Missing: filler/bleed fittings, coolant temperature sensor, rubber mounts/brackets, trans/AC lines. Core is only a texture on a box (no real tubes).
- Visual check 2026-11-14 (isolated, intake view, swiftshader; shows only that part, so cross-part clashes can't be seen):
  - Upright, fan disc plus a long thin shaft sticking out with nothing at its end (pump nose is not part of this part, so it floats in isolation; check it meets the pump in the full engine). In the full-engine intake view the translucent grey expansion tank overlaps the radiator's top-left corner, check clearance.
