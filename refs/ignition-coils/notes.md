# Ignition coils (src/parts/ignition-coils.js) — reference notes

Source: `refs/catalog/photo-set.md`, "Valve cover, coils, rail". Opened image_3 (whole E46 330i M54, high view,
coils on) and image_6 (rail close-up, coil/cover edge only). Perspective photos, no scale.

## What the photos show
- Six rod-type coils in one line in the exhaust-side trough, each over its plug well; black plastic, satin.
- Barrel body, slightly tapered to a rubber boot at the well; flat cap on top.
- Rectangular connector on the outboard (exhaust) side with an **orange/tan locking tab** on top.
- A small ear on the cap with a **silver screw** (hex head) holding each coil down.
- A **black harness tray** (coil cover) runs along the trough edge with corrugated conduit; clips onto the rim.

## Model
- Coil centred at `(cx(i), z = -6)`, bottom at `coverY + COVER_H/2 + 3` (= valve-cover well rim). Boot 4.4 r,
  body 7→6 r × 12, cap, connector 9×6×7 at z-10, tab (local orange material), ear+screw at z+8.
- Tray + conduit at z = -26 on the trough floor (valve-cover rim is z = -33, connectors reach z ≈ -20.5).

## Still off
- Coil body is a plain cylinder; real ones have a squarer upper shoulder and ribs.
- Harness wires from connectors to the conduit not modelled; tray clips missing.
- Screw is on the intake side of the cap here; the photo shows it outboard — unverified which.
- Coil cover vs. tray: photos don't show a separate lid, so only the tray is modelled.
