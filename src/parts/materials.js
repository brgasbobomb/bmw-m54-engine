// Shared materials. Add new ones here; every part file gets them via `c`.
export function makeMaterials(T) {
  // ===== Materials =====
  const matBlock    = new T.MeshStandardMaterial({ color: 0xd0d5db, metalness: 0.52, roughness: 0.45 }); // cast aluminum
  const matCover    = new T.MeshStandardMaterial({ color: 0x1f1f21, metalness: 0.12, roughness: 0.82 }); // matte black plastic
  const matCoverAcc = new T.MeshStandardMaterial({ color: 0xcfcaba, metalness: 0.80, roughness: 0.28 }); // silver styling accent
  const matIntake   = new T.MeshStandardMaterial({ color: 0x161618, metalness: 0.05, roughness: 0.88 }); // black intake manifold plastic
  const matExhaust  = new T.MeshStandardMaterial({ color: 0x8a7a6e, metalness: 0.72, roughness: 0.48 }); // heated stainless steel
  const matAlu      = new T.MeshStandardMaterial({ color: 0xe2e6eb, metalness: 0.78, roughness: 0.28 }); // bright aluminum
  const matAluDark  = new T.MeshStandardMaterial({ color: 0x767c85, metalness: 0.62, roughness: 0.48 }); // cast alloy dark
  const matSteel    = new T.MeshStandardMaterial({ color: 0xe0e4eb, metalness: 0.94, roughness: 0.18 }); // polished steel
  const matSteelDk  = new T.MeshStandardMaterial({ color: 0x38393e, metalness: 0.88, roughness: 0.32 }); // dark iron/steel
  const matBelt     = new T.MeshStandardMaterial({ color: 0x121213, metalness: 0.02, roughness: 0.94 }); // rubber
  const matCoil     = new T.MeshStandardMaterial({ color: 0x1a1a1c, metalness: 0.10, roughness: 0.78 }); // black plastic
  const matCeramic  = new T.MeshStandardMaterial({ color: 0xfbfaee, metalness: 0.12, roughness: 0.52 }); // white spark plug ceramic
  const matBlueCap  = new T.MeshStandardMaterial({ color: 0x1a3d90, metalness: 0.22, roughness: 0.50 }); // oil filter blue cap
  const matFace     = new T.MeshStandardMaterial({ color: 0x90969e, metalness: 0.65, roughness: 0.38 }); // pulley faces
  const matGold     = new T.MeshStandardMaterial({ color: 0xc89e4c, metalness: 0.85, roughness: 0.25 }); // brass/copper
  const matRadiator = new T.MeshStandardMaterial({ color: 0x242426, metalness: 0.25, roughness: 0.75 }); // radiator fins
  const matHose     = new T.MeshStandardMaterial({ color: 0x181819, metalness: 0.05, roughness: 0.85 }); // black coolant hoses
  return { matBlock, matCover, matCoverAcc, matIntake, matExhaust, matAlu, matAluDark, matSteel, matSteelDk, matBelt, matCoil, matCeramic, matBlueCap, matFace, matGold, matRadiator, matHose };
}
