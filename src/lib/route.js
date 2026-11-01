import { createContext, useContext } from 'react'

/* ────────────────────────────────────────────────────────────────────────
   Routing core — the parts that are not components.

   Split from `router.jsx` so that file exports components and nothing else;
   mixing the two breaks React Fast Refresh, which silently stops hot-reloading
   the whole module graph below it.
   ──────────────────────────────────────────────────────────────────────── */

export const RouteContext = createContext('/')

/** Normalised pathname — no trailing slash, never empty. */
export function readPath() {
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

/**
 * Push a new URL and re-render. `to` may carry a hash (`/#work`), which the
 * route effect in App turns into a scroll once the destination has painted.
 */
export function navigate(to, { replace = false } = {}) {
  const [path, hash] = to.split('#')
  const next = (path.replace(/\/+$/, '') || '/') + (hash ? `#${hash}` : '')
  window.history[replace ? 'replaceState' : 'pushState']({}, '', next)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function useRoute() {
  return useContext(RouteContext)
}
