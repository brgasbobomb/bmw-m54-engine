# BMW M54B30 3D engine viewer

Electron + Three.js r160. Procedural M54B30 built from primitives; each removable part is its own file.

## Where things are
- `src/parts/<part>.js` — geometry for one part. Each exports `build(c)`; `c` holds `T` (THREE),
  materials (`matBlock`, `matAlu`, …), helpers (`reg`, `detail`, `roundedBox`, `ribbedPulley`, …)
  and layout (`LEN`, `BW`, `BH`, `headY`, `coverY`, `span`, `cx(i)`).
- `src/parts/materials.js`, `helpers.js`, `layout.js` — shared. Read these only if the task needs them.
- `src/parts/index.js` — build order. A new part file must be imported and added to `PARTS` here.
- `src/app.js` — scene, camera, picking, removal animation, UI. Not needed for geometry work.
- `data/parts-database.json` — part names/specs shown in the UI. Part ids must match `reg(mesh, '<id>')`.
- `refs/<part>/` — reference photos + `notes.md`.

## Rules (keep sessions cheap)
1. One part per session. Read only that part's file plus whatever shared file it actually needs.
   Never read all of `src/parts/` or `app.js` to "get context".
2. Do not read `vendor/`, `node_modules/` or `models/`. Three.js API questions: answer from knowledge.
3. Reference photos: read `refs/<part>/notes.md` first. Open at most 1–2 photos, and only if the notes
   don't cover what you need. If you do look at photos, write what you learned into that `notes.md`
   before finishing, so the next session doesn't have to look again.
4. Make targeted edits (Edit tool) instead of rewriting whole files. Don't re-read a file after editing it.
5. Visual check = one `npm run shot` at the end, then look at the PNG.
6. New shared material/helper/dimension → add it to the shared file and return it from there.
   Something used only by one part stays in that part's file.
7. Axes inside part files: X = crank axis (+X = front/pulley end), Y = up, Z = intake (+) / exhaust (−).
   `index.js` mirrors the whole engine across Z once, so on screen the intake ends up on the car's
   left and the exhaust on the right, like the real E46. Keep writing parts with +Z = intake; never
   mirror a single part.
   Parts registered with `reg(mesh, id)` sit in the 30° slanted group; pass `false` as the
   third argument for parts that stay upright (radiator, expansion tank).
8. Commit after each finished part (`git commit`) so a bad change can be undone with git
   instead of a repair session.
9. Max 3 sessions per part. If a part is still wrong after 3, stop and list what's wrong instead of
   rebuilding again.
10. Commit after each working step, not only at the end.
11. Every `refs/<part>/notes.md` ends with a "Still off" list. Read it first in the next session on that part.
