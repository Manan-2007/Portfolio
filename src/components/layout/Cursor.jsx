import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/* How far the ring is pulled toward the centre of a magnetic target. Full
   snap feels sticky; a partial pull reads as attraction. */
const PULL = 0.42

const INTERACTIVE = 'a, button, [role="button"], [data-cursor]'

/**
 * Two-part cursor: a hard red dot that tracks the pointer exactly, and a
 * smaller lagging ring that swells over anything interactive and is pulled
 * toward the centre of elements marked `data-cursor="magnet"`. Deliberately
 * understated — it should register as a refinement, not as an effect.
 *
 * Fine pointers only — touch devices and reduced-motion users never see it,
 * and the native cursor is only hidden while this component is mounted.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [hot, setHot] = useState(false)
  const [down, setDown] = useState(false)
  const [visible, setVisible] = useState(false)

  // Written from the pointer handler, never from render.
  const magnet = useRef(null)

  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const ringRawX = useMotionValue(-200)
  const ringRawY = useMotionValue(-200)

  const ringX = useSpring(ringRawX, { stiffness: 420, damping: 34, mass: 0.55 })
  const ringY = useSpring(ringRawY, { stiffness: 420, damping: 34, mass: 0.55 })
  const glowX = useSpring(x, { stiffness: 46, damping: 22, mass: 1 })
  const glowY = useSpring(y, { stiffness: 46, damping: 22, mass: 1 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return undefined

    setEnabled(true)
    document.documentElement.dataset.cursor = 'on'

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)

      // The ring either follows the pointer or leans toward the magnet.
      const rect = magnet.current
      if (rect) {
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        ringRawX.set(e.clientX + (cx - e.clientX) * PULL)
        ringRawY.set(e.clientY + (cy - e.clientY) * PULL)
      } else {
        ringRawX.set(e.clientX)
        ringRawY.set(e.clientY)
      }

      setVisible(true)
    }

    const onOver = (e) => {
      if (!(e.target instanceof Element)) return
      const target = e.target.closest(INTERACTIVE)
      setHot(Boolean(target))
      magnet.current =
        target?.getAttribute('data-cursor') === 'magnet'
          ? target.getBoundingClientRect()
          : null
    }

    const onDown = () => setDown(true)
    const onUp = () => setDown(false)
    const onLeave = () => setVisible(false)
    // A magnet rect goes stale the moment the page moves under it.
    const dropMagnet = () => {
      magnet.current = null
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('scroll', dropMagnet, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      delete document.documentElement.dataset.cursor
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('scroll', dropMagnet)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [x, y, ringRawX, ringRawY])

  if (!enabled) return null

  return (
    <>
      {/* A single soft pool of light. Low enough to read as depth, not colour. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[1] h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: glowX,
          y: glowY,
          background:
            'radial-gradient(circle, rgba(255,30,0,0.05) 0%, rgba(255,30,0,0.018) 45%, transparent 70%)',
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Ring — 24px at rest. Small enough that it reads as a pointer rather
          than as a graphic sitting on top of the page. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[96] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: down ? 0.8 : hot ? 1.75 : 1,
          opacity: visible ? (hot ? 0.95 : 0.5) : 0,
          borderColor: hot ? 'rgba(255,30,0,0.8)' : 'rgba(244,245,247,0.35)',
          backgroundColor: hot ? 'rgba(255,30,0,0.06)' : 'rgba(255,30,0,0)',
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      />

      {/* Core dot — no spring, so the pointer never feels like it is lagging */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[97] h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red"
        style={{ x, y }}
        animate={{ opacity: visible ? 1 : 0, scale: hot ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
