# Valve notes

No photos used. Facts below are from memory and **unverified**.

## What `src/parts/valves.js` builds now (id `valves`)
- 24 valves (4 per cylinder, 6 cylinders), one group. Pairs at x = cx(i) ± 4; intake at z = +18, exhaust at z = −18.
- Each valve: bucket tappet r 3.4, retainer, 5-turn tube spring r 3 (shared geometry), stem r 1.1, cone head and flat rim. Intake head r 5.6, exhaust r 4.9.
- Tilted about X by ±0.21 rad (≈12°) per side; origin at tappet top, y = camY − RB where camY = headY + 8, RB = 5.5, LIFT = 2.5 must match camshafts.js.
- Each valve is pushed down by cam lift from a firing-order phase (`firing = [0,4,2,5,1,3]`, exhaust offset 1.9 rad), a static pose not an animation.

## Real M54 facts to follow (unverified)
- Valve train is roller finger followers with hydraulic lash adjusters (HVA), not bucket tappets on stems. Lever sits between cam and valve tip.
- Intake valve head ~35 mm, exhaust ~30.5 mm (M54B30, 4 valves, DOHC 24V). Model heads (r 5.6 / 4.9 units, ≈ 3 mm/unit) give ~33.6 / 29.4 mm.
- Included valve angle roughly 25–30° total; each valve leans from the vertical (about 12–15° each side is plausible).
- Single valve spring per valve, dual-pitch; retainer and split keepers at the top. Valve stems ~6 mm.
- Intake cam at +Z (intake side), exhaust at −Z, matching the model's layout.

## Still off
- Bucket tappets used where the engine has roller finger followers + HVA.
- No keepers/collets on the retainer, no valve seals, no guides or seats visible.
- Valve head sizes are within ~1.5 mm of spec but not checked precisely.
- Pair spacing ±4 units and z = ±18 not checked against head/camshafts.
- Lift pose is a fixed snapshot; does not follow VANOS/camshaft rotation if camshafts animate.
