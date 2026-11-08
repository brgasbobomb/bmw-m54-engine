// Ignition coils (rod-type, one per plug) + black harness tray along the trough's exhaust edge
export function build(c) {
  const { T, matSteel, matSteelDk, matCoil, matCover, reg, detail, roundedBox, LEN, COVER_H, coverY, cx } = c;
  const matTab = new T.MeshStandardMaterial({ color: 0xd9822b, metalness: 0.05, roughness: 0.6 }); // orange lock tab
  const coilsGrp = new T.Group();
  const cyl = (rt, rb, h, mat, seg, x, y, z) => {
    const m = detail(new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg), mat), coilsGrp);
    m.position.set(x, y, z);
    return m;
  };
  const box = (w, h, d, mat, x, y, z) => {
    const m = detail(new T.Mesh(new T.BoxGeometry(w, h, d), mat), coilsGrp);
    m.position.set(x, y, z);
    return m;
  };
  const b = coverY + COVER_H / 2 + 3; // plug-well rim height (valve-cover.js), wells at z = -6
  const Z = -6;
  for (let i = 0; i < 6; i++) {
    const x = cx(i);
    cyl(4.4, 4.4, 4, matCoil, 16, x, b - 1, Z);          // boot, sinks into the well
    cyl(7, 6, 12, matCoil, 24, x, b + 7, Z);              // barrel body, tapering toward the boot
    cyl(5.6, 6.6, 2, matCoil, 24, x, b + 14, Z);          // top cap
    // Connector on the exhaust side: box + hood, orange locking tab riding on top
    box(9, 6, 7, matCoil, x, b + 9, Z - 10);
    box(9.6, 1.2, 7.6, matCoil, x, b + 12.4, Z - 10);
    const tab = box(6, 1, 4.5, matTab, x, b + 13.4, Z - 11);
    tab.rotation.x = 0.18;                                 // tab lifts toward the harness end
    box(5, 1, 1.5, matTab, x, b + 12.6, Z - 7.5);         // tab hinge
    // Mounting ear on the top cap with its screw
    box(5, 2, 5, matCoil, x, b + 13.4, Z + 8);
    cyl(1, 1, 5, matSteel, 8, x, b + 13, Z + 8);          // shank
    cyl(2.3, 2.3, 1.6, matSteel, 6, x, b + 15, Z + 8);    // hex head
  }
  // Coil cover: black harness tray + corrugated conduit on the trough floor, outboard of the connectors
  const floor = coverY + COVER_H / 2 - 4;
  const tray = detail(roundedBox(LEN - 44, 3, 6, 1, matCover), coilsGrp);
  tray.position.set(0, floor + 1.5, -26);
  const conduit = cyl(1.8, 1.8, LEN - 52, matSteelDk, 10, 0, floor + 4.8, -26);
  conduit.rotation.z = Math.PI / 2;
  reg(coilsGrp, 'ignition-coils');
}
