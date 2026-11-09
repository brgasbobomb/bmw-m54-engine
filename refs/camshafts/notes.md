# Camshafts + valves (src/parts/camshafts.js, valves.js) — reference notes

Photos: `camshafts-2.jpg` viewed (bare M54 head, both cams in place). `camshafts-1.webp` (RealOEM diagram) NOT opened.

## What the photo shows
- 7 bearing journals per cam, polished, each under a bolted cap; between journals the lobes sit in pairs (one per valve, 2 per cylinder).
- Lobes are egg-shaped, dull grey/bronze; shaft is slightly darker than the journals.
- Front (VANOS) end carries the hub/sprocket; intake cam is the near one, exhaust the far one.
- Valves sit in round bores below the cams (bucket tappets), 4 per cylinder.

## What the model does
- Cam axis y = headY+8, z = ±18 (= VANOS hub axis in vanos.js). Shaft runs x = -LEN/2+12 .. LEN/2-16 (back face of the VANOS barrel); no separate sprocket, the VANOS hub is it.
- Lobe: extruded egg profile, base r 5.5, lift 2.5, width 5, at cx(i) ± 4. Phase follows firing order 1-5-3-6-2-4 (60° cam apart); exhaust cam +1.9 rad.
- Journals r 5.2 at -LEN/2+22 + k*span (k = 0..5) plus one at LEN/2-22.
- Valves: origin = tappet top at camY-5.5, tilted ±0.21 rad about X; bucket, retainer, 5-turn spring, stem, cone head + rim. Each valve is pushed down by its lobe's lift. Intake head r 5.6, exhaust 4.9.
- RB / LIFT / firing order are duplicated in both files; change both together.

## Still off
- Journal caps (bolted bearing caps) are not modelled.
- Camshafts show no sensor wheel / trigger teeth at the front.
- Valve heads are only visible with the head removed; seats/guides not modelled.
- Spring tube geometry is shared by 24 valves, fine for now but not tuned for look.
- RealOEM diagram not compared yet.
