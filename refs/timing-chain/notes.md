# Timing chain + oil pump (src/parts/timing-chain.js, oil-pump.js) — reference notes

Photos (all RealOEM/bmwfans exploded diagrams) viewed: `timing-chain-1.webp` (M52 label, primary), `-2.webp` (secondary), `-3.webp` (oil pump).

## What the diagrams show (not from memory)
- **TWO chains.** Photo 1: one chain from the crank sprocket (double-row, ~half the cam sprocket diameter) up to ONE big cam
  sprocket (4). Fixed straight guide rail (5) on one run; curved tensioner rail (7) on the other, pushed by a spring
  piston (9–12). Photo 2: a separate short chain (1) with its own pad tensioner (2), guide arm (3), running between TWO
  cam sprockets (10 + the left one). So crank→intake cam and intake cam→exhaust cam.
- Crank sprocket has two rows; second row drives the oil pump (photo 3 chain 7, pump sprocket 6, ~2/3 the crank row).
- Oil pump: cast body hung on the pan front, gerotor (rotor 5 in housing 4), relief valve (12–16) on the side, pickup pipe (2)
  with strainer cup, bolted by a small flange, running back into the sump.

## Model choices
- Sprockets: crank 12 / cam primary 24 / cam secondary 16 / crank pump row 14 / pump 9, common pitch 5.45 (scaled).
- Primary plane x = LEN/2, secondary x = LEN/2-6, pump row x = LEN/2+3. Sprockets sit just behind the VANOS hubs.
- Links: InstancedMesh, alternating wide/narrow plates. Rails: strips along the straight runs.
- Primary: fixed guide on intake-side run, curved rail + piston + housing on exhaust-side run.
- Secondary: pad tensioner on top run, guide arm on bottom run.
- Pump body at x≈LEN/2-7, y≈blockY-44, partly inside the pan front; pickup runs back to z=0 in the deep sump (visible exploded only).

## Still off
- Run-side of tensioner vs guide not confirmed against crank rotation direction.
- Sprocket diameters are ratios from the drawings, not measured; sprocket windows/lightening holes missing.
- Crank pump row is mostly hidden by the snout; no chain case / cover around the drive.
- Pickup length/depth guessed from pan notes; oil-pan geometry is solid so the pipe is only visible exploded.
