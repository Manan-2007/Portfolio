/* ────────────────────────────────────────────────────────────────────────
   Shader sources for the wind tunnel.

   This is the standard GPU fluid pipeline — Stam's stable fluids, solved the
   way GPU Gems 38 lays it out: advect, add forces, confine vorticity, take
   the divergence, relax pressure with Jacobi, then subtract the pressure
   gradient so the field comes out divergence-free.

   Everything is GLSL ES 3.00 on RawShaderMaterial. The hero already gates on
   WebGL2, and declaring every uniform explicitly is cheaper to reason about
   than relying on which compatibility defines three injects for GLSL1.

   The grid is square in world units — a 22 × 11 domain on 256 × 128 cells —
   so dx == dy and the Jacobi and gradient kernels can use one spacing.
   ──────────────────────────────────────────────────────────────────────── */

/** Fullscreen triangle-ish quad: the geometry is already in clip space. */
export const quadVert = /* glsl */ `
  in vec3 position;
  out vec2 vUv;

  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

/* Shared helpers, prepended to the passes that need them. `uMin`/`uSize` map
   world coordinates onto the [0,1] grid, and the body is a real NACA 4-digit
   symmetric section rather than an ellipse — the trailing edge is what sheds
   the vortex street, and an ellipse does not have one. */
const common = /* glsl */ `
  precision highp float;
  precision highp sampler2D;

  uniform vec2  uMin;
  uniform vec2  uSize;
  uniform vec2  uTexel;

  uniform vec2  uBodyPos;
  uniform float uChord;
  uniform float uThickness;
  uniform float uAoA;

  vec2 toUv(vec2 world)  { return (world - uMin) / uSize; }
  vec2 toWorld(vec2 uv)  { return uMin + uv * uSize; }

  vec2 rotate(vec2 p, float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c) * p;
  }

  // NACA 4-digit symmetric half-thickness, chord-normalised.
  float nacaHalf(float x, float t) {
    return 5.0 * t * (0.2969 * sqrt(x) - 0.1260 * x
                    - 0.3516 * x * x + 0.2843 * x * x * x
                    - 0.1015 * x * x * x * x);
  }

  // 1 inside the aerofoil, 0 outside, with a soft cell-width edge so the
  // no-slip condition does not alias into a staircase.
  float body(vec2 world) {
    vec2  q  = rotate(world - uBodyPos, -uAoA);
    float xc = q.x / uChord + 0.5;
    if (xc < 0.0 || xc > 1.0) return 0.0;
    float h = nacaHalf(xc, uThickness) * uChord;
    float e = uSize.x * uTexel.x * 1.2;
    return 1.0 - smoothstep(h - e, h + e, abs(q.y));
  }
`

/* ── Advection ─────────────────────────────────────────────────────────
   Semi-Lagrangian: trace backwards along the velocity field and read what
   was there. Unconditionally stable, which is the entire reason this method
   is usable at a 60 Hz timestep. */
export const advectFrag = /* glsl */ `
  ${common}

  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform float uDt;
  uniform float uDissipation;

  in  vec2 vUv;
  out vec4 fragColor;

  void main() {
    vec2 vel   = texture(uVelocity, vUv).xy;
    // Velocity is in world units per second; the trace happens in uv.
    vec2 coord = vUv - uDt * vel / uSize;
    fragColor  = uDissipation * texture(uSource, clamp(coord, vec2(0.0), vec2(1.0)));
  }
`

/* ── Forces ────────────────────────────────────────────────────────────
   Three things happen here, and the order matters: relax toward freestream
   so this stays a tunnel rather than a puff that dissipates, add the
   pointer's splat, then stop the flow dead inside the body. */
export const forcesFrag = /* glsl */ `
  ${common}

  uniform sampler2D uVelocity;
  uniform float uFreestream;
  uniform float uRelax;
  uniform vec2  uPointer;
  uniform float uSplat;
  uniform float uRadius;
  uniform vec2  uSplatDir;

  in  vec2 vUv;
  out vec4 fragColor;

  void main() {
    vec2 vel   = texture(uVelocity, vUv).xy;
    vec2 world = toWorld(vUv);

    vel = mix(vel, vec2(uFreestream, 0.0), uRelax);

    // The inlet is held at freestream outright — a relaxation alone lets the
    // body's upstream pressure field creep back to the edge and stall it.
    float inlet = 1.0 - smoothstep(0.0, 0.06, vUv.x);
    vel = mix(vel, vec2(uFreestream, 0.0), inlet);

    vec2  d = world - uPointer;
    float g = exp(-dot(d, d) / uRadius);
    vel += uSplatDir * uSplat * g;

    vel = mix(vel, vec2(0.0), body(world));

    fragColor = vec4(vel, 0.0, 1.0);
  }
