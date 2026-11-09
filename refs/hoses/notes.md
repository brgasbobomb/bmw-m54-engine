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
