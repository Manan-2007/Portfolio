import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import {
  DOMAIN,
  FluidSolver,
  PARTICLE_COUNT,
  SPREAD_Y,
} from './fluid/FluidSolver'
import { streakFrag, streakVert } from './fluid/glsl'

/* ────────────────────────────────────────────────────────────────────────
   AeroField — a wind tunnel, actually solved.

   8,192 streaklines are carried through an incompressible Navier–Stokes
   field computed on the GPU every frame, past a NACA symmetric section at
   eight degrees of incidence. Nothing here is a curve shaped to look like
   flow: the streaks go where the solver sends them, which is why the wake
   sheds a vortex street on its own rather than being told to.

   Colour is speed relative to freestream — the same quantity a CFD pressure
   map shows. Silver is undisturbed air; red is the acceleration over the
   suction surface.

   The solver lives in FluidSolver.js. This file is the part React owns: the
   geometry, the material, and one `step()` per frame.
   ──────────────────────────────────────────────────────────────────────── */

export default function AeroField({ pointerRef, opacity = 1 }) {
  const material = useRef(null)
  const solverRef = useRef(null)
  const { gl, viewport } = useThree()

  // The pointer's own velocity is what it pushes the air with — a stationary
  // cursor should disturb nothing, however long it sits there.
  const pointerState = useRef({
    world: new THREE.Vector2(0, 0),
    last: new THREE.Vector2(0, 0),
    dir: new THREE.Vector2(0, 0),
    strength: 0,
  })

  const solver = useMemo(() => new FluidSolver(gl), [gl])
  solverRef.current = solver

  useEffect(() => () => solver.dispose(), [solver])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const { refs, tails } = FluidSolver.particleRefs()

    // The vertex shader computes every position from the particle texture;
    // this attribute exists only because a BufferGeometry must have one.
    const position = new Float32Array(PARTICLE_COUNT * 2 * 3)

    geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
    geo.setAttribute('aRef', new THREE.BufferAttribute(refs, 2))
    geo.setAttribute('aTail', new THREE.BufferAttribute(tails, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), DOMAIN.x)

    return geo
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  const uniforms = useMemo(
    () => ({
      uParticles: { value: null },
      uVelocity: { value: null },
      uMin: { value: new THREE.Vector2(-DOMAIN.x * 0.5, -DOMAIN.y * 0.5) },
      uSize: { value: new THREE.Vector2(DOMAIN.x, DOMAIN.y) },
      uFreestream: { value: solver.freestream },
      // A streak's length is its speed, so this is the gain on the one cue
      // that reads without colour at all.
      uTailScale: { value: 0.17 },
      uOpacity: { value: opacity },
      uCool: { value: new THREE.Color('#aeb6bf') },
      uHot: { value: new THREE.Color('#ff1e00') },
    }),
    [opacity, solver]
  )

  useFrame((state, delta) => {
    const u = material.current?.uniforms
    if (!u) return

    // Clamp: resuming a paused frameloop must not fast-forward the solver,
    // and a long frame must not push the advection trace past a cell.
    const dt = Math.min(delta, 1 / 45)

    const p = pointerRef?.current
    const ps = pointerState.current
    if (p) {
      // Pointer arrives in normalised screen space; the solver works in
      // world units, and the tunnel is wider than it is tall.
      ps.world.set(p.x * DOMAIN.x * 0.42, -p.y * SPREAD_Y * 0.9)
      const dx = ps.world.x - ps.last.x
      const dy = ps.world.y - ps.last.y
      const moved = Math.hypot(dx, dy)

      if (moved > 1e-4) {
        ps.dir.set(dx / moved, dy / moved)
      }
      // Ease toward the travel speed rather than tracking it directly, so a
      // flick leaves a wake that decays instead of a single-frame spike.
      const target = Math.min(1, moved / (dt * 14))
      ps.strength += (target - ps.strength) * 0.12
      ps.last.copy(ps.world)
    } else {
      ps.strength *= 0.9
    }

    solver.step(
      dt,
      ps.strength > 0.01 ? ps.world : null,
      ps.strength * 9.0,
      ps.dir
    )

    u.uParticles.value = solver.particleTexture
    u.uVelocity.value = solver.velocityTexture
    u.uOpacity.value = opacity * (viewport.aspect < 1 ? 1.25 : 1)
  })

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <rawShaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={streakVert}
        fragmentShader={streakFrag}
        glslVersion={THREE.GLSL3}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}
