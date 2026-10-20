# Intake (src/parts/intake.js) — reference notes

Photos in this folder:
- `user-engine-stand-photo.webp`: the user's M54 on an engine stand, intake side from above. Viewed; findings below.
- `realoem-intake-diagram.webp`: RealOEM exploded diagram of the M54 intake manifold, items 1–17. Viewed; findings below.
- `air intake hose.jpeg`: not viewed yet, probably the inlet boot. Look at it before refining the boot or its airbox end.

Catalog (section "Intake manifold and DISA" in `refs/catalog/photo-set.md`):
- `image_31.jpg`, `image_32.jpg`: loose OEM manifold with DISA, rail and injectors. Viewed; findings below.
- `image_33.jpg` is an aftermarket welded-aluminium short-runner manifold, not OEM. Only its head flange is useful:
  rounded-rect ports wider than tall, staggered upper/lower bolt holes, scalloped bosses. Don't open it again.

## Stand photo (seen once, don't re-open)
- Six smooth, separate runner humps, each with a moulded double ridge along the top (image_31: the two lips of
  the U-rib comb, see below).
- Profile: steep rise from the head side to a crest, then a long gentle slope outward down to a straight dark weld-seam
  rail with clip tabs; the lower shell (plenum) continues below the rail.
- Dark pockets in the slots between the humps near the head end.
- Between the humps and the valve cover: a flat dark strip with silver screws (injector harness over the fuel rail)
  and six pink injector connector tabs.
- Silver throttle body at the front end, at plenum level, above the alternator. A thick black elbow boot leaves it
  forward and outward at about 45° and curves down.

## Catalog image_31 / image_32 (seen once, don't re-open)
- image_31 (oblique, from above at the head flange): the top carries a comb-shaped raised rib frame, a flat strip
  ~7 wide with a lip on each edge. One U per runner: outer width ≈ the hump width (~32), opening ~16–18, at least 35
  from spine to tip (foreshortened), round end toward the head/injector. The legs run into one continuous spine
  along the crest. Inside each U the runner top sits lower than the rim, with the idle-air nipple and its hose half
  loop; deep dark slots between the U's. Beyond the spine: broad smooth moulding with a pill-shaped boss. Also: fuel
  rail with tabbed brackets, black feed hose with a quick connector at the rail end, round lug on the flange end,
  stud on the end wall, black hoses along the outer side.
