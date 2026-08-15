import { Canvas } from '@react-three/fiber'
import AeroField from './AeroField'
import CameraRig from './CameraRig'

/**
 * The hero's WebGL layer. Lazily imported by <Hero>, so three.js never lands
 * on the critical path — and `active` cuts the frameloop dead once the hero
 * scrolls away, handing the whole GPU back to the rest of the page.
 */
export default function HeroCanvas({ pointerRef, active = true }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ fov: 42, near: 0.1, far: 60, position: [0, 0.35, 9.2] }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false,
      }}
      style={{ pointerEvents: 'none', background: 'transparent' }}
    >
      <CameraRig pointerRef={pointerRef} />
      <AeroField pointerRef={pointerRef} />
    </Canvas>
  )
}
