# Engine bay, overall context (all parts) — reference notes

Photos in this folder:
- `engine bay.jpeg`
- `engine bay2.jpeg`
- `enginebay3.jpeg`

## What the photos show
- `engine bay.jpeg`: the user's own green LHD E46, shot from above the **left** front fender. Image top = car rear
  (cowl), image right = left fender and headlight, image left = engine.
  - Brake fluid reservoir (white, yellow cap) at the left rear by the firewall; left strut tower behind the airbox.
  - Black airbox fills the left front corner. MAF sits on its rear-inboard corner; a ribbed black boot runs from it to
    the throttle body.
  - Engine front, intake side: oil filter housing (silver star-ribbed cap) with the power-steering reservoir (black
    round cap) just outboard of it.
  - **Coolant expansion tank**: black round pressure cap at the left (intake-side, part +Z) end of the radiator, just
    ahead of and inboard of the airbox, slightly below the airbox top. A black coolant hose climbs from the engine
    front to that corner (upper radiator hose or tank hose; not confirmed which).
- `enginebay3.jpeg`: DIY close-up labelled "MAF Sensor and Connector": MAF on the airbox, black boot down to the
  throttle body, and a white translucent tank (grey cap rim) right beside it. That matches the tank sitting next to the
  airbox.
- `engine bay2.jpeg`: same car, from above the left fender looking down at the airbox with the **lid removed** (lid
  not shown). Image top = rear, right = left fender/strut tower (green), left = engine.
  - Airbox **base** is an open black tray, roughly rectangular with a stepped notch on the engine-side/front edge; ribbed
    floor, latch tabs along the fender-side rim, mounting ears with bolts toward the strut tower.
  - Intake path: a short MAF housing (clamped, MAF sensor body on top, connector on its side) then a thick smooth
    **rubber elbow** (~90°, two worm-gear clamps) that drops into the airbox outlet low in the tray. Then a ribbed
    boot from the MAF rear end going up/back to the throttle body under the plastic intake manifold. So the MAF is
    NOT on the airbox itself: airbox → elbow → MAF → corrugated boot → throttle body.
  - Right of the elbow: black corrugated conduit (wiring) running up beside the strut tower; thin vacuum/breather hose
    arching over from the intake manifold.
  - Engine side: oil dipstick (red loop handle) beside the manifold; PS reservoir (black ribbed cap, TRW-style) and
    oil filter housing cap (silver, star ribs) at left edge; expansion tank cap (black, with "KALT/COLD" min/max
    level sensor block) lower left, with a thick black hose and clamp going to it.
  - Front: black slam-panel/radiator support crossmember along the bottom, with bolts.

## As modelled
- Expansion tank (`expansion-tank.js`): upright 26 × 44 × 22 box at x 225…251, y 12…56, z 70…92. It sits 1 unit
  off the radiator's +Z side, front faces flush, tops level.

- Airbox + MAF (`airbox.js`, upright): MAF axis along X at y 52, z 125, x 95…139; airbox x 145…244, y 8…72,
  z 103…201, seam lip at y 34 with clips, outlet neck on the rear face for the MAF, snorkel low on the front face.
  Sizes are by eye (no airbox close-up yet).

## Still missing
- Tank cap, bleed screw and hose spigots; airbox lid detail (filter-cover ribs, intake snorkel route) by eye only.
- Check whether the model's upper radiator hose (it ends at the radiator's −Z top) should go to the +Z corner instead.

## Dimensions
None readable from the photos (no scale reference). All sizes in the model are by eye.

## Parts covered
expansion-tank, airbox (+MAF), intake boot, PS reservoir and oil filter housing (position only), dipstick (position
only). Other parts: see their own folders.

## Still off
- Airbox: photo 2 shows MAF → rubber elbow → airbox low outlet; check `airbox.js` places the MAF on the airbox's
  rear-inboard corner (photo 1 reading) vs. on an elbow off the tray. Needs a decision between the two photos.
- Airbox tray shape: stepped notch on the engine-side edge, ribbed floor, latches and mounting ears not modelled.
- Elbow clamps (two worm-gear) and MAF connector not modelled.
- Expansion tank: cap, level sensor block, bleed screw and hose spigots missing.
- Upper radiator hose end: +Z corner vs. −Z top unresolved.
- Conduit/vacuum hoses and dipstick are not modelled.
