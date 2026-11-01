<div align="center">

# Manan Kochhar — Portfolio

**Systems that see, hear and respond.**

Formula 1 engineering language applied to a computer-vision and voice-AI portfolio.

`React 19` · `Vite 8` · `Tailwind v4` · `Three.js / R3F` · `Framer Motion` · `Lenis`

</div>

---

## The idea

Not racing stickers — racing *engineering*. The visual grammar is pit-wall
instrumentation: hairline rules, corner registration marks, monospace data
labels, machined 2px radii, and notched panels. Red is a signal, never a
surface. Sector colours (purple / green / amber) carry F1 timing semantics and
are used **only** for data, never for decoration.

## Hero — the aero field

The centrepiece is a wind tunnel that is actually solved, not a car model and
not a curve shaped to look like flow.

Every frame, an incompressible Navier–Stokes field is computed on the GPU over
a 22 × 11 world-unit domain at 256 × 128 — Stam's stable fluids, in the order
GPU Gems 38 sets out: semi-Lagrangian advection, forces, vorticity
confinement, divergence, twenty Jacobi pressure sweeps, then subtract the
pressure gradient so the field comes out divergence-free. 8,192 streaklines are
carried through the result. They go where the solver sends them, which is why
the wake sheds on its own rather than being told to.

The body is a real NACA 4-digit symmetric section at thirteen degrees, held at
no-slip. An ellipse has no trailing edge, and the trailing edge is the thing
that sheds.

Measured on the running page rather than asserted:

| | |
|---|---|
| Shedding frequency | ~0.67 Hz — St ≈ 0.25 on `D = c·sin α`, the canonical band |
| Disturbed air | 27% of the visible frame |
| Frame time | 13.3 ms mean, 14.3 ms p95, no frame over 20 ms |
| Draw calls for 8,192 streaks | 1 |

Colour is speed relative to freestream, split either side of it: acceleration
over the suction surface heats toward red, and the momentum deficit in the wake
gives up brightness. Both are the quantity a CFD velocity-magnitude map plots.
The pointer pushes the air with its own travel velocity, so a cursor sitting
still disturbs nothing.

- Thirteen degrees is past the stall angle, deliberately. At a believable
  cruise incidence the disturbance measured four per cent of the frame:
  correct, and invisible.
- Camera drifts toward the pointer on a heavy lerp — long-lens feel.
- `frameloop` is cut dead when the hero scrolls out of view.
- Three.js is lazily imported and mounted on idle, so it never touches the
  critical path.

## Performance

| | |
|---|---|
| Critical path (gzip) | **151 kB** — React, Framer Motion, app and CSS |
| Deferred (gzip) | ~238 kB — three + R3F, desktop only, after idle |
| Deferred (gzip) | ~6 kB — the fluid solver and its shaders |
| Deferred (gzip) | ~15 kB — case studies, on `/work/*` only |
| 3D gating | WebGL + not mobile + not reduced-motion + >4 cores |
| Fallback | Inline SVG streamlines — no script, no request |
| Pointer tracking | Ref-based rAF lerp — **zero re-renders** |
| Marquee | Pure CSS, never touches the main thread |

That first row was wrong until it was measured. Naming a vendor group in the
rolldown config also enlists it in the entry's preload graph, so the build was
emitting `<link rel="modulepreload">` for three and R3F into every page's head.
The lazy import was intact and completely undone: 238 kB gzip of WebGL fetched
during first paint, on phones that never render it, under
`prefers-reduced-motion`, and on case-study routes that have no canvas at all.
First load was 389 kB rather than the 151 kB this file claimed.

`build.modulePreload.resolveDependencies` now strips those two from the HTML
entry's hints only — React and Framer Motion stay preloaded because they really
are the critical path, and the hero's own dynamic import still preloads three
when it is the thing being fetched. Measured first contentful paint went from
3.3 s to 2.6 s under Lighthouse's mobile throttling.

