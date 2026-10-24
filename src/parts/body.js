// E46 saloon body shell (naked: no wheels, lights, trim) + bonnet as its own part.
// Lofted station by station along X (nose +X, tail -X, open underneath), 1 unit ≈ 3 mm,
// ground at y = -125. Glass and bonnet are index subsets of the same vertex grid.
// shortcut: no door shut lines, grille or lamp openings; add them as separate parts if needed.
export function build(c) {
  const { T, reg, matBody, matGlass } = c;
  const X0 = 340, STEP = 6, N = 251;           // nose x=340 … tail x=-1160
  const XCOWL = -120, XB = -480, AXLES = [63, -845], RA = 113, YC = -18, YB0 = -80, YROOF = 347;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const keys = (ks, x) => { // piecewise-linear over descending x keys
    for (let i = 0; i < ks.length - 1; i++) {
      if (x <= ks[i][0] && x >= ks[i + 1][0]) return ks[i][1] + (ks[i + 1][1] - ks[i][1]) * (ks[i][0] - x) / (ks[i][0] - ks[i + 1][0]);
    }
    return ks[ks.length - 1][1];
  };
  const blur = (a, r, passes) => {
    for (let p = 0; p < passes; p++) {
      const o = a.slice();
      for (let i = 0; i < a.length; i++) {
        let s = 0, n = 0;
        for (let k = -r; k <= r; k++) { const j = clamp(i + k, 0, a.length - 1); s += o[j]; n++; }
        a[i] = s / n;
      }
    }
    return a;
  };

  const BELT = [[340, 100], [260, 128], [-120, 160], [-200, 185], [-500, 205], [-800, 205], [-900, 196], [-1060, 200], [-1160, 192]];
  const xs = [], W = [], yb = [], yBelt = [], g = [];
  for (let i = 0; i < N; i++) {
    const x = X0 - i * STEP;
    let w = 290;
    if (x > 210) w *= 1 - 0.22 * ((x - 210) / 130) ** 2;
    if (x < -1000) w *= 1 - 0.18 * ((-1000 - x) / 160) ** 2;
    let b = YB0;
    for (const xa of AXLES) { const dx = x - xa; if (Math.abs(dx) < RA) b = Math.max(b, YC + Math.sqrt(RA * RA - dx * dx)); }
    if (x > 230) b = Math.max(b, YB0 + 0.45 * (x - 230));
    if (x < -1050) b = Math.max(b, YB0 + 0.3 * (-1050 - x));
    xs.push(x); W.push(w); yb.push(b); yBelt.push(keys(BELT, x));
    g.push(Math.min(clamp((XCOWL - x) / 205, 0, 1), clamp((x + 910) / 170, 0, 1))); // 0 = bonnet/deck, 1 = full greenhouse
  }
  blur(yBelt, 4, 2); blur(g, 2, 2);

  // 8 points per side, p0 rocker … p7 roof centre; mirrored to 15 per station.
  const NP = 15;
  const pos = [];
  for (let i = 0; i < N; i++) {
    const w = W[i], yB = yBelt[i], gi = g[i], wh = w * 0.97 * 0.98;
    const p = [[w, yb[i]], [w, (yb[i] + yB) / 2], [w * 0.985, yB]];
    const hood = [1, 0.75, 0.5, 0.25, 0].map(f => [wh * f, yB + 2 + 10 * (1 - f * f)]);
    const cab = [[w * 0.88, yB + 3], [w * 0.8, YROOF - 12], [w * 0.63, YROOF], [w * 0.35, YROOF + 5], [0, YROOF + 7]];
    for (let k = 0; k < 5; k++) p.push([hood[k][0] * (1 - gi) + cab[k][0] * gi, hood[k][1] * (1 - gi) + cab[k][1] * gi]);
    for (let k = 0; k < NP; k++) { const q = p[k <= 7 ? k : 14 - k]; pos.push(xs[i], q[1], k <= 7 ? q[0] : -q[0]); }
  }

  const paint = [], glass = [], hood = [];
  for (let i = 0; i < N - 1; i++) {
    const xm = (xs[i] + xs[i + 1]) / 2, gm = (g[i] + g[i + 1]) / 2;
    for (let j = 0; j < NP - 1; j++) {
      const jj = j <= 6 ? j : 13 - j, a = i * NP + j, b = a + 1, d = a + NP, e = d + 1;
      let dst = paint;
      if (xm > XCOWL && jj >= 3) dst = hood;
      else if (jj === 3 && gm > 0.12 && Math.abs(xm - XB) > 12 && !(xm < -740 && gm < 0.35)) dst = glass; // side glass, B/C pillars stay paint
      else if (jj >= 5 && gm > 0.07 && gm < 0.93) dst = glass;                                         // windscreen / backlight
      dst.push(a, d, b, b, d, e);
    }
  }

  const full = new T.BufferGeometry();
  full.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
  full.setIndex(paint.concat(glass, hood));
  full.computeVertexNormals();
  const sub = (idx, mat) => {
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', full.attributes.position);
    geo.setAttribute('normal', full.attributes.normal);
    geo.setIndex(idx);
    const m = new T.Mesh(geo, mat); m.receiveShadow = true;
    return m;
  };
  const cap = (i) => { // flat end face: fan around the section centroid
    const v = [], idx = [];
    let cy = 0;
    for (let k = 0; k < NP; k++) { v.push(pos[(i * NP + k) * 3], pos[(i * NP + k) * 3 + 1], pos[(i * NP + k) * 3 + 2]); cy += pos[(i * NP + k) * 3 + 1] / NP; }
    v.push(xs[i], cy, 0);
    for (let k = 0; k < NP; k++) idx.push(NP, k, (k + 1) % NP);
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(v, 3));
    geo.setIndex(idx); geo.computeVertexNormals();
    return new T.Mesh(geo, matBody);
  };
  const plane = (w, h, rx, ry, x, y) => {
    const m = new T.Mesh(new T.PlaneGeometry(w, h), matBody);
    m.rotation.set(rx, ry, 0); m.position.set(x, y, 0);
    return m;
  };

  const body = new T.Group();
  body.add(sub(paint, matBody), sub(glass, matGlass), cap(0), cap(N - 1),
    plane(500, 245, 0, Math.PI / 2, -185, 42),          // firewall
    plane(870, 480, -Math.PI / 2, 0, -620, YB0 + 8));   // floor pan
  reg(body, 'car-body', false);
  reg(sub(hood, matBody), 'bonnet', false);
}
