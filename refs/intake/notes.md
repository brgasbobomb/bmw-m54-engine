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
