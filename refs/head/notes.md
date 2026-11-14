# Cylinder head (src/parts/head.js) — reference notes

Photos: `cylinder head.jpeg` (own), catalog image_2 (whole engine) and image_27 (VANOS / head front).

## What the photos show (only a thin strip of head is visible under the cover)
- Head is bare silver/grey cast alu, visible as a narrow band between block and cover; the cover (black plastic on the E46 330i) bolts down onto it.
- Front end carries the VANOS / oil-filter-housing casting; lifting eyes sit at the head ends on the exhaust side.
- Both long side faces are flat machined flanges where the intake manifold (+Z) and exhaust manifold (−Z) bolt on.
- Dark gasket line at the block joint.

## Modelled
- Gasket strip under the head, bright edge strips on top/bottom long edges and vertical corners,
  intake flanges (1/cyl) and exhaust flanges (2/cyl) with studs, lifting eyes (boss + ring) at both ends, exhaust side.

- Edges now rounded cylinder rails + corner balls; 7 cam bearing caps per cam (roundedBox); 6 plug-tube bosses with bore; VANOS front plate (+X) with two cam-end bosses.

## Still off
- Edge rails are plain cylinders, no parting lines / draft.
- Bearing caps, plug-tube bosses and VANOS plate are positioned by estimate (no photo shows them); VANOS plate is a plain slab without bolt pattern/solenoid ports.
- Not visually verified: preview canvas rendered blank in the Browser pane (no console errors; syntax check ok).
- Lifting-eye positions and flange spacing are estimated, not measured.
- Flanges don't follow port shapes; stud counts are simplified.
- Visual check 2026-11-14 (isolated, intake view, swiftshader; shows only that part, so cross-part clashes can't be seen):
  - Rendered together with valve-cover (same part id 'cylinder-head'), so one shot covers both. Looks coherent: six plug wells in the trough, rim, oil cap at the front end. Oil cap sits right at the very front edge, check it is not overhanging the cover end. Head body underneath is plain black, no visible port/flange detail from this angle.
