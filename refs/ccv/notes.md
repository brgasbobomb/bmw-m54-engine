# CCV (src/parts/ccv.js) — reference notes

Source: `refs/ccv/ccv collector uninstalled.jpeg` (engine bay from above, intake manifold off, fuel rail + injector
ports on the left, two oil-filter-area caps and alternator low in the frame). It shows no CCV hose or separator
clearly, so the shape is **inferred, not copied**: hose from the valve-cover front intake corner (`refs/valve-cover/notes.md`)
to a separator on the intake manifold, short return hose into the plenum.

## Model
- Slanted group, id `ccv` (entry `ccv` in parts-database.json, assembly Cylinder Head).
- Nipple stub on the cover nose at `x = LEN/2 - 2`, `z = BW/2 - 12`, `y = coverY + 2`, pointing +X. valve-cover.js has no
  nipple (a sibling session may add one — then drop the stub here and start the hose at theirs).
- Hose r 5.2 arches out forward, down and across to a separator box (26x14x22, `matIntake`) on the plenum top at its
  front end (`cx(5)+12`, car-frame up 30, out 62; placed with the same 30° un-slant as intake.js). Inlet nipple on the +X face,
  screw cap on top, 18x14 flange on the plenum. Second short hose r 4.2 from the box into the plenum. Steel worm clamps at all four hose ends.

## Still off
- Rendering not verified: the in-app browser pane showed an empty canvas (no WebGL output) so the hose route/box
  position were never seen; only checked that the module loads with no console errors. Look at it first.
- Separator box position/size, hose route and whether the hose really ends on the plenum front vs. near the throttle body are guesses (no photo shows it).
- Nipple stub duplicates what valve-cover.js should own; hose does not avoid the oil-filler cap / coil harness clearance explicitly.
- Hose radius and box dimensions are unmeasured.
- Visual check 2026-11-14 (isolated, intake view, swiftshader; shows only that part, so cross-part clashes can't be seen):
  - Top view: box with cap hole plus one curved hose; reads fine, but only one hose is visible (the second short hose to the plenum seems absent or hidden). Everything is pure black, so no detail visible in the intake view. Box looks tiny/flat compared with the hose.
