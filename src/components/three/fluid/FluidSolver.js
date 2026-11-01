import * as THREE from 'three'
import {
  advectFrag,
  curlFrag,
  divergenceFrag,
  forcesFrag,
  gradientFrag,
  particleFrag,
  pressureFrag,
  quadVert,
  vorticityFrag,
} from './glsl'

/* ────────────────────────────────────────────────────────────────────────
   FluidSolver — an incompressible Navier–Stokes solver on the GPU.

   Plain three.js, no React: it owns render targets and a draw order, which
   are not things that belong in a component's render pass. AeroField drives
   it one `step()` per frame and reads two textures back out.

   The domain is the wind tunnel: 22 × 11 world units on a 256 × 128 grid, so
   cells are square and dx == dy. Everything below is in world units per
   second; only the advection trace works in uv.
   ──────────────────────────────────────────────────────────────────────── */

export const DOMAIN = { x: 22, y: 11 }

/* The camera sees about seven world units of height at z = 9.2 and fov 42,
   so scattering streaks across the full eleven spends a third of them off
   screen. This is the band they are seeded into and recycled within — the
   same 8,192 streaks, all of them inside the frame. */
export const SPREAD_Y = DOMAIN.y * 0.36

const GRID = { x: 256, y: 128 }
const PARTICLES = { x: 128, y: 64 }
export const PARTICLE_COUNT = PARTICLES.x * PARTICLES.y

/* The section, in world units. Two of these are deliberate rather than
   conventional, and both were settled by reading the velocity field back off
   the GPU rather than by eye.

   Thirteen degrees is past the stall angle for a section this thick. At a
   believable cruise incidence of eight, the measured disturbance covered four
   per cent of the visible frame: correct, and invisible. Thirteen separates
   and sheds, which is both what a front wing element actually does under load
   and the only version of this anyone can see.

   The chord is sized against the frame, not the domain. At 5.0 the section
   spans a third of the visible width and its projected height is near a third
   of the visible height; at 3.4 the wake came out finer than the spacing
   between streaks, so there was nothing to resolve it. */
const BODY = {
  pos: new THREE.Vector2(-2.2, 0),
  chord: 5.0,
  thickness: 0.2,
  aoa: THREE.MathUtils.degToRad(13),
}

const FREESTREAM = 3.0
const PRESSURE_ITERATIONS = 20

/* A streak caught in a recirculating eddy never leaves the domain, so without
   an age it would orbit the wake indefinitely and the vortex cores would clot
   into static bright knots. Crossing the tunnel at freestream takes about
   seven seconds; this is scattered per streak in the shader. */
const MAX_LIFETIME = 18.0

const quad = new THREE.PlaneGeometry(2, 2)

function makeTarget(w, h, type) {
  return new THREE.WebGLRenderTarget(w, h, {
    type,
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
    depthBuffer: false,
    stencilBuffer: false,
  })
}

/** A read/write pair. `swap()` after every pass that writes its own input. */
class PingPong {
  constructor(w, h, type) {
    this.read = makeTarget(w, h, type)
    this.write = makeTarget(w, h, type)
  }
  swap() {
    const t = this.read
    this.read = this.write
    this.write = t
  }
  dispose() {
    this.read.dispose()
    this.write.dispose()
  }
}

