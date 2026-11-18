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

  // Airbox: lower housing + lid on a seam lip with clips, outlet neck for the MAF on the rear face, inlet snorkel
  // low on the front face. Inboard face z0 stays clear of the expansion tank (z ≤ 92).
  // Size from the photos: airbox length ≈ 0.33 × valve cover length (6·span), width ≈ 1.1 × BW, low (refs/airbox/notes.md).
  const A = { x0: x0 + L + 6, x1: x0 + L + 6 + 0.33 * 6 * span, y0: 14, y1: 52, z0: z - 20, z1: z - 20 + 1.1 * BW }, seam = 32;
  const ax = (A.x0 + A.x1) / 2, az = (A.z0 + A.z1) / 2, aw = A.x1 - A.x0, ad = A.z1 - A.z0;
  const ab = new T.Group();
  detail(roundedBox(aw - 4, seam - A.y0, ad - 4, 6, matIntake), ab).position.set(ax, (A.y0 + seam) / 2, az);
  detail(roundedBox(aw, A.y1 - seam, ad, 6, matIntake), ab).position.set(ax, (seam + A.y1) / 2, az);
  detail(roundedBox(aw + 3, 3, ad + 3, 1.5, matIntake), ab).position.set(ax, seam, az);
  detail(new T.Mesh(alongX(new T.CylinderGeometry(18, 19, 6, 28)), matIntake), ab).position.set(A.x0 - 3, y, z);
  const clipGeo = new T.BoxGeometry(8, 12, 3);
  for (const f of [0.2, 0.5, 0.8]) detail(new T.Mesh(clipGeo, matSteelDk), ab).position.set(A.x0 + f * aw, seam, A.z1 + 2);
  for (const f of [0.3, 0.7]) {
    const clip = detail(new T.Mesh(clipGeo, matSteelDk), ab);
    clip.rotation.y = Math.PI / 2;
    clip.position.set(A.x1 + 2, seam, A.z0 + f * ad);
  }
  // From the photos (refs/airbox/notes.md): flat lid plate proud of the box, ribbed outlet neck, grille slats low on
  // the front, cold-air snorkel elbow rising from the front face, mounting tab with two bolts under the box.
  detail(roundedBox(aw - 8, A.y1 - seam - 4, 2.5, 4, matIntake), ab).position.set(ax, (seam + A.y1) / 2, A.z1 + 1.2);
  for (const dx of [-3, 0, 3]) detail(new T.Mesh(new T.TorusGeometry(18.6, 0.9, 6, 28).rotateY(Math.PI / 2), matIntake), ab).position.set(A.x0 - 3 + dx, y, z);
  for (let i = 0; i < 5; i++) detail(new T.Mesh(new T.BoxGeometry(1.4, 8, ad - 24), matIntake), ab).position.set(A.x1 + 0.8, A.y0 + 8 + i * 3.5, az);
  const sn = new T.CatmullRomCurve3([new T.Vector3(A.x1 - 2, 42, A.z0 + 14), new T.Vector3(A.x1 + 14, 46, A.z0 + 14), new T.Vector3(A.x1 + 24, 62, A.z0 + 14), new T.Vector3(A.x1 + 26, 78, A.z0 + 14)]);
  detail(new T.Mesh(new T.TubeGeometry(sn, 20, 10, 16, false), matIntake), ab);
  detail(roundedBox(30, 3, 16, 2, matIntake), ab).position.set(ax, A.y0 - 1.5, az);
  for (const dx of [-10, 10]) detail(new T.Mesh(new T.CylinderGeometry(2.4, 2.4, 3, 8), matSteelDk), ab).position.set(ax + dx, A.y0 - 3, az);
  reg(ab, 'airbox', false);
}
