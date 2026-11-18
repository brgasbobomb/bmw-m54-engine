# Starter motor
Photos used: catalog image_15 (E46 330i bay, starter location), image_16 (Bosch-style starter).
- Gear-reduction starter: black cylindrical yoke, cast alu nose with triangular flange (2 threaded ear bolts),
  solenoid on top bolted to nose bracket, rear end carries B+ stud (nut + copper lug) and small spade terminal.
- In the E46 it sits low on the intake side, behind the intake manifold, pointing at the bellhousing.
Model: axis along X, nose toward -X; flange at block rear face (x=-LEN/2), pinion x=-148 meshes flywheel ring
(r40) — axis 45 from crank centre at (y=-18, z=43.4).

Update (flywheel session): flange is now a triangular plate flush on the block rear face (x=-LEN/2), two hex bolts
(+shanks) into the block at z=-14 local; pinion on the ring-gear plane (x=-LEN/2-8), axis 45.03 from crank centre =
ring tip r40 + pinion r5. Checked in one rear-corner view only.

## Still off
- Starter body (z 43.4 +/-12.5) still overlaps the block side by ~8 mm in Z; real one nests behind the bellhousing. No bellhousing.
- No crank sensor; no motor-end bearing cap detail; pinion has no teeth.
- Cable is a stub, no harness routing.

- Close-up 2026-11-18 (`npm run shot -- intake --focus starter-motor --zoom 1`, new option): motor + solenoid read as a cylinder pair bolted to the block side by a flat plate, nose pointing at the flywheel; no visible clipping, but the flywheel ring gear is fully exposed because there is no bellhousing. Adding the bellhousing (block.js flange is only lugs) is the next visible gap here.
