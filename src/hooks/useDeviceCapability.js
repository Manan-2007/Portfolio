import { useEffect, useState } from 'react'

/** WebGL support never changes for a document, so probe it exactly once. */
let webglSupport = null
function hasWebGL() {
  if (webglSupport !== null) return webglSupport
  try {
    const canvas = document.createElement('canvas')
    webglSupport = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    webglSupport = false
  }
  return webglSupport
}

const QUERIES = {
  small: '(max-width: 899px)',
  coarse: '(pointer: coarse)',
  reduced: '(prefers-reduced-motion: reduce)',
}

function measure() {
  const small = window.matchMedia(QUERIES.small).matches
  const isTouch = window.matchMedia(QUERIES.coarse).matches
  const reduced = window.matchMedia(QUERIES.reduced).matches

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || small
  // A low core count is the cheapest proxy for "this will not hold 60fps".
  const weakCPU = (navigator.hardwareConcurrency ?? 8) <= 4

  return {
    use3D: hasWebGL() && !isMobile && !reduced && !weakCPU,
    isMobile,
    isTouch,
    reduced,
  }
}

/**
 * Decides whether this device earns the WebGL hero.
 *
 * Re-evaluated on media-query changes rather than measured once: a tab that
 * is restored, prerendered or still hidden reports a zero-width viewport on
 * first render, and a one-shot check would demote that visitor permanently.
 */
export function useDeviceCapability() {
  const [caps, setCaps] = useState(() =>
    typeof window === 'undefined'
      ? { use3D: false, isMobile: false, isTouch: false, reduced: false }
      : measure()
  )

  useEffect(() => {
    const lists = Object.values(QUERIES).map((q) => window.matchMedia(q))
    const update = () => setCaps(measure())

    lists.forEach((list) => list.addEventListener('change', update))
    // A hidden tab becoming visible is the case matchMedia alone can miss.
    document.addEventListener('visibilitychange', update)
    update()

    return () => {
      lists.forEach((list) => list.removeEventListener('change', update))
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return caps
}