## Audited, not assumed

Lighthouse 12.8 on the production build, mobile form factor:

| | |
|---|---|
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 — was 92; there was no `robots.txt`, so the SPA fallback served HTML to crawlers |
| Performance | 86 |

axe-core 4.10 reports **zero violations** across the home page and all nine
case-study routes. Three real defects came out of that pass and are fixed:

- **Every primary button failed WCAG AA.** `--color-red` under `--color-white`
  measures 3.54:1 and 12px bold wants 4.5:1. Red as a *mark* and red as a
  *surface under text* are different jobs, so the surface tier is now its own
  token at 4.79:1; the signal red is untouched wherever it is not carrying a
  label.
- **The canonical URL pointed at a 404.** `manan-kochhar.vercel.app` does not
  resolve, and a canonical is authoritative — the site was telling crawlers its
  real address was a missing page.
- **The monogram link failed Label in Name.** Visible text `MK`, accessible name
  "Manan Kochhar — back to top", so a speech-input user saying "click MK" hit
  nothing. The name now leads with the monogram.

`robots.txt` and `sitemap.xml` are generated from `projects.js` by
`scripts/gen-seo.mjs` at `prebuild`, because a hand-written sitemap stops being
true the first time a project is added and nobody remembers the file.

Capability is re-evaluated on media-query and visibility changes rather than
measured once, so a restored or prerendered tab isn't permanently demoted.
The WebGL layer sits behind an error boundary — a shader or driver failure
degrades to the static field instead of blanking the page.

## Accessibility

Semantic landmarks and heading order · skip link · `aria-expanded` /
`aria-controls` on every disclosure · `aria-live` on the copy confirmation ·
visible `:focus-visible` rings · 44px touch targets · hover states reset under
`(hover: none)` · full `prefers-reduced-motion` path that disables the 3D hero,
smooth scroll, marquee, custom cursor and every transform.

## Case studies

A project row answers *what is it*. Five of them go further, at `/work/<id>`:
the problem, the decisions worth defending, the pipeline, what was measured,
and — where there is one — what was tried and dropped because the numbers
refused to support it.

Everything on those pages comes from the repo it describes. The Voice Emotion
study is the clearest example of the format: nine candidate improvements,
each measured on two corpora, two of them rejected on evidence.

Routing is `src/lib/route.js` + `router.jsx` — about seventy lines over the
History API, because two URL shapes is not worth 20 kB of react-router. The
case-study bundle is split out and loaded only on those routes.

## Structure

```
src/
├── data/          Single source of truth — profile, projects, skills,
│                  achievements, studies (the long-form case studies)
├── lib/           motion.js (easing/variants) · icons.jsx (inline SVG)
│                  route.js + router.jsx (the small History-API router)
├── hooks/         usePointer · useDeviceCapability · useLenis
├── styles/        index.css — @theme tokens + component layer
└── components/
    ├── three/     AeroField · CameraRig · HeroCanvas · CanvasBoundary
    │   └── fluid/ FluidSolver.js (passes, targets) · glsl.js (shaders)
    ├── layout/    Preloader · Navbar · Cursor · GridOverlay · Footer
    ├── ui/        Reveal · Magnetic · SectionHeader · Button · Marquee
    ├── work/      ProjectRow — the collapsed/expanded list row
    ├── case/      CaseStudy — the deep page, lazily loaded
    └── sections/  Hero · About · Work · Skills · Achievements · Contact
```

Every piece of copy lives in `src/data/`. Nothing is hardcoded in a component.

## Run it

```bash
npm install
npm run dev
```

| Command | Action |
|---|---|
| `npm run dev` | Dev server at `http://localhost:5173` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |

---

<div align="center">

[GitHub](https://github.com/Manan-2007) · [LinkedIn](https://www.linkedin.com/in/manan-kochhar-b57a56211/) · [LeetCode](https://leetcode.com/u/Manan-2007/)

</div>
