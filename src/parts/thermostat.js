// Thermostat housing (E46 M54, OEM 11531436823): cast-alu flange + two necks, exposed thermostat, 2-pin sensor
export function build(c) {
  const { T, matAlu, matHose, reg, detail, LEN, headY } = c;
  const g = new T.Group();
  const ORG = new T.Vector3(LEN / 2 + 2, headY, -8);
  const matBrass = new T.MeshStandardMaterial({ color: 0xb8892f, metalness: 0.8, roughness: 0.35 });
  const matBolt = new T.MeshStandardMaterial({ color: 0x8a8d90, metalness: 0.9, roughness: 0.4 });
  const add = (geo, mat, pos, rot) => {
    const m = detail(new T.Mesh(geo, mat), g);
    m.position.copy(pos);
    if (rot) m.rotation.set(...rot);
    return m;
  };
  const V = (x, y, z) => new T.Vector3(x, y, z);

  // Elbowed neck: polyline of cylinders joined by ball elbows; ribbed hose-bead rings on the last leg.
  const neck = (pts, r) => {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], d = b.clone().sub(a);
      const q = new T.Quaternion().setFromUnitVectors(V(0, 1, 0), d.clone().normalize());
      add(new T.CylinderGeometry(r, r, d.length(), 16), matAlu, a.clone().add(b).multiplyScalar(0.5)).quaternion.copy(q);
      if (i > 0) add(new T.SphereGeometry(r, 14, 10), matAlu, a);
      if (i === pts.length - 2) for (const t of [0.75, 0.93]) {
        const ring = add(new T.TorusGeometry(r * 1.05, 0.9, 6, 16), matAlu, a.clone().lerp(b, t));
        ring.quaternion.copy(q).multiply(new T.Quaternion().setFromAxisAngle(V(1, 0, 0), Math.PI / 2));
      }
    }
  };

  // Opposed elbows: upper goes up/rearward (-Z) then turns to the front (+X); lower drops straight down then turns to the front.
  // Tips must match the hose start points in hoses.js (tip minus 4 along the last leg).
  neck([V(0, 0, 0), V(0, 6, -16), V(16, 6, -24)], 6.2);
  neck([V(0, 0, 0), V(0, -20, 2), V(14, -24, 4)], 6.2);

  // Flange plate + body (plate lies in the YZ plane, faces +X)
  add(new T.CylinderGeometry(11, 11, 6, 20), matAlu, V(0, 0, 0), [0, 0, Math.PI / 2]);
  add(new T.BoxGeometry(6, 8, 30), matAlu, V(0, 0, 4));
  // Raised rim around the open thermostat bay
  add(new T.TorusGeometry(10, 1.4, 6, 24), matAlu, V(3.5, 0, 0), [0, Math.PI / 2, 0]);

  // Thermostat: brass pin, coil spring, cap disc, two cast frame arms
  add(new T.CylinderGeometry(1.8, 1.8, 14, 10), matBrass, V(9, 0, 0), [0, 0, Math.PI / 2]);
  add(new T.TorusGeometry(4.5, 0.7, 6, 14), matBolt, V(8, 0, 0), [0, Math.PI / 2, 0]);
  add(new T.TorusGeometry(4.5, 0.7, 6, 14), matBolt, V(11, 0, 0), [0, Math.PI / 2, 0]);
  add(new T.CylinderGeometry(9, 9, 1.2, 18), matBolt, V(17, 0, 0), [0, 0, Math.PI / 2]);
  for (const s of [-1, 1]) add(new T.BoxGeometry(12, 2.5, 1.8), matAlu, V(10, 0, 9 * s));

  // Temperature sensor: short boss under the left neck + black 2-pin connector
  add(new T.CylinderGeometry(3.2, 3.2, 8, 10), matAlu, V(2, -9, 6), [0, 0, 0]);
  add(new T.BoxGeometry(6, 7, 9), matHose, V(2, -16, 6));
  add(new T.BoxGeometry(1, 3, 2.2), matBolt, V(5.2, -16, 6));

  // Mounting bolts: 3 hex heads on the flange
  for (const [y, z] of [[10, -9], [-10, -9], [0, 17]])
    add(new T.CylinderGeometry(2.2, 2.2, 2.4, 6), matBolt, V(3.4, y, z), [0, 0, Math.PI / 2]);

  g.position.copy(ORG);
  reg(g, 'thermostat');
}
