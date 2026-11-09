# Crankshaft

Sources: `crankshaft-1.webp` (bmwfans/RealOEM diagram, part 1 = crank, 2-5 main shells, 6-7 rod shells, 8 reluctor ring, 9 bolt, 10 web), `crankshaft-2.jpg` (photo of the real crank).

## Counts (from the diagram, not memory)
- Main bearings: **7** (7 upper + 7 lower shells; the 6th from the front is the flanged thrust shell, item 2).
- Crankpins: 6. Webs: 12 (2 per pin).
- Counterweights: **8 full round weights** (pins 1, 2, 5, 6) + **4 small tapered webs** (pins 3, 4), from the photo. The old DB text says "12 counterweights"; it counts webs.
- Front: stepped snout with keyway + chain sprocket seat (damper end). Rear: large flange with pilot stub and 6 bolt holes (flywheel end), reluctor ring behind it.

## Model (src/parts/crankshaft.js)
- Angle table unchanged `[0,120,240,240,120,0]`; pins sit at `cx(i)`, so pistons-rods still line up.
- Mains at `cx(0)-span/2 + k*span`, k=0..6. Webs are extruded sector+boss profiles, lobe opposite the pin.
- Not modelled: oil holes, reluctor ring, main bearing shells (diagram items 2-5), sprocket.

## Still off
- Only one screenshot taken at Explode 100%; crank is small on screen, web shape not inspected up close.
- Flange/snout lengths are guessed from LEN, not measured from the photo.
- Thrust shell and reluctor ring (item 8) missing; DB specs string still says 12 counterweights.
