# Spark plug notes

No photos used. Facts below are from memory and **unverified**.

## What `src/parts/spark-plugs.js` builds now (id `spark-plugs`)
- Six identical plugs, one group, at x = cx(i), z = −6 (exhaust-side offset), standing on top of the valve cover: y = coverY + COVER_H/2 + 1.
- Each plug is three stacked cylinders: ceramic body r 2.8 × 12 (top), steel hex r 3.6 × 3 (6 sides), "thread" r 2.4 × 6 in gold material (bottom).
- Plugs poke up *above* the cover; nothing sits over them (coils are in ignition-coils.js).

## Real M54 facts to follow (unverified)
- Plugs sit in deep wells in the middle of the head, between the camshafts, under the valve cover; they are reached through tubes in the cover. In the real engine they are not visible above the cover.
- Each plug is covered by a coil-on-plug unit with a rubber boot reaching down the well.
- 14 mm thread, ~19 mm reach, 16 mm hex on most M54 plugs (NGK BKR6EQUP / Bosch FR6 type); long ceramic insulator, steel hex, then threaded shell with ground electrode.
- Plug axis is on the cylinder centreline roughly (z near the head's centre, not clearly offset), tilted with the 30° slanted group.
- Thread is nickel/steel colour, not gold. Platinum-tip plugs have small coloured tips only.

## Still off
- Plugs stand above the cover as if bare; hidden-in-well appearance not modelled.
- Thread is gold-coloured and the wrong material.
- z = −6 offset is a guess; not checked against head/valve-cover layout.
- No terminal nut on top, no ground electrode, no gasket washer.
- Plug length/diameter not checked against the cylinder pitch or ignition-coils.js.
