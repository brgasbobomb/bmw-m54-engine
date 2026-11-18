// Airbox + MAF (E46 M54): black airbox in the intake-side front corner beside the radiator, MAF on its
// rear-inboard corner pointing back to the inlet boot (refs/engine-bay/notes.md). Both stay upright.
// Built from `bootEnd` (MAF rear face, returned by intake.js), axis along +X.
export function build(c) {
  const { T, matCover, matCoil, matIntake, matSteelDk, reg, detail, roundedBox, bootEnd, span, BW } = c;
  const { x: x0, y, z } = bootEnd;
  const alongX = geo => geo.rotateZ(-Math.PI / 2);   // cylinder axis Y -> X

  // MAF (HFM5): round black body between two flanges, sensor housing with its plug on top
  const L = 40;
  const maf = new T.Group();
  detail(new T.Mesh(alongX(new T.CylinderGeometry(17, 17, L, 28)), matCover), maf).position.set(x0 + L / 2, y, z);
  const flGeo = alongX(new T.CylinderGeometry(19.5, 19.5, 5, 28));   // front flange only: the boot clamps over the rear spigot
  detail(new T.Mesh(flGeo, matCover), maf).position.set(x0 + L - 2.5, y, z);
  detail(roundedBox(22, 9, 14, 2, matCover), maf).position.set(x0 + L / 2, y + 19, z);
  detail(roundedBox(9, 8, 10, 1.5, matCoil), maf).position.set(x0 + L / 2 - 13, y + 19, z);   // plug
  reg(maf, 'maf-sensor', false);

  // Airbox (multi-angle catalog photos, refs/airbox/notes.md): deep lower housing whose side profile tapers to a
  // rounded chamfer under the far end, flat lid plate overhanging on top, clips on the seam, round outlet neck high on
  // the MAF end, louvred inlet grille low on the far end, vertical channel rib on the outer side, bolt tab with grommets.
  const A = { x0: x0 + L + 6, x1: x0 + L + 6 + 0.36 * 6 * span, y0: 0, y1: 57, z0: z - 14, z1: z - 14 + 1.1 * BW }, seam = 45;
  const ax = (A.x0 + A.x1) / 2, az = (A.z0 + A.z1) / 2, aw = A.x1 - A.x0, ad = A.z1 - A.z0;
  const ab = new T.Group();
  const prof = new T.Shape();   // side profile in X-Y, extruded across Z
  prof.moveTo(A.x0, seam);
  prof.lineTo(A.x1, seam);
  prof.lineTo(A.x1, A.y0 + 30);
  prof.quadraticCurveTo(A.x1 - 4, A.y0, A.x1 - 34, A.y0);
  prof.lineTo(A.x0 + 10, A.y0);
  prof.quadraticCurveTo(A.x0, A.y0, A.x0, A.y0 + 12);
  prof.closePath();
  const lower = new T.ExtrudeGeometry(prof, { depth: ad - 6, bevelEnabled: true, bevelSize: 2, bevelThickness: 2, bevelSegments: 2, curveSegments: 10 });
  lower.translate(0, 0, A.z0 + 3);
  // taper: the housing narrows across Z toward the bottom (photos: sloping sides, not a slab)
  const pos = lower.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) - A.y0) / (seam - A.y0);
    pos.setZ(i, az + (pos.getZ(i) - az) * (0.72 + 0.28 * t));
  }
  lower.computeVertexNormals();
  detail(new T.Mesh(lower, matIntake), ab);
  detail(roundedBox(aw + 2, A.y1 - seam, ad + 2, 4, matIntake), ab).position.set(ax, (seam + A.y1) / 2, az);   // upper shell
  detail(roundedBox(aw + 5, 3, ad + 5, 1.5, matIntake), ab).position.set(ax, seam, az);                       // seam lip
  // lid: overhanging plate tilted down toward the far end, raised rim, bracket on the neck-end corner
  const lid = new T.Group();
  const matLid = new T.MeshStandardMaterial({ color: 0x141416, roughness: 0.92 });   // matte: matCover's sheen washed the flat top out to grey
  detail(roundedBox(aw + 6, 3, ad + 4, 3, matLid), lid);   // kept flat and low: intake runner #1 arches ~3 above it
  detail(roundedBox(aw - 10, 0.6, ad - 14, 0.3, matCoil), lid).position.y = 1.4;
  detail(roundedBox(16, 4, 10, 1.5, matLid), lid).position.set(-aw / 2 + 8, 2.5, ad / 2 - 4);
  lid.position.set(ax + 3, A.y1 + 1.5, az + 2);
  lid.rotation.z = -0.03;
  ab.add(lid);
  // outlet: flat boss on the end face, long ribbed neck
  detail(roundedBox(4, 30, 40, 4, matIntake), ab).position.set(A.x0 - 2, y, z);
  detail(new T.Mesh(alongX(new T.CylinderGeometry(18, 20, 16, 28)), matIntake), ab).position.set(A.x0 - 10, y, z);
  detail(new T.Mesh(new T.TorusGeometry(20.5, 1.6, 8, 28).rotateY(Math.PI / 2), matSteelDk), ab).position.set(A.x0 - 15, y, z);   // clamp: MAF flange to airbox neck
  for (const dx of [-8, -5]) detail(new T.Mesh(new T.TorusGeometry(19.8, 1.2, 6, 28).rotateY(Math.PI / 2), matIntake), ab).position.set(A.x0 + dx, y, z);
  const clipGeo = new T.BoxGeometry(8, 12, 3);
  for (const f of [0.2, 0.5, 0.8]) for (const zz of [A.z0 - 2, A.z1 + 2]) detail(new T.Mesh(clipGeo, matSteelDk), ab).position.set(A.x0 + f * aw, seam, zz);
  for (const f of [0.3, 0.7]) {
    const clip = detail(new T.Mesh(clipGeo, matSteelDk), ab);
    clip.rotation.y = Math.PI / 2;
    clip.position.set(A.x1 + 3, seam, A.z0 + f * ad);
  }
  // louvred inlet: deep ribbed block standing proud of the far end, upper half
  const ix = A.x1 + 5, iy = A.y0 + 40, ih = 26, iw = ad - 22;
  detail(roundedBox(10, ih, iw, 2, matIntake), ab).position.set(ix, iy, az);
  for (let i = 0; i < 7; i++) detail(new T.Mesh(new T.BoxGeometry(4, 1.6, iw - 4), matCover), ab).position.set(ix + 6, iy - ih / 2 + 2.5 + i * 3.5, az);
  // outer side: vertical channel rib; inner side: recessed panel
  detail(roundedBox(14, seam - 14, 5, 2, matIntake), ab).position.set(ax + 6, (seam + 14) / 2, A.z1 + 1.5);
  detail(roundedBox(4, seam - 18, 2, 1, matCover), ab).position.set(ax + 6, (seam + 14) / 2, A.z1 + 4);
  detail(roundedBox(aw * 0.5, 22, 2, 2, matCoil), ab).position.set(ax - 4, seam - 16, A.z0 + 1.5);
  // mounting: bolt tab with grommets on the neck end, arm reaching down from the bottom
  detail(roundedBox(3, 26, 30, 1.5, matIntake), ab).position.set(A.x0 - 1.5, 18, A.z1 - 14);
  for (const dz of [-8, 8]) detail(new T.Mesh(alongX(new T.CylinderGeometry(4, 4, 4, 12)), matCoil), ab).position.set(A.x0 - 3, 18, A.z1 - 14 + dz);
  const arm = detail(roundedBox(8, 30, 3, 1, matIntake), ab);
  arm.position.set(A.x0 + 18, A.y0 - 10, az + 10);
  arm.rotation.z = 0.35;
  detail(new T.Mesh(new T.CylinderGeometry(3.5, 3.5, 4, 12).rotateX(Math.PI / 2), matCoil), ab).position.set(A.x0 + 23, A.y0 - 23, az + 10);
  reg(ab, 'airbox', false);
}
