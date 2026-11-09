# Car body notes

No photos used. Facts below are from memory and **unverified**.

## What `src/parts/body.js` builds now (ids `car-body`, `bonnet`; both registered upright, `reg(..., false)`)
- Procedural E46 saloon shell, lofted along X in 251 stations of 6 units. Nose x = +340, tail x = −1160. Scale 1 unit ≈ 3 mm, ground at y = −125. Open underneath.
- Cross-section: 15 points per station (8 per side mirrored): rocker, mid-side, beltline, hood/cab blend, roof. Half-width 290 (≈1740 mm car width), roof at y = 347 (≈1415 mm height).
- Wheel arches: axles at x = 63 and −845 (908 units ≈ 2725 mm wheelbase), arch radius 113.
- Three index subsets of one vertex grid: paint (`matBody`), glass (`matGlass`: side glass, windscreen, backlight; B/C pillars stay paint), and hood.
- `car-body` includes end caps, a firewall plane (x = −185) and a floor pan plane; the hood is registered separately as `bonnet`.
- Marked shortcut in code: no door shut lines, grille, lamp openings or wheels.

## Real E46 facts to follow (unverified)
- E46 saloon: length 4471–4491 mm, width 1739–1757 mm, height ~1415 mm, wheelbase 2725 mm.
- Engine sits longitudinally behind the front axle; firewall is just behind the engine.
- Nose has twin kidney grille, four-headlamp or twin round-eye lamps, front bumper with air dam; those are absent here.
- Hood is hinged at the cowl and its centre height rises toward the windscreen.
- LHD: driver on the left (intake side of the engine after mirroring).

## Still off
- No grille, headlamps, tail lamps, door gaps, mirrors, wheels, bumpers or trim.
- Overall dimensions plausible but not checked against a drawing.
- Single-surface shell with no thickness; engine bay clearance (hood height, firewall x) not checked against engine-bay layout.
- Floor pan and firewall are flat planes, no tunnel or footwells.
- Hood is the same surface as the body, so no separate hinge, edges or thickness.
