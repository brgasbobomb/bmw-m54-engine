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
- MAF rear face (`bootEnd`, from intake.js) at x 28, y 42, z 108 (moved 2026-11-09 to shorten the boot; airbox follows, x ≈ 74…154); MAF L 40, front flange only (the boot clamps over the
  rear spigot). Airbox starts 6 past the MAF front, so x ≈ 80…160.
- Boot (intake.js, only the boot changed): short cubic elbow, 16/20 handle lengths, radius 13.6 at the throttle flaring
  to 17 at the MAF, runs 9 over the MAF spigot; clamp ring at the end.
- Explode (src/explode.js): maf-sensor 270, airbox 330 (was 380 / 470).

## Still off
- Positions (y 42, z 108) are by eye; the boot's start height in the upright frame wasn't computed. Check the elbow
  from the intake side that it meets the throttle flange cleanly.
- Explode view at 100% not viewed; distances reduced by calculation only.
- Airbox lid detail (filter cover ribs, snorkel route, MAF plug direction) by eye only.

## 2026-11-18 user photos (E46/X3 airbox, DISA, intake, cats; seen once, don't re-open)
- Airbox: big flat rounded-rectangle lid plate over a shallower lower housing, clips on the seam, ribbed round outlet
  neck on the side face, slatted grille low on one end, cold-air snorkel elbow rising from the top corner, flat
  mounting tab with two bolts under the box. Added: lid plate, 3 neck rings, 5 slats, snorkel elbow, tab + 2 bolts.
- Intake (not yet reworked): runners are six separate arched tubes ending in a flat flange with oval ports and 7 bolts;
  plenum is a wide hammerhead U-shape with two upturned ends; DISA is a boxy black housing on the outer wall with a
  round actuator can. Cats (not yet reworked): flat-sided oval can with a long horizontal slot, 2-bolt flange, front bank
  pipe has a big S-bend.

## Still off (update)
- Snorkel sits on the far (+Z−) side, not seen in the shot; lid plate and slats by eye; bottom tab not checked from below.
- Snorkel route to the kidney grille not modelled (ends in the air at y 78).

## 2026-11-18 (2nd pass) boot attachment
- Chain is throttle → boot → MAF → airbox neck. Box taller (y 14…66, seam 36) like the photos so the neck sits mid-height on the end face; neck 12 long overlapping the MAF flange, steel clamp ring at the joint.
- Still off: box height 66 not clearance-checked against expansion tank/manifold (looked fine in the intake shot only); lid plate not tilted like photos; boot→MAF is still one bolted MAF in between (real E46 has it too, but not photo-verified).

## 2026-11-18 (3rd pass, last per rule 9) multi-angle catalog sheet (8 views, E46/X3 330i, user-supplied, not saved)
- Shape: deep lower housing (taller than long), side profile tapers to a big rounded chamfer under the far end;
  flat lid plate overhanging all round on top; clips on the seam on both long sides + far end; round outlet neck high
  on one end; louvred inlet (stepped horizontal slats) low on the far end; vertical channel rib on one long side; flat
  bolt tab with two rubber grommets on the neck end. No snorkel tube on the box itself — removed it.
- Modelled: box x ≈ 0.36 × cover length, y 0…66 (seam 54, lid 66…69), extruded side profile.
- Still off: the box bottom (y 0) not checked against the subframe/radiator; lid not tilted; grommet tab position by eye.

## 2026-11-18 (4th pass, user-granted exemption from rule 9)
- Lower housing now tapers across Z toward the bottom (vertex scale 0.72 at y0 → 1 at the seam).
- Lid: black overhanging plate + raised rim + dark inset, tilted −4° toward the far end, bracket on the neck-end corner.
- Outlet: flat 46×46 boss on the end face, neck 16 long with two ribs, clamp at A.x0−15.
- Inlet: deep ribbed block 10 proud of the far end (7 fins); inner side has a dark recessed panel; mounting arm with
  grommet reaches down under the neck end.
- Still off: lid top reads light grey under top light; arm and grommet tab placement by eye; bottom (y0 0, arm to −25)
  not clearance-checked against subframe/radiator.

## 2026-11-18 (4th pass, follow-up) lid colour + clearance
- Lid: local matte material (0x141416, roughness 0.92); matCover's sheen made the flat top read grey.
- Clearance (`npm run shot -- intake --clear airbox <ids>`): intake runner #1 arches over the box top, so the box
  is now y 0…57 (seam 45), lid flat and low (tilt −0.03, overhang trimmed on the inner and neck sides), box moved
  6 outboard (z0 = z − 14), outlet boss 30×40. Gaps now: intake-manifold 1.4, PS pump 7.5, throttle body 21,
  belt 25, engine block 41, alternator 44, coolant tank 51, oil pan 52, radiator 66. MAF 0.1 = intended neck joint.
- No subframe/body in the model, so the bottom (y 0, arm to −25) has nothing to clear yet.
- Still off: runner #1 gap is only 1.4; lid tilt smaller than the photos because of it.
