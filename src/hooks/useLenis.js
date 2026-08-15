import { useEffect } from 'react'

/**
 * Smooth scroll, loaded lazily so the Lenis bundle never blocks first paint.
 * Disabled outright under reduced-motion and on touch, where the platform's
 * own momentum scrolling is better than anything JS can fake.
 *
 * @param {boolean} enabled
 */
export function useLenis(enabled) {
  useEffect(() => {
    if (!enabled) return undefined

    let lenis
    let frame = 0
    let cancelled = false

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return

      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
      })

      const raf = (time) => {
        lenis.raf(time)
        frame = requestAnimationFrame(raf)
      }
      frame = requestAnimationFrame(raf)
      window.lenis = lenis
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      lenis?.destroy()
      delete window.lenis
    }
  }, [enabled])
}

/** Scrolls to a section id through Lenis when present, natively otherwise. */
export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (window.lenis) {
    window.lenis.scrollTo(el, { offset: -8 })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
