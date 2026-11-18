# Intake (src/parts/intake.js) — reference notes

Photos in this folder:
- `user-engine-stand-photo.webp`: the user's M54 on an engine stand, intake side from above. Viewed; findings below.
- `realoem-intake-diagram.webp`: RealOEM exploded diagram of the M54 intake manifold, items 1–17. Viewed; findings below.
- `air intake hose.jpeg`: the loose inlet boot (MAF → throttle). Viewed; findings below.

Catalog (section "Intake manifold and DISA" in `refs/catalog/photo-set.md`):
- `image_31.jpg`, `image_32.jpg`: loose OEM manifold with DISA, rail and injectors. Viewed; findings below.
- `image_33.jpg` is an aftermarket welded-aluminium short-runner manifold, not OEM. Only its head flange is useful:
  rounded-rect ports wider than tall, staggered upper/lower bolt holes, scalloped bosses. Don't open it again.

## Inlet boot photo (seen once, don't re-open)
- One short, fat elbow (not a long hose): smooth body with a raised cage of 3–4 hoop ribs crossed by lengthwise ribs.
- One end: plain flat cuff with a square tab hanging off it. Other end opens wider.
- A thin corrugated hose (idle-air) leaves the side of the body and ends in a plain cuff.
- Modelled: cubic elbow from the throttle (out) to the MAF (forward, slightly up), radius 15 → 19, 4 hoops + 4
  lengthwise ribs, cuff + tab at the throttle end, clamp at the MAF, corrugated hose to the idle valve's rear end.

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

## User's 3D scans (2026-10-21, pasted in chat, not saved in refs/)
- Elevation of the outer/under side: long plenum with a flat lid and seam lip, two big drop bulges, square 4-bolt
  throttle flange (~95 mm) with ~70 mm bore at mid-length below the plenum, DISA bore with screws above it, sheet
  bracket below, hoses/ICV to the side, "B" moulded at one end.
- Oblique views: U-loop idle-air distribution frame (one U per runner on a straight spine) along the head
  flange is a prominent feature. Modelled (car frame): tube r 2.6, legs 17 apart from the spine at out 36 to the
  round end centred at out 16 (tip ~7.5), lying in a plane up = 38 + (out − 16)·2/3 just above the runner tops;
  spine is a 4×8 strip in that plane at out 37; nipple inside each U at out 24. Old flange half-rings removed.
- 2026-11-08 (stand photo re-checked): the U's are moulded ribs in the runner skin (low ridge on each hump), not a
  frame above it. Now a r 1.6 rib traced on the runner top surface (`surf(x, out)` in intake.js), spine a 3×7 strip
  half sunk into the crest (top 47). Same plan shape (legs 17 apart, out 16…36).
- Boot (stand photo): OD about equal to the throttle body, not fatter. Radius now 13.6 → 15.6 (was 15 → 19),
  cuff r 14.8, smaller tab. Route unchanged (ends at `bootEnd` on the MAF, r 17, so the boot end sits inside the MAF).

## Uncertain
- Crest height and position are by eye: top kept near the previous model (world y 108 vs coil tops 94); the crest
  sits ~0.33 of the depth out vs ~0.25 in image_32.
- Which end of the outer wall carries the barcode sticker.

## Still missing (catalog list)
- Square-on outer-wall elevation at manifold height, removed DISA cartridge, sticker end (image_32 shows it near
  one end), mounted top plan (image_32 is the loose part), lower support-bolt close-up, underside (idle valve,
  bottom lugs).

## As modelled (rebuilt from zero after the RealOEM diagram 138359; units ≈ 0.45 per real mm, +Z = intake side)
- Runners and plenum sit in a `car` group turned 30° about X, so they are drawn upright in the car:
  (out, up) from the head face centre (z′ 0, y′ 0). Flange, nuts, idle-air piece and fuel rail stay in the slanted frame.
