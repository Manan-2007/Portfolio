import { useEffect, useRef } from 'react'

/**
 * Normalised pointer position (-1 → +1) smoothed with a per-frame lerp.
 *
 * Returns a ref, never state — consumers read `ref.current` inside their own
 * rAF or `useFrame` loop, so moving the mouse never re-renders React.
 *
 * @param {number} ease 0.03 (heavy) → 0.15 (light)
 */
export function usePointer(ease = 0.06) {
  const raw = useRef({ x: 0, y: 0 })
  const smooth = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      raw.current.x = (e.clientX / window.innerWidth) * 2 - 1
      raw.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    let frame = 0
    const tick = () => {
      smooth.current.x += (raw.current.x - smooth.current.x) * ease
      smooth.current.y += (raw.current.y - smooth.current.y) * ease
      frame = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    frame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [ease])

  return smooth
}

/**
 * Drives a DOM node's transform straight from the pointer ref — no state,
 * no re-render. One call per parallax layer.
 */
export function useParallax(pointerRef, depthX = 20, depthY = 10) {
  const ref = useRef(null)

  useEffect(() => {
    let frame = 0
    const tick = () => {
      const el = ref.current
      if (el && pointerRef.current) {
        const { x, y } = pointerRef.current
        el.style.transform = `translate3d(${x * depthX}px, ${y * depthY}px, 0)`
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [pointerRef, depthX, depthY])

  return ref
}
