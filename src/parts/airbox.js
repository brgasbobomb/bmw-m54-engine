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
  const A = { x0: x0 + L + 6, x1: x0 + L + 6 + 0.36 * 6 * span, y0: 0, y1: 66, z0: z - 20, z1: z - 20 + 1.1 * BW }, seam = 54;
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
  detail(new T.Mesh(lower.translate(0, 0, A.z0 + 3), matIntake), ab);
  detail(roundedBox(aw + 2, A.y1 - seam, ad + 2, 4, matIntake), ab).position.set(ax, (seam + A.y1) / 2, az);   // upper shell
  detail(roundedBox(aw + 5, 3, ad + 5, 1.5, matIntake), ab).position.set(ax, seam, az);                       // seam lip
  detail(roundedBox(aw + 10, 3, ad + 10, 3, matIntake), ab).position.set(ax, A.y1 + 1.5, az);                 // lid plate
  detail(new T.Mesh(alongX(new T.CylinderGeometry(18, 19, 12, 28)), matIntake), ab).position.set(A.x0 - 6, y, z);
  detail(new T.Mesh(new T.TorusGeometry(20.5, 1.6, 8, 28).rotateY(Math.PI / 2), matSteelDk), ab).position.set(A.x0 - 8, y, z);   // clamp: MAF flange to airbox neck
  for (const dx of [-3, 0, 3]) detail(new T.Mesh(new T.TorusGeometry(18.6, 0.9, 6, 28).rotateY(Math.PI / 2), matIntake), ab).position.set(A.x0 - 3 + dx, y, z);
  const clipGeo = new T.BoxGeometry(8, 12, 3);
  for (const f of [0.2, 0.5, 0.8]) for (const zz of [A.z0 - 2, A.z1 + 2]) detail(new T.Mesh(clipGeo, matSteelDk), ab).position.set(A.x0 + f * aw, seam, zz);
  for (const f of [0.3, 0.7]) {
    const clip = detail(new T.Mesh(clipGeo, matSteelDk), ab);
    clip.rotation.y = Math.PI / 2;
    clip.position.set(A.x1 + 3, seam, A.z0 + f * ad);
  }
  // louvred inlet: stepped slats low on the far end, each one longer than the one above
  for (let i = 0; i < 6; i++) detail(new T.Mesh(new T.BoxGeometry(4 + i * 1.2, 1.6, ad - 20), matIntake), ab).position.set(A.x1 + 1 + i * 0.6, A.y0 + 30 + i * 3.4, az);
  detail(roundedBox(14, seam - 14, 5, 2, matIntake), ab).position.set(ax + 6, (seam + 14) / 2, A.z1 + 1.5);    // channel rib, outer side
  detail(roundedBox(4, seam - 18, 2, 1, matCover), ab).position.set(ax + 6, (seam + 14) / 2, A.z1 + 4);
  detail(roundedBox(3, 26, 30, 1.5, matIntake), ab).position.set(A.x0 - 1.5, 22, A.z1 - 18);                  // bolt tab on the MAF end
  for (const dz of [-8, 8]) detail(new T.Mesh(alongX(new T.CylinderGeometry(4, 4, 4, 12)), matCoil), ab).position.set(A.x0 - 3, 22, A.z1 - 18 + dz);
  reg(ab, 'airbox', false);
}