export class FluidSolver {
  constructor(renderer) {
    this.renderer = renderer

    /* Half-float is enough for velocity and pressure and is universally
       renderable. Particle positions want full float: a position near the
       far wall is ~11, where a half-float step is ~0.008 world units, and a
       slow-moving streak would quantise to a standstill. */
    const half = THREE.HalfFloatType
    const full = renderer.extensions.has('EXT_color_buffer_float')
      ? THREE.FloatType
      : half
    this.positionType = full

    this.velocity = new PingPong(GRID.x, GRID.y, half)
    this.particles = new PingPong(PARTICLES.x, PARTICLES.y, full)
    this.pressure = new PingPong(GRID.x, GRID.y, half)
    this.curl = makeTarget(GRID.x, GRID.y, half)
    this.divergence = makeTarget(GRID.x, GRID.y, half)

    this.scene = new THREE.Scene()
    this.camera = new THREE.Camera()
    this.mesh = new THREE.Mesh(quad, null)
    this.mesh.frustumCulled = false
    this.scene.add(this.mesh)

    const domain = {
      uMin: { value: new THREE.Vector2(-DOMAIN.x * 0.5, -DOMAIN.y * 0.5) },
      uSize: { value: new THREE.Vector2(DOMAIN.x, DOMAIN.y) },
      uTexel: { value: new THREE.Vector2(1 / GRID.x, 1 / GRID.y) },
      uBodyPos: { value: BODY.pos.clone() },
      uChord: { value: BODY.chord },
      uThickness: { value: BODY.thickness },
      uAoA: { value: BODY.aoa },
    }
    // Every pass reads the same domain and body, so they share one set of
    // uniform objects rather than each keeping a copy to drift out of sync.
    this.domain = domain

    const pass = (fragmentShader, uniforms) =>
      new THREE.RawShaderMaterial({
        vertexShader: quadVert,
        fragmentShader,
        uniforms: { ...domain, ...uniforms },
        glslVersion: THREE.GLSL3,
        depthTest: false,
        depthWrite: false,
      })

    /* Dissipation stays at 1. It is the right knob for dye or smoke density,
       but the quantity being advected here is momentum in a tunnel that is
       meant to keep running: 0.997 per frame drains sixteen per cent of the
       freestream every second, which the relaxation below then has to spend
       itself fighting back. The measured field had settled at 2.82 against a
       nominal 3.0. Semi-Lagrangian advection already carries more than enough
       implicit viscosity through its bilinear reads. */
    this.advect = pass(advectFrag, {
      uVelocity: { value: null },
      uSource: { value: null },
      uDt: { value: 0 },
      uDissipation: { value: 1.0 },
    })

    /* uRelax is how quickly the tunnel forgets. At 0.035 per frame it erased
       eighty-eight per cent of any disturbance every second, so the wake died
       within three world units of the trailing edge — well under one chord,
       and long before it reached the half of the frame that has room for it.
       At 0.0035 a disturbance keeps roughly two thirds of its strength over
       the six units from the section to the right edge, which is what puts a
       vortex street on screen instead of a rumour of one. */
    this.forces = pass(forcesFrag, {
      uVelocity: { value: null },
      uFreestream: { value: FREESTREAM },
      uRelax: { value: 0.0035 },
      uPointer: { value: new THREE.Vector2(999, 999) },
      uSplat: { value: 0 },
      uRadius: { value: 1.1 },
      uSplatDir: { value: new THREE.Vector2(0, 0) },
    })

    this.curlPass = pass(curlFrag, { uVelocity: { value: null } })

    this.vorticity = pass(vorticityFrag, {
      uVelocity: { value: null },
      uCurl: { value: null },
      uStrength: { value: 3.2 },
      uDt: { value: 0 },
    })

    this.divergencePass = pass(divergenceFrag, { uVelocity: { value: null } })

    this.pressurePass = pass(pressureFrag, {
      uPressure: { value: null },
      uDivergence: { value: null },
    })

    this.gradient = pass(gradientFrag, {
      uPressure: { value: null },
      uVelocity: { value: null },
    })

    this.particlePass = pass(particleFrag, {
      uParticles: { value: null },
      uVelocity: { value: null },
      uDt: { value: 0 },
      uTime: { value: 0 },
      uSpreadY: { value: SPREAD_Y },
      uLifetime: { value: MAX_LIFETIME },
    })

    this.time = 0
    this.seed()
  }

  /** Fills both velocity targets with freestream and scatters the streaks. */
  seed() {
    const { renderer } = this

    const count = PARTICLE_COUNT
    const data = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) {
      const bias = Math.random() ** 1.25
      data[i * 4] = (Math.random() - 0.5) * DOMAIN.x
      data[i * 4 + 1] = (Math.random() < 0.5 ? -1 : 1) * bias * SPREAD_Y
      // Depth scatter only — the simulation itself is strictly 2-D.
      data[i * 4 + 2] = (Math.random() * 2 - 1) * 3.4
      // Age in seconds, spread across a whole lifetime so the first wave of
      // recycling is staggered rather than landing as one visible pulse.
      data[i * 4 + 3] = Math.random() * MAX_LIFETIME
    }

    const seedTex = new THREE.DataTexture(
      data,
      PARTICLES.x,
      PARTICLES.y,
      THREE.RGBAFormat,
      THREE.FloatType
    )
    seedTex.needsUpdate = true

    const copy = new THREE.RawShaderMaterial({
      vertexShader: quadVert,
      fragmentShader: /* glsl */ `
        precision highp float;
        precision highp sampler2D;
        uniform sampler2D uTex;
        in  vec2 vUv;
        out vec4 fragColor;
        void main() { fragColor = texture(uTex, vUv); }
      `,
      uniforms: { uTex: { value: seedTex } },
      glslVersion: THREE.GLSL3,
      depthTest: false,
      depthWrite: false,
    })

    const previous = renderer.getRenderTarget()

    for (const target of [this.particles.read, this.particles.write]) {
      this.render(copy, target)
    }

