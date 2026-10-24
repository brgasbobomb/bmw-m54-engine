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
- `engine bay2.jpeg`: not viewed yet.

## As modelled
- Expansion tank (`expansion-tank.js`): upright 26 × 44 × 22 box at x 225…251, y 12…56, z 70…92. It sits 1 unit
  off the radiator's +Z side, front faces flush, tops level.

- Airbox + MAF (`airbox.js`, upright): MAF axis along X at y 52, z 125, x 95…139; airbox x 145…244, y 8…72,
  z 103…201, seam lip at y 34 with clips, outlet neck on the rear face for the MAF, snorkel low on the front face.
  Sizes are by eye (no airbox close-up yet).

## Still missing
- Tank cap, bleed screw and hose spigots; airbox lid detail (filter-cover ribs, intake snorkel route) by eye only.
- Check whether the model's upper radiator hose (it ends at the radiator's −Z top) should go to the +Z corner instead.
