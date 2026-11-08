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
