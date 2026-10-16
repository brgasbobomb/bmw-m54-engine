# Intake (src/parts/intake.js) — reference notes

Photos in this folder:
- `user-engine-stand-photo.webp`: the user's M54 on an engine stand, intake side from above. Viewed; findings below.
- `realoem-intake-diagram.webp`: RealOEM exploded diagram of the M54 intake manifold, items 1–17. Viewed; findings below.
- `air intake hose.jpeg`: not viewed yet, probably the inlet boot. Look at it before refining the boot or its airbox end.

Catalog (section "Intake manifold and DISA" in `refs/catalog/photo-set.md`):
- `image_31.jpg`, `image_32.jpg`: loose OEM manifold with DISA, rail and injectors (basis of the older b4de238 model).
- `image_33.jpg` is an aftermarket welded-aluminium short-runner manifold, not OEM. Only its head flange is useful:
  rounded-rect ports wider than tall, staggered upper/lower bolt holes, scalloped bosses. Don't open it again.

## Stand photo (seen once, don't re-open)
- Six smooth, separate runner humps, each with a moulded double ridge along the top.
- Profile: steep rise from the head side to a crest, then a long gentle slope outward down to a straight dark weld-seam
  rail with clip tabs; the lower shell (plenum) continues below the rail.
- Dark pockets in the slots between the humps near the head end.
- Between the humps and the valve cover: a flat dark strip with silver screws (injector harness over the fuel rail)
  and six pink injector connector tabs.
- Silver throttle body at the front end, at plenum level, above the alternator. A thick black elbow boot leaves it
  forward and outward at about 45° and curves down.

## RealOEM diagram (seen once, don't re-open)
- 1 manifold: two shells, horizontal seam around the outer side plus a vertical seam at mid-length; two "eyes" (lugs)
  on the bottom. 2 gaskets.
- 3 intake air temperature sensor on top at the rear end, head side, washer 4.
- 5 distribution piece (idle air) along the head side, looping into a nipple on each runner; O-rings 6.
- 7 DISA adjuster on the outer wall at mid-length near the bottom, screw 12.
- 8 idle valve under the manifold: bracket 9, plug 10, rubber mount 11.
- 13 screw, 14 collar nuts on the head flange, 15/17 studs, 16 cap nut.

## Uncertain
- Real outward reach is about 110 units; the model stops at about 67 because the expansion tank sits behind the
  plenum at the rear (x −113…−87), which is not where the E46 has it (next to the radiator).
- Crest height and slope of the humps are by eye from one photo angle.

## Still missing (catalog list)
- Square-on outer-wall elevation at manifold height, removed DISA cartridge, verified factory barcode/sticker
  location, direct top plan, lower support-bolt close-up, underside (idle valve, bottom lugs).

## As modelled (units ≈ 0.45 per real mm, +Z = intake side; z′ = out from the head face z = BW/2 + 1, y′ = up from headY)
- Hump and shell profiles are shapes in (z′, y′) extruded along X with a bevel b; the visible surface is b outside the
  contour.
- Humps: 6 × 33 wide (slot ~7.7), bevel 5. Neck face z′ 1, y′ −5…15; steep face to the crest (z′ 26, y′ 30); long
  arched top down to the rail shoulder (z′ 67.4, y′ 1.5). Underside y′ −5 out to z′ 33 (clears the oil-filter cap),
  then hidden in the shell. Double ridge: two tubes r 0.9 at x ±3 following the top.
- Lower shell: one extrusion 248 long (x −120…128), bevel 4. Inner wall z′ 28 (clear of the oil filter), floor y′ −30
  (3 over the oil cooler). Outer wall leans 30° in the part frame so it stands vertical in the car at world z 66,
  4 short of the expansion tank.
- Outer wall (upright frame at the rail, z′ 67.4): seam rail 2.4 × 3 full length, six clip tabs under it, vertical
  seam rib at mid-length; DISA at mid-length 16 below the rail (flange r 9.6, body r 8 × 6, actuator box 11 × 9 × 7
  at x +12.5, connector on top).
- Head flange 256 × 22 × 4 (y′ −6…16, bottom 1 over the oil-filter housing); 14 collar nuts in two rows (y′ 12.5 and
  −2.5) at the 5 slots and past both ends; a web closes each slot at y′ 5–7.
- Injector boss r 3.4 on each neck (z′ 3.5); idle-air nipple at cx + 8; distribution rail r 1.1 at (z′ −2.2, y′ 18.2)
  with a half loop (R 3.8) into each nipple.
- IAT sensor: boss r 2.6 + connector on the shell top at the rear end (x −117, z′ 33).
- Throttle body: alloy r 12 × 18 at the +X end (x 137, y′ −16, z′ 45), axis along X, actuator box on the outer side.
  Boot r 11 on a cubic Bezier, forward then outward and down at 45°, ending near x 169, y′ −28, z′ 57; minimum bend
  radius 20 (a Catmull-Rom path folded the inner wall). Four ribs, clamps at both ends, dark cap.
- Fuel rail 4.5 square at y′ 25.5, z′ 3.5; harness strip on top with a silver screw at each slot; injectors
  r 2.3→1.8 × 9 under the rail; pink connector (0xd0407f) on the head side of each.
- Not modelled: idle valve with bracket/plug/mount (8–11), gaskets, studs, cap nut, DISA screw, bottom lugs, rail
  clips and feed line, airbox end of the boot.
