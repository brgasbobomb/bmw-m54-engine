// Crankshaft
export function build(c) {
  const { T, matSteel, matSteelDk, reg, detail, LEN, blockY, cx } = c;
  // ----- INTERNAL MECHANICS: CRANKSHAFT WITH 12 COUNTERWEIGHTS -----
  const crankGrp = new T.Group();
  // Main journal shaft
  const mainShaft = detail(new T.Mesh(new T.CylinderGeometry(11, 11, LEN + 15, 24), matSteel), crankGrp);
  mainShaft.rotation.z = Math.PI / 2;
  mainShaft.position.set(0, blockY - 6, 0);

  const crankThrow = 12;
  const angles = [0, 2 * Math.PI / 3, 4 * Math.PI / 3, 4 * Math.PI / 3, 2 * Math.PI / 3, 0]; // standard I6 crank configuration
  
  // Create counterweights & crankpins
  for (let i = 0; i < 6; i++) {
    const a = angles[i];
    const pinX = cx(i);
    const pinY = blockY - 6 + Math.cos(a) * crankThrow;
    const pinZ = Math.sin(a) * crankThrow;

    // Crankpin journal
    const pin = detail(new T.Mesh(new T.CylinderGeometry(8, 8, 16, 18), matSteel), crankGrp);
    pin.rotation.z = Math.PI / 2;
    pin.position.set(pinX, pinY, pinZ);

    // Two counterweight webs per crankpin
    [-1, 1].forEach(offset => {
      const web = detail(new T.Mesh(new T.BoxGeometry(8, 38, 18), matSteelDk), crankGrp);
      web.position.set(pinX + offset * 8, blockY - 6 - Math.cos(a) * 8, -Math.sin(a) * 8);
      web.rotation.x = a + Math.PI; // pointing opposite to crankpin throw
    });
  }
  reg(crankGrp, 'crankshaft');
  return { angles, crankThrow };
}
