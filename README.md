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

The centrepiece is an original wind-tunnel visualisation, not a car model.

Roughly 6,400 streaklines travel along the flow axis past an **invisible
aerofoil**. Each streak is a two-vertex line segment whose head and tail are
displaced by the same analytic flow field in a vertex shader, so the entire
scene is **one draw call with zero per-particle CPU work**. Where the flow
accelerates around the body it heats from silver to red, the way a pressure map
reads in CFD. The pointer acts as a second, softer pressure source.

- Solved per-vertex for the body (streaks *bend* past it) and once-per-streak
  for the pointer wake (otherwise every streak shears into a spike).
- Camera drifts toward the pointer on a heavy lerp — long-lens feel.
- `frameloop` is cut dead when the hero scrolls out of view.
- Three.js is lazily imported and mounted on idle, so it never touches the
  critical path.

## Performance

| | |
|---|---|
| Critical path (gzip) | ~127 kB — React + Framer Motion + CSS |
| Deferred (gzip) | ~238 kB — three + R3F, desktop only, after idle |
| 3D gating | WebGL + not mobile + not reduced-motion + >4 cores |
| Fallback | Inline SVG streamlines — no script, no request |
| Pointer tracking | Ref-based rAF lerp — **zero re-renders** |
| Marquee | Pure CSS, never touches the main thread |

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

## Structure

```
src/
├── data/          Single source of truth — profile, projects, skills, season
├── lib/           motion.js (shared easing/variants) · icons.jsx (inline SVG)
├── hooks/         usePointer · useDeviceCapability · useLenis · useCountUp
├── styles/        index.css — @theme tokens + component layer
└── components/
    ├── three/     AeroField (GLSL) · CameraRig · HeroCanvas · CanvasBoundary
    ├── layout/    Preloader · Navbar · Cursor · GridOverlay · Footer
    ├── ui/        Reveal · Magnetic · SectionHeader · Button · Marquee
    └── sections/  Hero · About · Garage · Work · Stack · Season · Contact
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
