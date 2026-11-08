// Starter motor (Bosch-style, permanent-bore nose). Local X = starter axis, nose (pinion) toward -X.
export function build(c) {
  const { T, matSteel, matSteelDk, matAlu, matGold, matHose, reg, detail, LEN, blockY } = c;
  const g = new T.Group();
  const add = (geo, mat, x, y, z) => { const m = detail(new T.Mesh(geo, mat), g); m.position.set(x, y, z); return m; };
  // cylinder along X; rt (top) end points to -X, i.e. toward the flywheel
  const cyl = (rt, rb, h, mat, x, y = 0, z = 0, seg = 24) => {
    const m = add(new T.CylinderGeometry(rt, rb, h, seg), mat, x, y, z);
    m.rotation.z = Math.PI / 2;
    return m;
  };

  // Mounting flange (against block/bellhousing rear face) with two bolt ears
  add(new T.BoxGeometry(4, 32, 28), matAlu, 1, 0, 0);
  for (const [y, z] of [[12, -10], [-12, 10]]) {
    cyl(5, 5, 4, matAlu, 1, y * 1.15, z * 1.2, 16);     // ear boss
    cyl(2.7, 2.7, 3, matSteel, 4, y * 1.15, z * 1.2, 6); // hex bolt head
  }
  // Drive-end nose: tapering casting with the pinion on its tip
  cyl(7, 12.5, 12, matAlu, -6);
  cyl(2, 2, 14, matSteel, -9);                           // armature shaft
  cyl(5, 5, 7, matSteel, -8, 0, 0, 14);                  // pinion, in the ring gear plane
  // Motor yoke + end cap
  cyl(12.5, 12.5, 32, matSteelDk, 19);
  cyl(12.8, 12.8, 5, matAlu, 37);
  // Solenoid on top, bolted to a bracket cast into the nose
  add(new T.BoxGeometry(8, 8, 12), matAlu, 6, 12.5, 0);
  cyl(6.5, 6.5, 26, matSteel, 20, 18.5);
  cyl(6.9, 6.9, 3, matAlu, 7.5, 18.5);                   // solenoid front cap
  // Cable terminal: threaded stud + nut + copper lug + cable at the solenoid rear
  cyl(6.5, 6.5, 3, matSteelDk, 34.5, 18.5);
  cyl(1.8, 1.8, 7, matSteel, 38, 20, 0, 10);             // B+ stud
  cyl(3, 3, 2.5, matSteel, 40.5, 20, 0, 6);              // nut
  add(new T.BoxGeometry(1.2, 7, 5), matGold, 38.5, 17, 0); // lug
  add(new T.CylinderGeometry(2.2, 2.2, 18, 10), matHose, 38.5, 8, 0); // heavy cable down the tail
  cyl(1.2, 1.2, 8, matSteel, 36, 24, 3.5, 8);            // small terminal 50 spade stub

  // Axis 45 from crank centre (ring r40 + pinion r5), nose at ring-gear plane (flywheel x=-148)
  g.position.set(-LEN / 2, blockY - 18, 43.4);
  reg(g, 'starter-motor');
}
