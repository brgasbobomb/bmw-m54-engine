# Oil filter housing — reference notes

Looked at: `oil-filter-1.webp` (bmwfans exploded parts diagram), `oil-filter-2.jpg` (E46 330i engine bay from the front).

## What the photos show
- Housing is one cast body on a bracket bolted to the block pad by 3 long bolts, a gasket between. Vertical cartridge canister
  with a ribbed outer shell; the black plastic cap has a ridged edge and a hex nut on top.
- **No oil/coolant heat exchanger** on this M54 housing (diagram has none), so none is modelled. The old box was removed.
- Two sensors (oil pressure switch, oil temperature) plug into the side of the body; the VANOS oil line leaves from a banjo
  bolt underneath/behind and runs up-forward to the head.
- Photo 2: the PS reservoir (black cap, round) stands right next to the filter cap, on the outboard (intake) side, a little forward.

## Model
- Flange plate on the block pad (local z = -10), body block, seat, ribbed shell, cap with 12 ridges and hex nut,
  two sensor stubs, banjo + steel tube to a union at the head. Sizes eyeballed.
- PS reservoir lives in `front-drive.js` (part `power-steering-pump`) at x = LEN/2-58+4, z = BW/2+47, with a feed and a return hose to the pump.

## Still off
- Lower bracket (the long ear that bolts down to the block) is not modelled; the body is a simple box.
- VANOS line now ends under the `vanos.js` feed hose bottom (local 58, 14, -9.5 = world x LEN/2, y headY-26.9, z 44.5);
  the route between banjo and union is still a guessed curve (could clip the block pad near z=-10). Fixed by arithmetic, not looked at.
- Reservoir sits on the pump group, so it is removed together with the pump; hose ends at the pump are approximate.
- Never visually checked close-up: static preview (python http.server) renders a blank canvas, so use Electron (`npm run dev`) and remove the airbox.
- Visual check 2026-11-14 (isolated, intake view, swiftshader; shows only that part, so cross-part clashes can't be seen):
  - Housing + canister look right, canister on top. The thin VANOS line leaves the housing and ends in free air (expected only if vanos.js hose meets it; unverified). Housing is small relative to the pan: check against block pad.
- Clearance 2026-11-18 (VANOS steel line only: temporarily tagged the tube mesh `partId='vline'`, reverted; `npm run shot -- --clear vline ...`, world units, tube surface incl. r1.6):
  **alternator 0.18 at (140.2,39,-30.6) = TOUCHES a 14x5x12 box of the alternator (child 4, a mounting ear)**; engine-block 6.6 at (139.4,44,-24.3); power-steering-pump 10.1; pulleys 14.4;
  water-pump 27.8; oil-pan 44.3; cylinder-head 61.3. `vanos`/`intake`/`front-drive`/`starter` ids returned null (no object with that partId, not "far"). The vanos.js hose junction was not tested.
  Fix idea: reroute the line's last points (local ~50..58) away from the alternator ear, or move the ear. Not done.
- Fix attempt 2026-11-18 (reverted, not a line problem): `--clear` only samples surfaces, so it can't see a tube *inside* a solid. Arithmetic in the shared pre-mirror frame:
  alternator body = cylinder along X, centre y=blockY+36, z=52, r19, x 102..140; drive-end housing disc r19.5, x 140..146 (front-drive.js:105-106); lower lug x 126..140, y 13.5..18.5, z 46..58.
  The VANOS hose end (vanos.js, x=140, z=44.5, y≈24..26) is 12.5 from the alternator axis, i.e. INSIDE its silhouette (r19) at the body's front face. So the line's end/riser sits in the alternator
  whatever route it takes (under the lug, over it, or in front of the face); the 0.18 "touch" was only the lug. Needs the endpoint moved: alternator down/out (+Z), or the VANOS feed fitting/hose (vanos.js) shifted so it lands outside r19 of the alternator axis.