`

/* ── Curl ──────────────────────────────────────────────────────────────
   Scalar vorticity of a 2-D field: dv/dx - du/dy. */
export const curlFrag = /* glsl */ `
  ${common}

  uniform sampler2D uVelocity;

  in  vec2 vUv;
  out vec4 fragColor;

  void main() {
    float l = texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).y;
    float r = texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).y;
    float b = texture(uVelocity, vUv - vec2(0.0, uTexel.y)).x;
    float t = texture(uVelocity, vUv + vec2(0.0, uTexel.y)).x;
    fragColor = vec4(0.5 * ((r - l) - (t - b)), 0.0, 0.0, 1.0);
  }
`

/* ── Vorticity confinement ─────────────────────────────────────────────
   Semi-Lagrangian advection bleeds angular momentum badly, so the small
   eddies that make a wake legible decay within a second or two. Fedkiw's
   confinement force pushes energy back along the vorticity gradient and
   restores them. Without this pass the wake is a smear. */
export const vorticityFrag = /* glsl */ `
  ${common}

  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float uStrength;
  uniform float uDt;

  in  vec2 vUv;
  out vec4 fragColor;

  void main() {
    float l = abs(texture(uCurl, vUv - vec2(uTexel.x, 0.0)).x);
    float r = abs(texture(uCurl, vUv + vec2(uTexel.x, 0.0)).x);
    float b = abs(texture(uCurl, vUv - vec2(0.0, uTexel.y)).x);
    float t = abs(texture(uCurl, vUv + vec2(0.0, uTexel.y)).x);
    float c = texture(uCurl, vUv).x;

    vec2 grad = 0.5 * vec2(r - l, t - b);
    // Guard the normalise: in still regions the gradient is zero and the
    // result would be NaN, which then advects across the whole field.
    grad /= max(length(grad), 1e-5);

    vec2 force = uStrength * c * vec2(grad.y, -grad.x);
    vec2 vel   = texture(uVelocity, vUv).xy + force * uDt;

    fragColor = vec4(vel, 0.0, 1.0);
  }
`

/* ── Divergence ────────────────────────────────────────────────────────── */
export const divergenceFrag = /* glsl */ `
  ${common}

  uniform sampler2D uVelocity;

  in  vec2 vUv;
  out vec4 fragColor;

  void main() {
    float l = texture(uVelocity, vUv - vec2(uTexel.x, 0.0)).x;
    float r = texture(uVelocity, vUv + vec2(uTexel.x, 0.0)).x;
    float b = texture(uVelocity, vUv - vec2(0.0, uTexel.y)).y;
    float t = texture(uVelocity, vUv + vec2(0.0, uTexel.y)).y;
    fragColor = vec4(0.5 * ((r - l) + (t - b)), 0.0, 0.0, 1.0);
  }
`

/* ── Pressure, by Jacobi relaxation ────────────────────────────────────
   Solving the Poisson equation that makes the field incompressible. Each
   iteration is one relaxation sweep; the solver runs a fixed number of them
   because a convergence test would cost a readback, and the field is visually
   converged long before it is numerically converged. */
export const pressureFrag = /* glsl */ `
  ${common}

  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;

  in  vec2 vUv;
  out vec4 fragColor;

  void main() {
    float l = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
    float r = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
    float b = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
    float t = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;
    float d = texture(uDivergence, vUv).x;
    fragColor = vec4((l + r + b + t - d) * 0.25, 0.0, 0.0, 1.0);
  }
`

/* ── Projection ────────────────────────────────────────────────────────
   Subtract the pressure gradient. After this the velocity field is (near
   enough) divergence-free, which is what makes the streaks behave like an
   incompressible fluid instead of a particle spray. */
export const gradientFrag = /* glsl */ `
  ${common}

  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;

  in  vec2 vUv;
  out vec4 fragColor;

  void main() {
    float l = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).x;
    float r = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).x;
    float b = texture(uPressure, vUv - vec2(0.0, uTexel.y)).x;
    float t = texture(uPressure, vUv + vec2(0.0, uTexel.y)).x;

    vec2 vel = texture(uVelocity, vUv).xy - 0.5 * vec2(r - l, t - b);

    // Free-slip at the tunnel floor and roof: kill the normal component only.
    if (vUv.y < uTexel.y || vUv.y > 1.0 - uTexel.y) vel.y = 0.0;
    // No-slip on the section itself, re-applied because projection leaks a
    // little velocity back into the solid cells.
    vel = mix(vel, vec2(0.0), body(toWorld(vUv)));

    fragColor = vec4(vel, 0.0, 1.0);
  }