- image_32 (near-top plan of the loose manifold), head side outward: rail + injectors, comb (U's + spine), six humps
  with dark pockets between, a straight proud full-length weld rail with squared ends, then the outer plenum strip:
  open round DISA bore at mid-length with a brass threaded fitting below it and an alloy nipple, hoses toward one
  end, white barcode sticker on the outer wall near one end (which end not identified), clips on a bracket at the
  other end; corrugated hose with a quick connector at the rail end.
- Plan proportions (image_32): depth ≈ 0.4 × length; spine ≈ 0.25 of the depth from the head side, rail ≈ 0.8. The
  manifold's tilt on the table is unknown, so treat these as rough.

## RealOEM diagram (seen once, don't re-open)
- 1 manifold: two shells, horizontal seam around the outer side plus a vertical seam at mid-length; two "eyes" (lugs)
  on the bottom. 2 gaskets.
- 3 intake air temperature sensor on top at the rear end, head side, washer 4.
- 5 distribution piece (idle air) along the head side, looping into a nipple on each runner; O-rings 6.
- 7 DISA adjuster on the outer wall at mid-length near the bottom, screw 12.
- 8 idle valve under the manifold: bracket 9, plug 10, rubber mount 11.
- 13 screw, 14 collar nuts on the head flange, 15/17 studs, 16 cap nut.

## Uncertain
- Crest height and position are by eye: top kept near the previous model (world y 108 vs coil tops 94); the crest
  sits ~0.33 of the depth out vs ~0.25 in image_32.
- Which end of the outer wall carries the barcode sticker.

## Still missing (catalog list)
- Square-on outer-wall elevation at manifold height, removed DISA cartridge, sticker end (image_32 shows it near
  one end), mounted top plan (image_32 is the loose part), lower support-bolt close-up, underside (idle valve,
  bottom lugs).

## As modelled (units ≈ 0.45 per real mm, +Z = intake side; z′ = out from the head face z = BW/2 + 1, y′ = up from headY)
- Hump and shell profiles are shapes in (z′, y′) extruded along X with a bevel b; the visible surface is b outside the
  contour.
- Car frame below = the part frame turned 30° about X, measured from (z′ 0, y′ 0): out = 0.866 z′ − 0.5 y′,
  up = 0.5 z′ + 0.866 y′.
- Humps: 6 × 33 wide (slot ~7.7), bevel 5. Neck face z′ 1, y′ −5…15; steep face to the crest (car out 32, up 40);
  long gentle slope (car frame) to an end face vertical in the car at out 95.5, top up ~31. Underside y′ −5 out to
  z′ 28 (clears the oil-filter cap), where it meets the shell's inner wall; below that it is flush with or inside
  the shell (contour corner at z′ 33 is a reflex corner, so the bevel pulls the surface back to 28).
- Comb: per hump a flat U strip wrapped onto the top path, outer R 15 / inner R 8.5 (width 30, opening 17), legs 16
  from the crest, tip 31 down the head-side face (arc length). Base 3 out from the contour, top 6.3 (1.3 proud on
  the flat, a ~2.7 rim at the bevelled side edges). Spine: rounded bar 233 × 2.6 × 7 along the crest, level in
  the car, 2.3 proud. Crest at arc length 42.5 of the top path (where it runs level in the car).
- Lower shell: one extrusion 248 long (x −120…128), bevel 4, ~97 deep (0.4 × length, as image_32). Inner wall z′ 28
  (clear of the oil filter), floor y′ −30 over the oil cooler (3 clear), then level in the car at up −4.9. Outer wall
  vertical in the car at out 96.8, top corner up 29.8; the top rises ~14° outward between the humps.
- Outer wall (upright frame, origin at car out 96.8 / up 29 = z′ 98.3, y′ −23.3): seam rail 2.4 × 3 full length,
  six clip tabs under it, vertical seam rib at mid-length; DISA at mid-length 16 below the rail (flange r 9.6, body
  r 8 × 6, actuator box 11 × 9 × 7 at x +12.5, connector on top).
- Head flange 256 × 22 × 4 (y′ −6…16, bottom 1 over the oil-filter housing); 14 collar nuts in two rows (y′ 12.5 and
  −2.5) at the 5 slots and past both ends; a web closes each slot at y′ 5–7.
- Injector boss r 3.4 on each neck (z′ 3.5); idle-air nipple at cx + 8; distribution rail r 1.1 at (z′ −2.2, y′ 18.2)
  with a half loop (R 3.8) into each nipple.
- IAT sensor: boss r 2.6 + connector on the shell top at the rear end (x −117, z′ 33).
- Throttle body: alloy r 12 × 18 at the +X end (x 137, y′ −20, z′ 50, on the shell's front end face, inner half),
  axis along X, actuator box on the outer side. Clash-checked clear of the alternator and pulleys.
  Boot r 11 on a cubic Bezier, forward then outward and down at 45°, ending near x 169, y′ −32, z′ 62; minimum bend
  radius 20 (a Catmull-Rom path folded the inner wall). Four ribs, clamps at both ends, dark cap.
- Fuel rail 4.5 square at y′ 25.5, z′ 3.5; harness strip on top with a silver screw at each slot; injectors
  r 2.3→1.8 × 9 under the rail; pink connector (0xd0407f) on the head side of each.
- Not modelled: idle valve with bracket/plug/mount (8–11), gaskets, studs, cap nut, DISA screw, bottom lugs, rail
  clips and feed line, airbox end of the boot; edge lips on the comb strip (flat), pill boss beyond the spine,
  barcode sticker, brass fitting under the DISA, hoses and bracket clips on the outer side.
- Known difference: image_31 has the idle-air nipple and hose loop inside each U; the model keeps them on the neck
  just head-side of the U tip, because higher up they would hit the fuel rail.
