# Pistons & connecting rods

Source: RealOEM piston diagram (`pistons-rods-1.webp`): piston with shallow centre dish + angled valve reliefs,
3 ring grooves (3 rings shown separately), full-floating hollow pin, one circlip. Photos 2/3 not opened;
rod shape (I-beam, split cap, 2 bolts) is from general knowledge.

## Built (src/parts/pistons-rods.js)
- Piston: lathe body r=17 (bore is 18), crown dish, 3 grooves (y=8.5/6.1/3.7), hollow skirt, 3 rings, hollow pin r=4.5 L=32, 2 circlips, 4 dark disc valve reliefs (2 intake +Z, 2 exhaust -Z).
- Rod: length 52 centre to centre. Big end bore r=8.1 on crankpin (r=8, width 14), big end width 13; separate cap with 0.5 gap, 2 bolts along rod axis at z=+-11 with hex heads; I-beam flanges at +-Z, pockets on +-X; small end bore r=4.55 on the pin.
- Positions: slider-crank from `angles`/`crankThrow` returned by crankshaft.js (unchanged).

## Still off
- Valve reliefs are dark discs on a flat crown, not real recesses.
- Skirt is a plain cylinder: no thrust-face relief or pin-boss cutouts.
- No bearing shells, no rod bolt nuts, no oil squirt hole.
- Only checked at Explode 100% from far away; piston detail not inspected up close.
