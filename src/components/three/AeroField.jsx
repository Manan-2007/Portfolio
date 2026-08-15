import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ────────────────────────────────────────────────────────────────────────
   AeroField — a wind-tunnel flow visualisation.

   ~4,600 streaklines travel along +X past an invisible aerofoil body. Each
   streak is a two-vertex line segment; the head and tail are displaced by
   the same analytic flow field in the vertex shader, so the whole thing is
   one draw call with zero per-particle CPU work. Where the flow accelerates
   around the body it heats from silver to red — the same way a pressure
   map reads in CFD.
   ──────────────────────────────────────────────────────────────────────── */

const COUNT = 6400
const SPAN = 22 // wrap length along the flow axis, wider than the frustum
const SPREAD_Y = 5.0
const SPREAD_Z = 3.4

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uSpan;
  uniform float uIntensity;

  attribute vec3  aOrigin;
  attribute float aSpeed;
  attribute float aTail;
  attribute float aLength;

  varying float vHeat;
  varying float vFade;
  varying float vTail;

  // Analytic flow around an implicit ellipsoid body sitting at the origin.
  // Applied per-vertex, so head and tail curve independently — that is what
  // makes a streak bend as it passes the body instead of sliding sideways.
  vec3 body(vec3 p, out float speedup) {
    vec2  radial = p.yz / vec2(1.0, 0.62);
    float dist   = length(radial);
    // Influence is strongest level with the body and decays fore and aft.
    float axial  = exp(-p.x * p.x * 0.42);
    // The constant in the denominator caps the displacement on the stagnation
    // line — without it the centre streaks pile into one hot horizontal band.
    float push   = axial * 1.25 / (0.85 + dist * dist * 2.0);
    vec2  dir    = dist > 1e-4 ? radial / dist : vec2(0.0, 1.0);

    p.yz += dir * push;
    speedup = push;
    return p;
  }

  void main() {
    // Head position wraps within the span; the tail trails behind it.
    float travelled = aOrigin.x + uTime * aSpeed;
    float xHead = mod(travelled + uSpan * 0.5, uSpan) - uSpan * 0.5;
    float x = xHead - aTail * aLength;

    float speedup;
    vec3 pos = body(vec3(x, aOrigin.y, aOrigin.z), speedup);

    // Pointer wake — a second, softer pressure source travelling with the
    // mouse. Solved once from the head and applied to both vertices: solving
    // it per-vertex shears every streak into a spike near the cursor.
    vec2  toPointer = vec2(xHead, aOrigin.y) - vec2(uPointer.x * 5.0, -uPointer.y * 2.6);
    float pd        = length(toPointer);
    float wake      = uIntensity * 0.75 / (0.7 + pd * pd * 1.5);
    pos.xy += (pd > 1e-4 ? toPointer / pd : vec2(0.0, 1.0)) * wake;
    speedup += wake * 0.75;

    vHeat = speedup;
    vTail = aTail;
    // Dissolve near the wrap boundary so recycling is never visible.
    vFade = 1.0 - smoothstep(5.5, 9.5, abs(xHead));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3  uCool;
  uniform vec3  uHot;
  uniform float uOpacity;

  varying float vHeat;
  varying float vFade;
  varying float vTail;

  void main() {
    vec3  color = mix(uCool, uHot, smoothstep(0.22, 1.05, vHeat));
    // Heads read solid, tails dissolve — that difference is the motion blur.
    float alpha = uOpacity * vFade * (0.34 + vHeat * 0.9) * (1.0 - vTail * 0.85);
    if (alpha <= 0.004) discard;
    gl_FragColor = vec4(color, alpha);
  }
`

export default function AeroField({ pointerRef, opacity = 1 }) {
  const material = useRef(null)
  const { viewport } = useThree()

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()

    const verts = COUNT * 2
    const position = new Float32Array(verts * 3) // written by the shader
    const origin = new Float32Array(verts * 3)
    const speed = new Float32Array(verts)
    const tail = new Float32Array(verts)
    const length = new Float32Array(verts)

    for (let i = 0; i < COUNT; i++) {
      const x = Math.random() * SPAN - SPAN * 0.5

      // Bias the sample toward the centreline so the body sits in dense flow
      // while the outer field stays sparse enough to read as background.
      const yBias = Math.random() ** 1.25
      const y = (Math.random() < 0.5 ? -1 : 1) * yBias * SPREAD_Y
      const z = (Math.random() * 2 - 1) * SPREAD_Z

      const v = 1.6 + Math.random() * 3.6
      // Long enough to read as a streak rather than a speck; the spread in
      // lengths is what makes the field look like it has depth.
      const len = 0.5 + Math.random() * 1.9

      for (let k = 0; k < 2; k++) {
        const idx = i * 2 + k
        origin[idx * 3] = x
        origin[idx * 3 + 1] = y
        origin[idx * 3 + 2] = z
        speed[idx] = v
        tail[idx] = k // 0 = head, 1 = tail
        length[idx] = len
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
    geo.setAttribute('aOrigin', new THREE.BufferAttribute(origin, 3))
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1))
    geo.setAttribute('aTail', new THREE.BufferAttribute(tail, 1))
    geo.setAttribute('aLength', new THREE.BufferAttribute(length, 1))
    // The shader owns every vertex position, so leave culling to the fade.
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), SPAN)

    return geo
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uSpan: { value: SPAN },
      uIntensity: { value: 0 },
      uOpacity: { value: opacity },
      uCool: { value: new THREE.Color('#aeb6bf') },
      uHot: { value: new THREE.Color('#ff1e00') },
    }),
    [opacity]
  )

  useFrame((state, delta) => {
    const u = material.current?.uniforms
    if (!u) return

    // Clamp delta: resuming a paused frameloop must not fast-forward the flow.
    u.uTime.value += Math.min(delta, 0.05)

    const p = pointerRef?.current
    if (p) {
      u.uPointer.value.set(p.x, p.y)
      // The wake only builds once the pointer has actually moved off centre.
      const moved = Math.min(1, Math.hypot(p.x, p.y) * 1.4)
      u.uIntensity.value += (moved - u.uIntensity.value) * 0.05
    }

    // Portrait viewports see a narrower slice — lift opacity to compensate.
    u.uOpacity.value = opacity * (viewport.aspect < 1 ? 1.25 : 1)
  })

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}
