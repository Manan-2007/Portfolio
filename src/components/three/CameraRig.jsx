import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const LERP = 0.035 // low = heavy camera, the way a long lens feels

/**
 * Drifts the camera around the flow axis in response to the pointer.
 * Renders nothing — it only mutates the camera each frame.
 */
export default function CameraRig({ pointerRef }) {
  const { camera } = useThree()
  const look = useRef(new THREE.Vector3(0, 0, 0))
  const ready = useRef(false)

  if (!ready.current) {
    camera.position.set(0, 0.35, 9.2)
    camera.lookAt(0, 0, 0)
    ready.current = true
  }

  useFrame(() => {
    const p = pointerRef?.current
    if (!p) return

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, p.x * 0.85, LERP)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.35 - p.y * 0.55, LERP)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9.2 - Math.abs(p.x) * 0.4, LERP)

    look.current.x = THREE.MathUtils.lerp(look.current.x, p.x * 0.35, LERP)
    look.current.y = THREE.MathUtils.lerp(look.current.y, -p.y * 0.2, LERP)
    camera.lookAt(look.current)
  })

  return null
}
