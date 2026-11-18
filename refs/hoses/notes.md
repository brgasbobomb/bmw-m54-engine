# Coolant hoses

Sources: refs/hoses/hoses-1.webp (bmwfans exploded diagram: upper hose 3 with sensor elbow, lower hose 1, heater pipes 6/8, expansion hose 5), refs/hoses/hoses-3.jpg (real upper + lower hose pair on a bench).

## What the photos show
- Both radiator hoses are moulded, thick-walled, with a 90 deg-ish bend near the radiator end and a gentle S in the middle. Not a plain arc.
- The housing-end fitting is a hard plastic elbow with a quick-release clip; hose slides over a bead and is held by a steel band clamp. The elbow's outlet turns toward the front.
- Upper hose has the coolant temp sensor on the radiator-end elbow (photo 3, top), not on the thermostat.
- Diagram: thermostat outlets are roughly opposed (one up/rear, one down), both turning to the front.

## Model
- `thermostat.js`: two 2-leg elbowed necks with ball elbows and bead rings. Upper: up+rearward (-Z) then +X. Lower: straight down then +X. Tips: upper (16,6,-24), lower (14,-24,4) relative to housing origin.
- `hoses.js`: hose starts = tip minus 4 along the last leg (hard-coded, must match thermostat.js), 5-point CatmullRom, 40 segments. Steel band + screw block clamp at both ends. Radiator ends unchanged (hoses.js `up()` points).
- Hoses registered as 'thermostat' group (slanted frame); radiator end points are un-slanted.

## Still off
- STILL NOT visually checked (2nd attempt): preview pane is hidden in this app and the WebGL canvas reads back as uniform background (no console errors, rAF runs, 1348x1536 canvas). No collisions confirmed or fixed; hose vs front-drive pulleys/fan and radiator tanks still need a look in a visible window (Explode 0%, intake side + front).
- Lower hose still starts on the thermostat housing (real M54 lower hose also starts at housing; pump feed is via a separate pipe, not modelled).
- No expansion-tank hose, heater pipes (diagram 6/8) or sensor on the upper hose elbow.
- Hose has constant radius, no moulded bulge or quick-release clip.
- Visual check 2026-11-14 (isolated, intake view, swiftshader; shows only that part, so cross-part clashes can't be seen):
  - Two hoses meet at the thermostat housing and run to the radiator end points; no kinks. Upper hose end looks lifted above the lower one, plausible. Hose ends sit at the radiator's connection side only in the full engine; check the radiator tank necks line up with them at Explode 0%.

- Close-ups 2026-11-18 (`--focus thermostat` from top/intake/exhaust, full engine, auto side): hoses leave the thermostat housing cleanly, clamps seated, no kinks, and the upper hose runs past the front pulley/belt plane without visibly cutting through the pulleys or fan clutch. It does pass very close to the fan-clutch disc edge right behind the thermostat clamp (can't tell by eye if it touches). Expansion-tank thin hoses seen only partly. No numeric clearance test was done (no bounding-box check) — if it matters, sample the hose centreline against the front-drive meshes.

- Clearance script 2026-11-18: `npm run shot -- --clear thermostat radiator,pulleys,water-pump,alternator,...` (min distance between sampled surface points of the last object registered as `thermostat` = the hoses, and each listed part). Results (units = scene units, ~mm): radiator 0.08 at (225,6,-61) = the tank neck (by design, hides any fan clearance); pulleys 0.19 at (168.8,21.9,2.9) and water-pump 0.36 at (162.6,39,52.5) = hoses TOUCH both; alternator 30, power-steering pump 24, A/C compressor 56, CCV 58 = clear; coolant-tank 0.12 at (220,57,-82) = thin hose end on the spigot. Touch means distance ~0, not penetration depth. Open: which pulley is touched at (169,22,3), and the fan-clutch distance (it is inside the `radiator` group so the neck masks it).
