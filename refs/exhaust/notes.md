# Exhaust manifolds, cats, O2 sensors (`src/parts/exhaust.js`)

Source: `refs/catalog/photo-set.md`, section "Exhaust manifolds and catalysts". Looked at image_22 (the pair,
close-up) and image_24 (both assemblies lying flange-face up): used factory parts off a 2001 E46 330xi M54B30.
No ruler in any photo, so proportions only. The notes below cover both photos; no need to open them again.

## What the photos show
- Two separate assemblies, one per 3 cylinders: flange → 3 stamped runners → collector → cat → pipe → 2-bolt flange.
- Head flange: one flat steel plate per bank, rusty brown. Ports are horizontally elongated ovals, about 1.6–1.8 : 1.
  Bolt holes top and bottom at each end and more between the ports (seen on the lower edge). Exact count not
  verified; modeled as 8 copper nuts per flange.
- Runners and collector: pressed-steel clamshell, dark charcoal heat scale, a welded seam lip along both sides.
  Seen from below, the runners converge 3-into-1 with see-through gaps between them.
- Cats: flattened oval cans, bronze/tan heat tint, conical ends, a lengthwise seam ridge, two circumferential beads
  near the outlet end, a stamped circular logo.
- Assembly A (the longer one; image_22 right, image_24 far): the cat lies roughly parallel to the flange and runs
  past the flange's end, then an S-bend under a tan stamped heat-shield sleeve, then a pipe to the 2-bolt flange
  with studs.
- Assembly B (image_22 left, image_24 near): converges under the middle port; the cat runs diagonally in a plane
  parallel to the flange, then a straight pipe to the 2-bolt flange. A black O2-connector holder clip sits on the
  cat shell.
- O2 sensors, 4 in total: pre-cat on top of each collector (brass hex, silver body, grey cable); post-cat on the
  pipe just before the outlet flange.

## Assumptions in the model
- Front/rear is not labeled in the photos. Assumed A = front bank (cyl 1–3; its S-bend passes outboard of the rear
  cat) and B = rear bank (cyl 4–6).
- Both pipes end at X ≈ -150 (behind the block), heading rearward.
- The rear bank's collector and cat sit about 10 further out than the front bank's (cat at Z -70), so the cat
  clears the block's side boss (X -116..-84, out to Z -58). This comes from the model, not the photos. The front
  pipe runs outboard of it at Z -89.

## Not modeled yet
- Heat shields (image_25, not opened), the S-bend heat-shield sleeve, the connector clip, the cat logo, port holes
  in the flange, sensor cables.

## Still missing from refs (per photo-set.md)
- Square exhaust-side elevation of the B30 head, a view from below, shields on/off on the same engine, labeled
  pre/post-cat sensors, downpipe flange detail.

## Still off
- Heat shields (image_25 never opened) and the tan S-bend heat-shield sleeve on the front assembly: missing.
- Black O2 connector holder clip on the rear cat, the stamped logo on the cats, sensor cables: missing (sensors end in a short boot).
- Flange has no port holes (solid plate) and the bolt/nut count (8 per flange) is unverified.
- Collector is a scaled ellipsoid, not a stamped clamshell with seam lip; runners do converge but the join is not photo-accurate.
- Front/rear assembly assignment (A = cyl 1–3) is assumed; the cat offset (Z −70 / −89) comes from clearing the block boss, not from photos.
- Pipes simply stop at X −150 with a box flange; no downpipe continuation, hangers or flex joint.
- Still missing refs: exhaust-side head elevation, view from below, labeled pre/post-cat sensors, downpipe flange detail.

- 2026-11-18: added the tan heat-shield sleeve over the front bank S-bend (tube r 9.5, DoubleSide) and downpipes past the outlet flanges (mating flange at x -153, two pipes merging at z -79.5 into one pipe to x -240). The merge shape/length is a guess (no photo). Seen once in the full-engine exhaust shot: reads fine; not checked close-up. Cat heat shields, O2 clip, sensor cables, port holes still missing.
