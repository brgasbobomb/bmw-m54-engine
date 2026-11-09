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
- VANOS line route and union position at the head are guessed; check against vanos.js.
- Reservoir sits on the pump group, so it is removed together with the pump; hose ends at the pump are approximate.
- Not visually checked close-up: the airbox hides the housing from the intake side in the default view.
