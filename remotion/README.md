# Third Country / Removal Trace — video

A Remotion (React) project that renders the animated explainer for the blog
post on *DHS v. D.V.D.*, No. 26-426. Every frame is deterministic and renders
to MP4. This workspace is isolated from the Next.js site (its own
`package.json` and toolchain) but reads the **same data** the posts use.

## Status

- **Phase 0 — data** ✅ `../src/data/third-country/animation-cases.json` (9
  documented cases, 3 main + 6 rapid) plus a typed loader that joins
  coordinates from `routes.json`.
- **Phase 1 — scaffold** ✅ this workspace, theme, backdrop, composition
  registry. Each composition currently renders a `ScaffoldStatus` placeholder
  that reads live totals from the data files to prove the toolchain works.
- **Phase 2+ — globe, beats, HUD panels, swarm, end card, vertical cut** — not
  yet built. See the plan in the chat / `../third party removal/`.

## Install

```bash
cd remotion
npm install
```

The first `render` also downloads a headless Chromium (one time).

## Develop

```bash
npm run studio      # opens Remotion Studio to preview compositions
npm run typecheck   # tsc --noEmit
```

## Render

```bash
npm run render:test      # 10s Ansumana S. proof-of-look  -> out/ansumana-test.mp4
npm run render:main      # 75s 1920x1080 master           -> out/main-16x9.mp4
npm run render:vertical  # 75s 1080x1350 vertical cut      -> out/vertical-4x5.mp4
```

## Compositions

| id            | size       | length | purpose                         |
| ------------- | ---------- | ------ | ------------------------------- |
| `Main16x9`    | 1920×1080  | 75s    | master                          |
| `Vertical4x5` | 1080×1350  | 75s    | vertical cut (reflowed HUD)     |
| `AnsumanaTest`| 1920×1080  | 10s    | single-beat approval render     |

## Data contract

- `../src/data/third-country/routes.json` — 231 routes, 92 country coords,
  destinations, cases (the posts' source of truth; **do not fork it here**).
- `../src/data/third-country/circuits.json` — SCOTUS info + timeline.
- `../src/data/third-country/animation-cases.json` — featured-case records for
  the video. Lean by design: coordinates are joined from `routes.json` by ISO3
  at runtime in `src/data/loader.ts`.

### Accuracy rules (enforced by the data, not the renderer)

- Only facts present in a case's `sources` are animated. `usLocation` is `null`
  for every current case (no public detention site), so those pins land on the
  U.S. centroid labeled **LOCATION NOT PUBLIC**.
- Counts are **documented minimums**.
- No faces; only names already in court records or press.
- Cases from the original brief with no repo source (Alves, Natalia E.,
  Etoria) and the South Sudan Djibouti layover are intentionally omitted until
  a source is supplied. Add a case object to `animation-cases.json` and it
  renders with no code change.

## Theme

`src/theme.ts` is the only place colors, type, easing, grid, and layout live.
Two accents only: **red `#ff3b30`** = a country the person is protected from;
**white + glow** = the actual destination. Everything else is greyscale.

## Fonts

The theme requests IBM Plex Mono / JetBrains Mono with a monospace fallback.
For pixel-exact renders, wire `@remotion/google-fonts/IBMPlexMono` in Phase 2.