- Diagram read: six separate round runners leave the flange rising, arch over the top and drop down the outer side
  into the plenum under the arch; the outer face is one smooth skin with the runner drops as shallow ribs; seam lip
  along the bottom of the outer wall, vertical seam at mid-length; DISA (7) on the outer wall at mid-length near the
  bottom; small vacuum stubs on the runner tops; IAT sensor (3) on top at the rear end.
- Runners: TubeGeometry r 10 scaled 1.5 in X (30 wide), three cubic Beziers in (out, up):
  (−2, 4.5) → crest (36, 37) → outer drop (88, 14) → end inside the plenum (72, 6). Top surface ≈ up 47.
- Plenum: rounded box out 34…90, up −3…22 (+3 bevel), length run + 46; inner wall clear of the oil-filter cap,
  floor above the oil cooler.
- Throttle (from the user's 3D scans, 2026-10-21): NOT on the plenum end. A neck under the plenum at mid-length
  (xm + 8, slightly toward the front) ends in a square 4-bolt flange facing outward (car frame up −18, out 73); a
  sheet bracket hangs below it toward the block, round DISA bore above it on the outer wall. Throttle body bolts on
  axis outward; the boot leaves outward, bends 90° forward and runs along the outer side past the front end.
  Idle valve: cylinder along X under the plenum behind the neck.
- The comb ribs / spine / weld rail / clip tabs of the previous model were dropped (not in the diagram).
- Not modelled: idle valve with bracket/plug/mount (8–11), gaskets, studs, cap nut, DISA screw, bottom lugs, rail
  clips and feed line, airbox end of the boot.

## Still off
- Boot shortened (2026-11-09): MAF moved to (28, 42, 108) upright, handles 10/14, radius 13.6 → 17 (= MAF). Looked right
  in one oblique intake-side view; not checked close-up against the throttle flange or from above.
- U-ribs are single round ribs; the real comb is a flat strip with a lip on each edge (double ridge).
- Spine/rib not checked close-up in the viewer (screenshot was a side view).

- 2026-11-18: `matIntake` lightened (0x18181a -> 0x34353a, roughness 0.62 -> 0.5) because runners read as flat black blobs in the assembled intake shot. Runner outlines and ridges now visible; boot/hoses share the material so they got lighter too (check they still read as rubber). Not checked close-up.

- 2026-11-18 (user photos, DISA close-up + engine-bay top): DISA replaced: boxy black housing 70×24×18 on the outer wall
  at mid-length low, lid seam, round actuator can + plug at the front end, small plug on top, white label on the
  plenum behind it. Seen from the intake side in one shot; looks like the photo.
- Still off: runners are round tubes, photo shows flattened/oval-section runners ending in a flange with 6 oval ports
  and 7 bolts (flange not reworked); plenum is a plain box, photo shows a hammerhead U with two upturned ends (not
  modelled); DISA box size/position by eye; label is tiny and edge-on from this angle.

- 2026-11-18 (second pass, photos): runners narrowed (scale.x 1.5 -> 1.3, 26 wide) so gaps show between them; each port
  on the head flange has an oval rim (15×12 outer, 12.4×9.2 hole); 7 flange bolts alternating high/low (was 14).
  Checked from the head side with --only. Port ovals are not tilted with the 30° runners and the flange is still a
  plain slab (photo: bumps around each port). Hammerhead plenum still not modelled; rim hole shows runner, not a dark port.

- 2026-11-18 (session 3 on intake): runners are now one CatmullRomCurve3 (centripetal) through 9 points in (out, up),
  same route as the old Beziers, ending inside the plenum; `surf()` samples the whole curve. DISA is its own group,
  registered `disa-valve` (new entry in parts-database.json). Sheet bracket under the throttle flange removed
  (it was the floating panel). Material stays `matIntake`: there is no separate "satin" material, it is the satin black plastic.
- Still off: the task mentioned "domes", but the code already had tube runners (no domes were found); the runners are
  still round tubes, not flattened ovals; hammerhead plenum not modelled; DISA size/position by eye; checked in one
  intake-side shot only, not close-up.

## Photo overlay comparison (2026-11-18, `src/overlay.js`, "Overlay" checkbox bottom-left of the viewport)
Compared the model at the "Photo angle" preset against the stand photo (one headless shot at 640 px wide, so rough).
Biggest differences, worst first:
1. Plenum/runner shape: photo has six fat, flattened oval humps joined into a hammerhead shell with a straight weld-seam
   rail along the outer edge; model has round tubes in a plain box, so the whole intake reads thinner and lower.
2. Valve cover / coil row: photo cover is much larger and taller (big oil-filler cap, coil-over-plug towers, fuel-rail
   strip with pink connector tabs below it); model's head side is flatter and the rail strip/pink tabs are missing.
3. Inlet boot: photo boot is a short fat elbow dropping down and forward at the front end, clearly bigger than the
   throttle body; model boot is slimmer and sits higher/further forward.
4. Front accessories (alternator, pulley area) sit lower-left in the photo; model's are further out in frame.
5. Stand, wiring harness and ground are not modelled (expected).
Preset camera dir is (0.5, 1, -1.1) from the current target at the current distance; tune it in `overlay.js` if the
photo's FOV/roll needs a closer fit.

- Still off: overlay only checked in one narrow-window shot; preset angle is by eye, not solved from the photo.

- 2026-11-18 (flattened runners): runner section is now an oval 28 wide × 14 thick (TubeGeometry r 7, scale.x 2; was r 10 × 1.3).
  Crest raised 3 so the top stays ≈ 47 (ribs/spine/stubs unchanged); outer drop centre moved to out 91 to stay ~5 proud of
  the plenum wall. Checked in one intake-side shot only (humps read as flat ovals); no close-up, rib fit on the thinner top not checked.
- Still off: hammerhead plenum, flange bumps around ports, runner section is constant (photo humps swell toward the crest).

- 2026-11-18 (hammerhead): two upturned end lobes added to the plenum (out 58…92, up 12…52, 9 thick, flush with each plenum end, beside
  the end runners; `eh`/`ehGeo` in intake.js). Rough: size/height by eye from the stand photo, one start-view shot only, front lobe not
  seen clearly. Still off: lobes are plain slabs (photo's ends blend into the plenum with a smooth curve), flange bumps around ports.

- 2026-11-18 (flange bumps): each port rim is now a raised bevelled oval boss (outer 34×24, 3 deep + 1.2 bevel; hole unchanged 12.4×9.2),
  flange slab raised 22 -> 27 so the bosses fit. Seen in a zoomed top shot (--only intake-manifold): bosses read as bumps around the
  runner bases. Not tilted with the 30° runners, not compared against the photo with the overlay.
- Still off: bosses are plain ovals (photo's blend into the flange with a softer shoulder); hammerhead lobes are slabs.

- 2026-11-18 (lobe blend): hammerhead lobe profile now has a concave fillet sweeping from its inner wall (out 58, up 38) down into the
  plenum top (up 22) at out 36, and 3.5 bevel on the end faces (was 2; depth 5). Seen from the rear end (`rear --focus`): lobe + plenum
  read as one silhouette. Not blended along X (end face still steps in beside the end runner); oblique views barely show the fillet.

- 2026-11-18 (lobe blend along X): each lobe's inner end face now has a concave fillet (10 long, up 40 -> plenum top 22) swept across the lobe's
  out range (`ehFil` in intake.js; mirrored with scale.x -1 at the +X end). Seen in a zoomed `top --focus` shot (left lobe shows the swoop).
  Sides of the fillet (out direction) end flat, not tapered; the fillet overlaps the end runners' drop slightly (same material).

- 2026-11-18 (boss shoulders): each port boss now sits on an elliptical frustum skirt (`skirtGeo`: 44×30 at the flange face tapering to ~37×25
  over 2.4) so the boss wall sweeps into the flange instead of stepping; flange slab raised 27 -> 30 to hold it. Seen in a cropped top shot
  (shoulder visible around runner bases). Skirt top is slightly wider than the boss in X and narrower in Y, so a faint lip remains; skirts
  and bosses still aren't tilted with the 30° runners.

- 2026-11-18 (boss tilt): the earlier "bosses not tilted with the 30° runners" was mostly a wrong worry. The runner's start tangent (out 12, up 8.5 in the
  car frame) is only 5.3° above the flange normal in the slanted frame (the car group's +30° cancels the slant), so bosses/skirts were already
  nearly aligned. They are now rotated by that 5.3° (`BOSS_TILT`, about X, tops toward +up). Not visible at shot scale; derived from the math only.

- 2026-11-18 (lobe end tapers): the X fillet is now a lofted double-sided skin (`ehFil`, 14×20 grid, `matFil` = matIntake clone) whose height above the
  plenum top fades with sin(πt)^0.6 along out, so it tapers to nothing at both out ends instead of ending in a flat wall. Seen in a zoomed
  `start --focus` shot: no gaps or flat ends visible; the taper itself is subtle at that angle. The lobe's own out-direction fillet is unchanged.

- 2026-11-18 (lobe top edge): both top corners of the lobe profile now use radius 14 (`ehR`; was 8), so the top rolls over into the outer wall and
  the inner fillet start (inner wall line shrank to zero); lobe outer face moved to out 93 = flush with the plenum's bevelled outer wall (was
  2 inside, leaving a seam). Seen in a rear-end focus shot: smooth roll-over; a tiny notch remains where the lobe's outer wall meets the plenum
  edge at the lower left of that view.

- 2026-11-18 (lobe/plenum notch): the notch was the lobe's outer wall standing ~3.5 proud of the plenum (ExtrudeGeometry's bevel grows the profile by
  bevelSize, so `o1: 93` really meant 96.5). Lobe outer out is now `pl.o1 + 3 - ehB + 2.5`; the +2.5 was found by eye in the rear-end shot
  (the calculated flush value left the plenum bulging past the lobe, so the plenum's real edge is further out than 93). A ~0.7 unit jog remains
  where the lobe's bottom edge ends on the outer wall (lower left in that view).

- 2026-11-18 (lobe bottom jog): the lobe profile's bottom outer corner is now rounded (R 8 quadratic) so the outer wall rolls into the plenum
  wall instead of ending in a hard step. Rear-end focus shot: jog reduced to a small soft shoulder (~0.5 unit), not fully gone; the flush
  offset (+2.5 in `eh.o1`) is still empirical.

- 2026-11-18 (lobe jog, measured): per-mesh bounding boxes (browser, car frame): plenum out max 93, up -6…25; lobe was 95.5 with the by-eye "+2.5".
  Now `eh.o1 = pl.o1 + 3 - ehB` → lobe out max exactly 93 = plenum, flat flush (lobe up 8.5…55.5, x flush with the plenum ends). The "jog/bulge"
  seen in end-on shots was the plenum's vertical seam strip (out 94, mid-length, `pl.o1 + 3` box), not the lobe. That seam silhouette still
  shows as a small bulge at the left edge from the rear view; it is intended. Earlier "+2.5 empirical" notes are superseded.

- 2026-11-18 (seam strip + correction): the vertical seam is now a thin band following the plenum's rounded section (`seam`, plShape extruded 1.2 with
  bevelSize 3.8 → out max 93.8, up -6.8…25.8), not a flat box sticking out past the corners. CORRECTION to the previous entry: the left-edge bulge
  seen end-on at up ≈ 8–25 is NOT the seam; it is the end runner's outer drop (runner tube bounding box out max 98.3, i.e. ~5 proud of the
  plenum wall by design). It was unchanged by the seam fix. Lobe wall (93) sits ~5 inside that drop.