    // Start the tunnel already running: a field that spins up from rest
    // spends the first few seconds looking like nothing is happening.
    const fill = new THREE.RawShaderMaterial({
      vertexShader: quadVert,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform float uFreestream;
        in  vec2 vUv;
        out vec4 fragColor;
        void main() { fragColor = vec4(uFreestream, 0.0, 0.0, 1.0); }
      `,
      uniforms: { uFreestream: { value: FREESTREAM } },
      glslVersion: THREE.GLSL3,
      depthTest: false,
      depthWrite: false,
    })
    for (const target of [this.velocity.read, this.velocity.write]) {
      this.render(fill, target)
    }
    for (const target of [this.pressure.read, this.pressure.write]) {
      this.renderClear(target)
    }

    renderer.setRenderTarget(previous)

    seedTex.dispose()
    copy.dispose()
    fill.dispose()
  }

  render(material, target) {
    this.mesh.material = material
    this.renderer.setRenderTarget(target)
    this.renderer.render(this.scene, this.camera)
  }

  renderClear(target) {
    this.renderer.setRenderTarget(target)
    this.renderer.clear(true, false, false)
  }

  /**
   * One simulation step.
   *
   * @param {number} dt      seconds, already clamped by the caller
   * @param {{x:number,y:number}|null} pointer  world-space pointer position
   * @param {number} strength  0..1 pointer influence
   * @param {{x:number,y:number}} dir  pointer travel direction
   */
  step(dt, pointer, strength, dir) {
    const { renderer } = this
    const previous = renderer.getRenderTarget()
    const previousAutoClear = renderer.autoClear
    renderer.autoClear = false

    this.time += dt

    // 1 — advect velocity through itself
    this.advect.uniforms.uVelocity.value = this.velocity.read.texture
    this.advect.uniforms.uSource.value = this.velocity.read.texture
    this.advect.uniforms.uDt.value = dt
    this.render(this.advect, this.velocity.write)
    this.velocity.swap()

    // 2 — freestream, pointer splat, no-slip on the section
    this.forces.uniforms.uVelocity.value = this.velocity.read.texture
    if (pointer) {
      this.forces.uniforms.uPointer.value.set(pointer.x, pointer.y)
      this.forces.uniforms.uSplatDir.value.set(dir.x, dir.y)
      this.forces.uniforms.uSplat.value = strength
    } else {
      this.forces.uniforms.uSplat.value = 0
    }
    this.render(this.forces, this.velocity.write)
    this.velocity.swap()

    // 3 — put back the small eddies advection just smeared away
    this.curlPass.uniforms.uVelocity.value = this.velocity.read.texture
    this.render(this.curlPass, this.curl)

    this.vorticity.uniforms.uVelocity.value = this.velocity.read.texture
    this.vorticity.uniforms.uCurl.value = this.curl.texture
    this.vorticity.uniforms.uDt.value = dt
    this.render(this.vorticity, this.velocity.write)
    this.velocity.swap()

    // 4 — project onto the divergence-free subspace
    this.divergencePass.uniforms.uVelocity.value = this.velocity.read.texture
    this.render(this.divergencePass, this.divergence)

    this.pressurePass.uniforms.uDivergence.value = this.divergence.texture
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      this.pressurePass.uniforms.uPressure.value = this.pressure.read.texture
      this.render(this.pressurePass, this.pressure.write)
      this.pressure.swap()
    }

    this.gradient.uniforms.uPressure.value = this.pressure.read.texture
    this.gradient.uniforms.uVelocity.value = this.velocity.read.texture
    this.render(this.gradient, this.velocity.write)
    this.velocity.swap()

    // 5 — carry the streaklines through the solved field
    this.particlePass.uniforms.uParticles.value = this.particles.read.texture
    this.particlePass.uniforms.uVelocity.value = this.velocity.read.texture
    this.particlePass.uniforms.uDt.value = dt
    this.particlePass.uniforms.uTime.value = this.time
    this.render(this.particlePass, this.particles.write)
    this.particles.swap()

    renderer.setRenderTarget(previous)
    renderer.autoClear = previousAutoClear
  }

  get velocityTexture() {
    return this.velocity.read.texture
  }

  get particleTexture() {
    return this.particles.read.texture
  }

  get freestream() {
    return FREESTREAM
  }

  /** Texel centres for the streak geometry, so each vertex finds its particle. */
  static particleRefs() {
    const refs = new Float32Array(PARTICLE_COUNT * 2 * 2)
    const tails = new Float32Array(PARTICLE_COUNT * 2)
    let i = 0
    for (let y = 0; y < PARTICLES.y; y++) {
      for (let x = 0; x < PARTICLES.x; x++) {
        const u = (x + 0.5) / PARTICLES.x
        const v = (y + 0.5) / PARTICLES.y
        for (let k = 0; k < 2; k++) {
          refs[(i * 2 + k) * 2] = u
          refs[(i * 2 + k) * 2 + 1] = v
          tails[i * 2 + k] = k
        }
        i++
      }
    }
    return { refs, tails }
  }

  dispose() {
    this.velocity.dispose()
    this.particles.dispose()
    this.pressure.dispose()
    this.curl.dispose()
    this.divergence.dispose()
    for (const m of [
      this.advect,
      this.forces,
      this.curlPass,
      this.vorticity,
      this.divergencePass,
      this.pressurePass,
      this.gradient,
      this.particlePass,
    ]) {
      m.dispose()
    }
  }
}
