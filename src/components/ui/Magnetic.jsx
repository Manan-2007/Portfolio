import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

const MAX = 12

/**
 * Pulls its child toward the pointer. Motion values are written outside
 * React's render cycle, so tracking the mouse costs zero re-renders.
 */
export default function Magnetic({ children, strength = 0.3, className }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  if (reduced) return <span className={className}>{children}</span>

  const onMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    x.set(Math.max(-MAX, Math.min(MAX, dx * strength)))
    y.set(Math.max(-MAX, Math.min(MAX, dy * strength)))
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: 'inline-flex' }}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      onBlur={reset}
    >
      {children}
    </motion.span>
  )
}