- 2026-11-18 (runner drops flush): path points [78,35],[91,21],[88,7] -> [76,35],[85.7,21],[84,7]. Measured runner bounding box out max 98.3 -> 93.2
  (plenum 93), so the drops no longer stand proud; the outer face reads as one wall with the runner humps only as shallow ribs (as in the
  RealOEM read). Unchanged: crest (36, 40…58, 40), ribs/spine (follow `surf` on the new path). Checked in one zoomed start shot; the
  plenum seam band and the lobe walls now line up with the drops at 93.

- 2026-11-18 (rib close-up check): zoomed, cropped top shot of the six runner tops: U-ribs sit on the runners (round end toward the head, legs 17 apart),
  nipple dot inside each U, spine strip crosses all six, nothing floating. Ribs span out 16…37, the path change only touched out > 76, so they are
  unaffected; spine top 47 = runner crest top (40 + 7). Not checked: a low oblique close-up of the rib height (side shots hide the runner tops).

- 2026-11-18 (oblique rib check): new `npm run shot -- oblique --only intake-manifold --focus intake-manifold --zoom 2.5` (dir 0.7, 0.7, 0.6: front/head side, high).
  Shows the runner tops in relief: U-ribs read as raised tubes seated on each runner (round end toward the head, legs ~17 apart), nipples inside the U's,
  spine strip across the crests. No floating ribs. Ribs look a little proud/round next to the photo's low double ridge (already listed above).

