// Radiator: aluminium crossflow core, plastic end tanks, fan shroud and belt-driven viscous fan.
// Core scaled to the E46 650x440x32 mm at 0.266 u/mm in Y and X; Z width capped at ±69 by hoses.js necks and the expansion tank (x ±6, y ±64, z ±69) so the expansion tank beside it still lines up.
export function build(c) {
  const { T, matCover, matSteelDk, matRadiator, reg, detail, radX, radY, fanMount } = c;
  // Fan axis = water pump fan boss (front-drive.js), in this group's frame
  const fy = fanMount.y - radY, fz = fanMount.z;
  const radGrp = new T.Group();

  // Core: fine vertical fins between horizontal tube rows, drawn into a texture.
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const g = cv.getContext('2d');
  g.fillStyle = '#4a4d50'; g.fillRect(0, 0, 128, 128);
  g.fillStyle = '#9a9da0';
  for (let x = 0; x < 128; x += 4) g.fillRect(x, 0, 1, 128);       // fins
  g.fillStyle = '#2a2c2e';
  for (let y = 0; y < 128; y += 16) g.fillRect(0, y, 128, 2);      // tube rows
  const tex = new T.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = T.RepeatWrapping;
  tex.repeat.set(2, 1.6);
  tex.colorSpace = T.SRGBColorSpace;
  tex.anisotropy = 8;
  const matCore = matRadiator.clone();
  matCore.map = tex; matCore.color.set(0xffffff);
  detail(new T.Mesh(new T.BoxGeometry(8.5, 116, 122), matCore), radGrp);

  // Top & bottom rails
  [61, -61].forEach(y => { detail(new T.Mesh(new T.BoxGeometry(14, 6, 138), matCover), radGrp).position.y = y; });

  // End tanks (crossflow: left/right) with ribs, hose necks and the expansion-tank nipple
  [-1, 1].forEach(s => {
    const tank = detail(new T.Mesh(new T.BoxGeometry(13, 116, 8), matCover), radGrp);
    tank.position.z = s * 65;
    for (let y = -40; y <= 40; y += 20) {
      const rib = detail(new T.Mesh(new T.BoxGeometry(14, 3, 9), matCover), radGrp);
      rib.position.set(0, y, s * 65);
    }
    // Neck points rearward (-X); y/z/x match the hose end points in hoses.js. Upper = -Z, lower = +Z.
    const neck = detail(new T.Mesh(new T.CylinderGeometry(7.5, 7.5, 13.5, 16), matCover), radGrp);
    neck.rotation.z = Math.PI / 2;
    neck.position.set(-13.25, s < 0 ? 38 : -38, s * 65);
  });
  // Nipple into the expansion tank (z 70…92, x -20…6, y 12…56 in this group's frame)
  const nip = detail(new T.Mesh(new T.CylinderGeometry(3, 3, 3, 12), matSteelDk), radGrp);
  nip.rotation.x = Math.PI / 2;
  nip.position.set(-4, 34, 70);

  // Fan shroud: plate with a round opening, plus the fan ring behind it
  const shape = new T.Shape();
  shape.moveTo(-66, -50); shape.lineTo(66, -50); shape.lineTo(66, 50); shape.lineTo(-66, 50); shape.closePath();
  const hole = new T.Path(); hole.absarc(-fz, fy, 44, 0, Math.PI * 2, true); shape.holes.push(hole);
  const plate = detail(new T.Mesh(new T.ExtrudeGeometry(shape, { depth: 3, bevelEnabled: false, curveSegments: 40 }), matCover), radGrp);
  plate.rotation.y = Math.PI / 2;   // extrude along +X
  plate.position.x = -9;
  const matRing = matCover.clone(); matRing.side = T.DoubleSide;
  const ring = detail(new T.Mesh(new T.CylinderGeometry(45, 45, 13, 40, 1, true), matRing), radGrp);
  ring.rotation.z = Math.PI / 2;
  ring.position.set(-15.5, fy, fz);

  // Belt-driven viscous fan: clutch hub, 9 pitched blades, short drive stub toward the water pump
  const fan = new T.Group();
  fan.position.set(-17, fy, fz);
  const hub = detail(new T.Mesh(new T.CylinderGeometry(12, 12, 9, 24), matSteelDk), fan);
  hub.rotation.z = Math.PI / 2; hub.position.x = -4;
  const s0 = fanMount.x - radX + 17;   // pump boss nose, in fan-group x
  const stub = detail(new T.Mesh(new T.CylinderGeometry(3.5, 3.5, -8.5 - s0, 12), matSteelDk), fan);
  stub.rotation.z = Math.PI / 2; stub.position.x = (s0 - 8.5) / 2;
  for (let b = 0; b < 9; b++) {
    const arm = new T.Group();
    arm.rotation.x = (b / 9) * Math.PI * 2;
    const blade = detail(new T.Mesh(new T.BoxGeometry(1.2, 32, 10), matCover), arm);
    blade.position.y = 28;
    blade.rotation.y = 0.5;   // pitch
    fan.add(arm);
  }
  radGrp.add(fan);

  radGrp.position.set(radX, radY, 0);
  reg(radGrp, 'radiator', false); // Radiator sits straight, NOT slanted!
}
