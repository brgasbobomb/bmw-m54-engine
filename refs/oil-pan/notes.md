# Oil pan (src/parts/oil-pan.js) — reference notes

Photos in this folder: `oilpann.jpeg` (underside, installed), `oilpann2.jpeg` (not opened).
Also seen: `refs/catalog/images/image_11.jpg` (RWD pan, side view, lying on its side, flange along the bottom edge).

## What I saw (RWD pan, cast aluminium, dull grey)
- **Two sections**: one tall/deep end and one shallow end, joined by a smooth sloped ramp (not a hard step).
  Deep end ≈ 40 % of length, shallow end ≈ 40 %, ramp ≈ 20 %. Deep part is roughly 2× the depth of the shallow part.
- **Sump is at the FRONT** (pulley end, +X): installed photo shows the deep part sitting low behind the crossmember/AC compressor,
  the shallow part running back under the bellhousing.
- **Front end face** of the deep section is sloped (flange runs diagonally up to the front-cover) with a round boss + 2 studs at the top corner.
- **Side walls**: big smooth cast surfaces with a few raised ribs/bosses (bolt-through bosses with threaded holes) and a large round boss with bore
  at mid-length on the deep section (the pickup/return boss; exact function unconfirmed).
- **Flange**: narrow flat lip all round; bolts ~ every 25–30 mm along both long edges (about 8–10 per side), small hex heads, one cast locating tab on the lip.
- **Shallow end**: has a stamped steel bracket/plate bolted on the lower rear corner and a sensor-style housing on top rear (gearbox side).
- **Not confirmed from photos**: drain plug position (assumed bottom of the deep section, side-offset), oil level sensor (assumed front-lower
  of deep section, small block), dipstick tube entry (assumed one side near the front, tube going up into the block).

## Model choices
- Deep front box + ramp wedge + shallow rear box, bolts along flange, 3 rear ribs, drain plug, level sensor, dipstick stub on −Z (exhaust) side.

- Added: round bore boss (r8, bore r4.5) on both side walls of the deep section at x=0.17L, y=-26; front boss (8x12x22) at the top of the sloped front face with 2 studs (z=±7) pointing +X; level sensor moved to the −Z wall at x=0.32L, y=-30.

## Still off
- Bolt-through bosses on the walls: not modelled (round bore boss now exists, see below).
- Side ribs only exist on the shallow rear section (3 per side); photo shows ribs/bosses on the deep section too.
- Cast locating tab on the flange lip: missing.
- Shallow end: stamped steel bracket (lower rear corner) and sensor housing (top rear) are missing.
- Not visually checked in-app (browser pane showed blank viewport); sizes/positions of the new bosses are eyeballed guesses.
- Drain plug, level sensor and dipstick positions are guesses (not confirmed by photos), see above.
- `oilpann2.jpeg` was never opened.