`

/* ── Streakline advection ──────────────────────────────────────────────
   One texel per streak: xy is its position in world units, z its fixed depth
   for parallax, w a per-streak seed. Positions integrate through the solved
   field, so these are true streaklines — the path a dye particle actually
   takes — rather than a parameterised curve that imitates one. */
export const particleFrag = /* glsl */ `
  ${common}

  uniform sampler2D uParticles;
  uniform sampler2D uVelocity;
  uniform float uDt;
  uniform float uTime;
  uniform float uSpreadY;
  uniform float uLifetime;

  in  vec2 vUv;
  out vec4 fragColor;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec4 p = texture(uParticles, vUv);

    vec2 vel = texture(uVelocity, toUv(p.xy)).xy;
    p.xy += vel * uDt;
    p.w  += uDt;

    /* Recycle on age rather than on stalling. A speed cutoff looks like the
       same idea and is not: the slowest air anywhere in the field is the air
       inside a vortex core, so cutting on speed deleted precisely the eddies
       the confinement pass had just spent a draw call preserving. An age lets
       a streak orbit the wake, be seen doing it, and still retire before it
       accumulates into a static clot. Scattered per streak, so retirement is
       spread out instead of arriving as a pulse. */
    float life = uLifetime * (0.5 + 0.5 * hash(vUv));

    bool gone = p.x > uMin.x + uSize.x || p.x < uMin.x
             || abs(p.y) > uSpreadY
             || body(p.xy) > 0.5
             || p.w > life;

    if (gone) {
      float h1 = hash(vUv + uTime);
      float h2 = hash(vUv.yx - uTime * 0.37);
      // Same centre bias as the original field: dense through the test
      // section, sparse at the edges where it reads as background.
      float bias = pow(h1, 1.25);
      p.x = uMin.x + h2 * uSize.x * 0.04;
      p.y = (h2 < 0.5 ? -1.0 : 1.0) * bias * uSpreadY;
      p.w = 0.0;
    }

    fragColor = p;
  }
`

/* ── Streak rendering ──────────────────────────────────────────────────
   Two vertices per streak. The head reads its position from the particle
   texture; the tail trails it along the local velocity, so a streak's length
   is its speed — which is what makes the acceleration over the suction
   surface visible without drawing a single number. */
export const streakVert = /* glsl */ `
  precision highp float;
  precision highp sampler2D;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  uniform sampler2D uParticles;
  uniform sampler2D uVelocity;
  uniform vec2  uMin;
  uniform vec2  uSize;
  uniform float uFreestream;
  uniform float uTailScale;

  in vec3  position;
  in vec2  aRef;   // this streak's texel in the particle texture
  in float aTail;  // 0 = head, 1 = tail

  out float vHeat;
  out float vSlow;
  out float vFade;
  out float vTail;

  void main() {
    vec4  p   = texture(uParticles, aRef);
    vec2  vel = texture(uVelocity, (p.xy - uMin) / uSize).xy;

    vec2 xy = p.xy - aTail * vel * uTailScale;

    /* Speed relative to freestream, split either side of one. Heat alone was
       a mistake: the wake is the one feature here worth looking at and it is
       *slower* than freestream, so a one-sided map drew the most interesting
       part of the field in exactly the colour of undisturbed air. Now the
       acceleration over the suction surface heats toward red and the momentum
       deficit behind the section gives up brightness. Both come off the same
       quantity a CFD velocity-magnitude map plots. */
    float q = length(vel) / max(uFreestream, 1e-3);
    vHeat = max(0.0, q - 1.0);
    vSlow = max(0.0, 1.0 - q);
    vTail = aTail;

    // Dissolve at both ends of the tunnel so recycling is never visible.
    float ax = abs(p.x - (uMin.x + uSize.x * 0.5));
    vFade = 1.0 - smoothstep(uSize.x * 0.30, uSize.x * 0.48, ax);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(xy, p.z, 1.0);
  }
`

export const streakFrag = /* glsl */ `
  precision mediump float;

  uniform vec3  uCool;
  uniform vec3  uHot;
  uniform float uOpacity;

  in  float vHeat;
  in  float vSlow;
  in  float vFade;
  in  float vTail;
  out vec4  fragColor;

  void main() {
    /* The previous range opened at 0.08 and saturated at 0.85, asking for an
       eighty-five per cent overspeed before a streak went fully red. The
       measured peak over the suction surface is around a third of that, so
       nothing on screen ever left silver. This range is the one the field
       actually produces. */
    vec3 color = mix(uCool, uHot, smoothstep(0.05, 0.38, vHeat));

    /* Additive over a near-black page, so brightness carries the rest of the
       signal: accelerated air gains it, the wake deficit gives it up. */
    float lum = 0.26 + vHeat * 1.5 - vSlow * 0.17;

    float alpha = uOpacity * vFade * max(lum, 0.0) * (1.0 - vTail * 0.85);
    if (alpha <= 0.004) discard;
    fragColor = vec4(color, alpha);
  }
`
