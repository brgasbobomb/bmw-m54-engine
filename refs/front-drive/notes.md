# Front drive — reference notes

Sources: `refs/catalog/photo-set.md` → "Front drive" (images 17–21) and "Alternator cooling duct" (no verified photo).
Looked at: `catalog/images/image_17.jpg` (complete E46 330i M54, front-left from above),
`catalog/images/image_19.jpg` (main belt tensioner, isolated).

## Layout (front view; "intake side" = +Z in part files)
- **Crank damper**: bottom centre, two grooves. Rubber ring visible between hub and rim; bolt circle on the face + centre bolt.
- **Water pump pulley**: directly above the crank, a touch toward the intake side, high (level with the head bottom,
  just under the thermostat). **Smooth** (no grooves), 4 bolts on the face, threaded fan-clutch boss in the middle.
- **Idler**: grooved (plastic, radial ribs), between water pump and alternator and *lower* than both — the belt dips
  under it (inside wrap).
- **Alternator**: upper intake side, pulley a bit lower than the water pump. Bosch body with radial slots in the
  drive-end housing (fan visible behind them).
- **Power steering pump**: low on the intake side, pulley nearly as large as the alternator body. Reservoir is up
  beside the oil filter housing, not on the pump.
- **AC compressor**: low on the exhaust side, separate **outer** belt from the front crank groove. Small AC
  tensioner pulley sits below the line between crank and AC and pushes the belt down.
- **Main tensioner**: exhaust side, between crank and water pump.

Main belt order: crank → main tensioner → water pump → idler (inside) → alternator → PS pump → crank.
AC belt: crank (outer groove) → AC tensioner → AC compressor.

## Main tensioner (image_19)
Cast aluminium body: roughly triangular base with two bolt ears (left and right) plus a lower hex boss, a round
spring housing at the pivot, and the pulley on a short arm above it. A thin damper rod runs from the arm to the
right-hand ear. Pulley is black plastic with radial ribs and a large smooth dust cap.

## Alternator cooling duct
No verified B30/E46 photo exists. Modelled as a plastic duct from the rear cap, round the outside of the
alternator, opening forward. **Unverified** — replace when a photo turns up.

## Fan mounting
front-drive.js returns `fanMount` (fan-clutch boss nose, upright frame); radiator.js hangs the viscous fan,
shroud hole and ring on it. The radiator is lifted to `radY` (layout.js, blockY + 38) so the offset fan fits the
shroud; the expansion tank and radiator-hose ends follow `radY`.

## Pulley sizes — reference values, not measured
Scale: 91 mm bore pitch = `span` 40.7 units → 2.24 mm/unit. From E46 M54 knowledge:
crank 160 mm (r 36), alternator 60 (r 13.5), PS pump 110 (r 24.5), water pump 130 (r 29), fan clutch ~100 mm (not in this file;
radiator.js owns the fan). Water pump, tensioner, idler and PS moved to keep belt tangents clear of the crank.
Idler (r 9), tensioner (r 11), AC pulleys left as eyeballed.

## Still off
- PS reservoir now stands beside the oil filter housing (feed + return hoses to the pump); hose routes are approximate.
- Pulley sizes are reference values, not measured; idler/tensioner/AC pulley sizes still eyeballed.
- Water pump moved up (y +66); thermostat/hoses/radiator fan follow it via fanMount but were not re-checked for clearance.
- Fan clutch (~100 mm) size is radiator.js's; not checked.
- Alternator cooling duct shape is a guess (see above).

- Close-up 2026-11-18 (`--focus thermostat`, intake side): pulleys, belt, thermostat housing and hoses are densely packed; no obvious part-through-part clipping, but the view is dark and hard to judge. A side-on view with the belt cover off would be a better check.
