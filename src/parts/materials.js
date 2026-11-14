// Shared materials. Add new ones here; every part file gets them via `c`.
export function makeMaterials(T) {
  // Procedural textures (no geometry change): fine grain for cast/plastic, mottled heat tint for exhaust.
  const tex = (n, px) => {
    const d = new Uint8Array(n * n * 4);
    for (let i = 0; i < n * n; i++) d.set(px(i % n, (i / n) | 0), i * 4);
    const t = new T.DataTexture(d, n, n);
    t.wrapS = t.wrapT = T.RepeatWrapping;
    t.needsUpdate = true;
    return t;
  };
  const grain = tex(256, () => { const v = 225 + Math.random() * 30; return [v, v, v, 255]; }); // roughness 0.88..1 x base
  grain.repeat.set(6, 6);
  const lerp = (a, b, k) => a.map((x, i) => x + (b[i] - x) * k);
  const heat = tex(128, (x, y) => {
    // smooth wavy bands: straw -> bronze -> blue/purple -> grey, like heat-tinted stainless
    const k = (Math.sin(x / 128 * 6.283 * 2 + Math.sin(y / 128 * 6.283 * 3) * 1.5) + 1) / 2 * 3;
    const C = [[195, 178, 140], [168, 136, 108], [124, 120, 142], [152, 152, 155]];
    const i = Math.min(2, k | 0);
    return [...lerp(C[i], C[i + 1], k - i).map(Math.round), 255];
  });
  heat.colorSpace = T.SRGBColorSpace;
  const cast = { roughnessMap: grain, bumpMap: grain, bumpScale: 0.15 };

  // ===== Materials =====
  const matBlock    = new T.MeshStandardMaterial({ color: 0xc8ccd1, metalness: 0.6, roughness: 0.7, ...cast }); // cast aluminium: matte, grainy
  const matCover    = new T.MeshStandardMaterial({ color: 0x1c1c1e, metalness: 0.0, roughness: 0.55, roughnessMap: grain }); // black plastic, soft sheen
  const matCoverAcc = new T.MeshStandardMaterial({ color: 0xcfcaba, metalness: 0.80, roughness: 0.28 }); // silver styling accent
  const matIntake   = new T.MeshStandardMaterial({ color: 0x18181a, metalness: 0.0, roughness: 0.62, roughnessMap: grain }); // black intake manifold plastic
  const matExhaust  = new T.MeshStandardMaterial({ color: 0xffffff, map: heat, metalness: 1.0, roughness: 0.42, roughnessMap: grain }); // heat-tinted stainless
  const matAlu      = new T.MeshStandardMaterial({ color: 0xe4e7eb, metalness: 1.0, roughness: 0.2 }); // machined aluminium
  const matAluDark  = new T.MeshStandardMaterial({ color: 0x80868e, metalness: 0.6, roughness: 0.66, ...cast }); // cast alloy dark
  const matSteel    = new T.MeshStandardMaterial({ color: 0xd8dce2, metalness: 1.0, roughness: 0.22 }); // steel
  const matSteelDk  = new T.MeshStandardMaterial({ color: 0x3a3b40, metalness: 0.9, roughness: 0.42 }); // dark iron/steel
  const matBelt     = new T.MeshStandardMaterial({ color: 0x141414, metalness: 0.0, roughness: 1.0, side: T.DoubleSide }); // rubber, no sheen
  const matCoil     = new T.MeshStandardMaterial({ color: 0x1a1a1c, metalness: 0.0, roughness: 0.5 }); // black plastic
  const matCeramic  = new T.MeshStandardMaterial({ color: 0xfbfaee, metalness: 0.12, roughness: 0.52 }); // white spark plug ceramic
  const matBlueCap  = new T.MeshStandardMaterial({ color: 0x1a3d90, metalness: 0.22, roughness: 0.50 }); // oil filter blue cap
  const matFace     = new T.MeshStandardMaterial({ color: 0x90969e, metalness: 1.0, roughness: 0.3 }); // pulley faces (machined)
  const matGold     = new T.MeshStandardMaterial({ color: 0xc89e4c, metalness: 0.85, roughness: 0.25 }); // brass/copper
  const matRadiator = new T.MeshStandardMaterial({ color: 0x242426, metalness: 0.25, roughness: 0.75 }); // radiator fins
  const matHose     = new T.MeshStandardMaterial({ color: 0x141414, metalness: 0.0, roughness: 1.0 }); // rubber coolant hoses, no sheen
  return { matBlock, matCover, matCoverAcc, matIntake, matExhaust, matAlu, matAluDark, matSteel, matSteelDk, matBelt, matCoil, matCeramic, matBlueCap, matFace, matGold, matRadiator, matHose };
}
