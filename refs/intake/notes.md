# Intake (src/parts/intake.js) — reference notes

Photos in this folder:
- `user-engine-stand-photo.webp`: the user's own M54 on a red engine stand, seen from above on the intake side (front, alternator and throttle body at the left). Best view of the real shape. Seen once, don't re-open.
- `realoem-intake-diagram.webp`: RealOEM exploded diagram, items 01–17 (manifold, gaskets, DISA, idle valve, sensors, hardware). Seen once, don't re-open.
- `air intake hose.jpeg`: not viewed yet (presumably the inlet boot; look at it before refining the boot/throttle end).

Catalog photos (section "Intake manifold and DISA" in `refs/catalog/photo-set.md`, `image_31.jpg`, `image_32.jpg`) were used for the first version. Where they disagree with the two photos above (boxy plenum, U-rim "comb" on the runners), the user's photos win.

## What the photos show (seen once, don't re-open)
- Black moulded plastic. Six large smooth arched runner humps side by side, each about one pitch wide minus a narrow slot. Each hump has a moulded double ridge along its top. Steep on the head side, long slope down to the outer wall.
- A dark rectangular pocket in each slot, near the head end.
- A long dark weld-seam rail with small clip tabs along the outer side at the hump base; the lower shell continues below it.
- Along the head side, between the humps and the valve cover edge: a long flat dark distribution trough with screws in the slots and six pink/magenta connector tabs (fuel injector plugs).
- Throttle body (silver alloy) at the front (+X) end next to the alternator, with a thick black ribbed rubber elbow boot leaving it down and outward.
- Diagram: items 01 manifold 11617525753, 02 set of profile gaskets (six separate stadium-shaped), 03 intake air temp sensor, 04 O-ring 8X3, 05 distribution piece 11611440318 (the trough, six pipes), 06 O-ring 7X3 x6, 07 adjuster unit (DISA) 11617544805, 08 T-shaped idle regulating valve, 10 plug, 11 ring/boot, 13 screw, 14–17 nuts/studs. Flange has bolt ears; DISA sits mid-length on the outer/lower face.

## As modelled (units ≈ 0.45 per real mm; z from the head intake face = BW/2, y from headY)
- Hump: arch profile extruded 34 wide (x), bevel 2.5, one per cylinder at cx(i). Profile: floor y = -6 from z = 4 to the outer wall z = 52, wall up to y = 8, then a bezier over the top (control points (48, 27), (20, 37)) down to (7.5, 12) at the head side. Peak ≈ y = 27 at z ≈ 27. Two ridges (tube r 0.9) at x = ±10.
- Lower shell: rounded box (run + 34) x 14 x 40, z = 12…52, y = -6…8. Weld-seam rail 233 x 3 x 4 at z = 52, y = 7; clip tabs 6 x 5 x 3 per runner at z = 54, y = 4.
- Head flange plate (run + 54) x 22 x 4 at y = 5 (bottom y = -6 to clear the oil filter cap, whose top is at headY - 7); 7 hex bolts r 3 at y = 3, one in each runner gap and one past each end.
- Trough: rounded box 235 x 6 x 9 at y = 17, z = 4; 7 screws r 2.2 on top.
- DISA: housing 20 x 14 x 7 at mid-length (x = middle of the six runners), y = -1, z = 54.5; dark steel can r 6 x 8, alloy cap r 6.4, vacuum nipple r 1.4 on top.
- Throttle body: alloy r 12 x 18 at x = manifold end + 9, y = 6, z = 30, axis along X, flange r 13.4, actuator box 8 x 12 x 12 on the +Z side. Boot r 11 on a 4-point curve: 8…16 straight forward, then down 12 and out 8; four ribs, clamps at both ends, dark cap.
- Fuel rail 4.5 square at y = 26, z = 1.5 (above the trough); injectors r 2.3→1.8 x 14 hanging from it per cylinder, connector block and pink tab (0xd0407f) on the outer side.

## Not modelled (shortcuts)
- The dark pocket in each slot (the open gap between humps and the open strip behind the lower shell stand in for it), the six profile gaskets, studs/posts, intake air temp sensor, T-shaped idle valve, DISA vacuum hose and electrical lead, rail clips, the airbox end of the boot.

## Uncertain (seen, not confirmed)
- Hump profile (peak height, how far the steep head side reaches) was matched by eye.
- Boot direction (down and outward) comes from the stand photo only; the `air intake hose.jpeg` has not been checked.
- DISA position along X (modelled at mid-length) and that it hangs on the outer face rather than on top.

## Still missing (catalog list)
- Square-on outer-wall elevation at manifold height, removed DISA cartridge, verified factory barcode/sticker location, direct top plan, lower support-bolt close-up.
