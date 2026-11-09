// Double VANOS actuator
export function build(c) {
  const { T, matBlock, matAlu, matAluDark, matSteel, matSteelDk, matGold, matCoil, matHose, roundedBox, reg, detail, LEN, headY } = c;
  // ----- DOUBLE VANOS ACTUATOR UNIT -----
  const vanosGrp = new T.Group();
  const put = (mesh, x, y, z) => { mesh.position.set(x, y, z); return detail(mesh, vanosGrp); };
  const cyl = (r, len, mat, x, y, z, axis = 'x', seg = 24) => { // seg 6 = hex
    const m = put(new T.Mesh(new T.CylinderGeometry(r, r, len, seg), mat), x, y, z);
    if (axis === 'x') m.rotation.z = Math.PI / 2; else if (axis === 'z') m.rotation.x = Math.PI / 2;
    return m;
  };
  // Hex bolt head with dark socket, sitting on a +X-facing surface at x
  const bolt = (x, y, z) => { cyl(1.4, 1.2, matSteel, x + 0.6, y, z, 'x', 6); cyl(0.7, 1.4, matSteelDk, x + 0.7, y, z, 'x', 6); };

  // Torx screw: round head with a six-lobe-ish socket (two crossed hexes)
  const torx = (x, y, z) => { cyl(1.4, 1.2, matSteel, x + 0.6, y, z, 'x', 12); cyl(0.8, 1.4, matSteelDk, x + 0.7, y, z, 'x', 6); cyl(0.8, 1.4, matSteelDk, x + 0.7, y, z, 'x', 6).rotateY(Math.PI / 6); };
  // Cast housing: wide lower body with a bridge between the two hub barrels
  put(roundedBox(24, 24, 66, 2.5, matBlock), 0, -7, 0);
  put(roundedBox(24, 12, 20, 2, matBlock), 0, 9, 0);
  for (const s of [1, -1]) { // +1 intake, -1 exhaust
    const z = s * 18;
    // Cam hub housing: barrel, machined flange, gold hub, centre bolt, ring of 6 bolts
    cyl(14.5, 26, matBlock, 1, 4, z);
    cyl(11.5, 2.5, matAlu, 15.25, 4, z);
    cyl(8.5, 4, matGold, 18.5, 4, z);
    cyl(3.6, 2.4, matSteelDk, 21.2, 4, z, 'x', 6);
    for (let k = 0; k < 6; k++) bolt(16.5, 4 + 10 * Math.sin(k * Math.PI / 3), z + 10 * Math.cos(k * Math.PI / 3));
    // Solenoid valve: flange, black body, plug pointing outboard
    cyl(6.8, 1.6, matAluDark, 12.8, -9, z);
    cyl(5.6, 7, matCoil, 17.1, -9, z);
    put(new T.Mesh(new T.BoxGeometry(5, 6, 7), matCoil), 17.1, -9, z + s * 7.6);
  }
  [-29, -7, 7, 29].forEach(z => bolt(12, -15, z));
  // Oil feed fitting on the intake side: bolted head, neck, union nut, hose down to the filter housing
  cyl(4, 8, matBlock, 4, -9, 37, 'z');
  put(roundedBox(11, 11, 8, 1.2, matBlock), 4, -9, 44.5);
  [[-5.5, 44.5], [-12, 42.5], [-12, 46.5]].forEach(([y, z]) => torx(9.5, y, z));
  cyl(3, 5, matBlock, 4, -17, 44.5, 'y');
  cyl(3.6, 2.4, matSteel, 4, -20.7, 44.5, 'y', 6);
  cyl(2.8, 9, matHose, 4, -26.4, 44.5, 'y');
  cyl(3.5, 1.4, matSteel, 4, -24.5, 44.5, 'y'); // hose clamp band
  put(new T.Mesh(new T.BoxGeometry(1.2, 1.6, 2.4), matSteel), 4, -24.5, 47.9); // clamp screw housing
  // Steel L-bracket: vertical plate on the head's +Z end, flange over the top
  put(new T.Mesh(new T.BoxGeometry(11.4, 11.6, 1), matSteel), 4, -9, 49);
  put(new T.Mesh(new T.BoxGeometry(11.4, 1, 10), matSteel), 4, -3.2, 45);
  cyl(2.2, 1.2, matSteelDk, 4, -9, 49.8, 'z');
  // Black connector plug beside the neck, on the -Z side
  put(new T.Mesh(new T.BoxGeometry(7, 7, 5), matCoil), 4, -16, 38.5);
  put(new T.Mesh(new T.BoxGeometry(5, 5, 1), matSteelDk), 4, -16, 35.6);
  // Casting detail: ribs on the bridge, parting-line rims on the barrels, bolt lugs on the lower body
  for (const z of [-6, 0, 6]) put(new T.Mesh(new T.BoxGeometry(14, 1.6, 1.8), matBlock), 0, 15.6, z);
  for (const s of [1, -1]) {
    cyl(15.3, 2, matBlock, -11, 4, s * 18);
    put(roundedBox(6, 5, 6, 1, matBlock), 12.5, -19.5, s * 33);
  }
  put(new T.Mesh(new T.BoxGeometry(24.4, 1.4, 66.4), matBlock), 0, -7, 0);

  vanosGrp.position.set(LEN / 2 - 4, headY + 4, 0);
  reg(vanosGrp, 'vanos-actuators');
}
