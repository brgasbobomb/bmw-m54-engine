// Oil filter housing & cooler
export function build(c) {
  const { T, matCover, matAlu, matSteel, reg, detail, LEN, BW, blockY } = c;
  // ----- OIL FILTER HOUSING (Detailed housing + cooler exchanger) -----
  const ofGrp = new T.Group();
  // Silver adapter block
  detail(new T.Mesh(new T.BoxGeometry(18, 22, 14), matAlu), ofGrp);
  // Filter canister cylinder
  const ofCan = detail(new T.Mesh(new T.CylinderGeometry(12, 12, 28, 20), matAlu), ofGrp);
  ofCan.position.set(0, 16, 0);
  // Black canister cap with ridges
  const ofCap = detail(new T.Mesh(new T.CylinderGeometry(12.5, 12.5, 6, 20), matCover), ofGrp);
  ofCap.position.set(0, 31, 0);
  for (let r = 0; r < 8; r++) {
    const a = (r / 8) * Math.PI * 2;
    const ridge = detail(new T.Mesh(new T.BoxGeometry(2, 6, 1), matCover), ofGrp);
    ridge.position.set(Math.cos(a) * 12.2, 31, Math.sin(a) * 12.2);
    ridge.rotation.y = -a;
  }
  // Oil-to-coolant heat exchanger block (rectangular silver box on housing)
  const cooler = detail(new T.Mesh(new T.BoxGeometry(16, 12, 26), matSteel), ofGrp);
  cooler.position.set(-6, 2, 16);

  ofGrp.position.set(LEN / 2 - 58, blockY + 12, BW / 2 + 15);
  reg(ofGrp, 'oil-filter');
}