- 2026-11-18 (double ridge): each runner's single r 1.6 U rib is now two thin r 0.9 U ridges (legs ±10.7 and ±6.3, half sunk, `ridge(w)` in intake.js), so
  the top reads as a low strip with a lip on each edge like the stand photo/image_31. Seen in `shot oblique` (zoomed): two concentric lips on every
  runner, nipple inside the inner U. Spine unchanged (3×7 strip); the spine/ridge junction and the lips' ends at out 36 not inspected.
  (The shot tool's --focus framing is flaky: if the result is a different view, rerun.)

- 2026-11-18 (ridge/spine junction): ridge legs now extend to out 39 so they end inside the spine instead of butting its face, and the spine is a
  `roundedBox` (r 1.3, 3.4 tall) instead of a sharp box. Seen in a zoomed oblique shot: the lips run into the spine cleanly, no stubs or gaps.
  The spine is still a plain straight bar (photo: a continuous moulded spine); its ends past runners 0 and 5 not inspected.

- 2026-11-18 (spine ends): spine bar is now run + 10 long with a half-ellipsoid cap (6 × 1.7 × 3.5) at each end, so it rounds off in plan and height instead of ending
  square 3 short of the outer runners' edges; same overall length as before. Seen in a zoomed oblique shot (both ends round, no stubs). Close-up of the
  cap-to-bar seam not inspected; spine is still a plain bar between the caps.

- 2026-11-18 (cap-to-bar seam, close-up): zoomed on the end of the spine (scratch script, camera 22 from the cap): the rounded-box bar's rectangular
  corners stuck out of the ellipsoid cap's elliptical section, leaving a visible lip at the seam. Bar is now an elliptical rod (CylinderGeometry
  along X scaled 1.7 × 3.5, length run + 10), so it joins the caps exactly; re-checked close-up, one continuous rounded bar. Trade-off: the
  spine is a rod rather than a flat strip. Only the first (+X-side / first found) cap was inspected; the other is the same geometry mirrored.

- 2026-11-18 (other end cap): inspected the second spine cap close-up (camera 22 from it): clean rounded end, no lip; only a faint hairline where cap meets rod
  (normal shading change at the join, not a step). Both caps now checked.

## Overlay comparison, round 2 (2026-11-18, `src/overlay.js` preset retuned to dir (1, 1.15, -0.9), distance ×0.65)
The first preset left the model small and nearly side-on; the new one puts the engine at about the photo's size and orientation (front lower-left,
intake side up, steep from above). Overlay at 50% and model alone, whole engine, 1100×853 window. Differences, biggest first:
1. Throttle/boot: photo has the silver throttle body and the fat elbow boot at the FRONT end of the plenum, low above the alternator, curving down-left.
   Model hangs the neck and boot from the underside at mid-length (from the 3D scans). The two sources disagree; decide which wins.
2. Plenum ends: model's hammerhead lobes read as tall blocks; in the photo the manifold just ends with the last hump and a low rounded end, no tall lobes.
   (Lobes may be too tall/boxy: u1 52 vs the photo's roughly hump height.)
3. Runners: photo humps are fatter, nearly touching, with a dark straight weld rail along the outer edge; model runners are slimmer with big dark gaps.
4. Head top: photo valve cover is much bigger/taller with the oil cap and a flat strip carrying the pink injector tabs; model coils stand tall and
   widely spaced with orange connectors; its valve cover looks smaller/lower.
5. Not in the photo (expected): radiator, fan, expansion tank, pulleys' hoses on the left; stand, harness and ground are not modelled.
Still off: all of the above; overlay compared by eye in one render, alignment is approximate (perspective not solved).

- 2026-11-18 (throttle/boot to the front, user choice after the overlay comparison; the 3D-scan mid-length position is dropped): `xT = xm + PX/2 - 14`,
  `uT` = plenum mid-height, `oT = 100` so the neck/flange/throttle body sit on the outer wall at the front end, plenum level; idle valve stays
  under the plenum (fixed at x xT-34, up pl.u0-8, out 66) with its hose re-routed. `bootEnd` (MAF rear face, drives airbox.js) moved to
  `(xm + PX/2 + 8, 42, 128)` so the boot leaves forward and the airbox/MAF follow it forward and 20 further out. airbox.js itself untouched.
  Clearance (`shot --clear airbox radiator,coolant-tank,pulleys`): was radiator 66 / tank 51; at out 108 it hit the tank (0.5), at 128: radiator 41, tank 16.8,
  pulleys 59. Overlay: boot and throttle now land near the photo's (front, low, curving down-left). Not checked: airbox look from outside, the boot
  shape on its new, longer-bend route, idle hose route, DISA vs the new throttle position.

- 2026-11-18 (boot on the new route, inspected: `shot intake|front --only intake-manifold --focus intake-manifold`): the boot leaves the throttle cuff at the
  front end and runs almost straight DOWN, ~85 long (≈3 diameters) before a slight outward/forward bend into the MAF end. Reason: the MAF/airbox
  height (`bootEnd` up 42, upright frame) did not change while the throttle rose to plenum level (~118), so the drop is ~75. Reads as a long pipe, not
  the photo's short fat elbow curving down-left; the four hoops/cage ribs are stretched along it. Cuff + tab and the clamp ring at the end look fine.
  Idle-air hose now leaves the boot's rear and loops under the plenum; it looks plausible but is short of the valve in the intake-side shot.
  Fix options (not done): raise `bootEnd` up (airbox.js follows) toward ~80, or put the throttle lower on the end face so the drop shortens.

- 2026-11-18 (airbox raised): `bootEnd` up 42 -> 80 (still out 128, x front + 8); airbox.js follows, untouched. Clearances (`--clear airbox ...`): radiator 41, tank 16.8,
  pulleys 86, block 83, alternator 52, power-steering pump 32 (was 18). Boot is now a short elbow (throttle at the front end -> MAF just forward and a little lower),
  as in the photo; checked in `shot intake --focus airbox`. The airbox now sits at about the coolant tank's height beside it (16.8 apart in depth); the overlay
  window did not show it (off-frame). Not checked: boot hoop/rib spacing on the shorter run, idle hose length.
