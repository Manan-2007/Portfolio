import { useEffect, useState } from 'react'
import { RouteContext, navigate, readPath } from '@/lib/route'

/* ────────────────────────────────────────────────────────────────────────
   A router, sized to the problem.

   This site has exactly two shapes of URL — `/` and `/work/<id>` — and a
   critical-path budget it is not worth spending 20 kB of react-router on to
   match two strings. This file and `route.js` are the whole thing: the
   History API plus a state hook.

   What it deliberately does NOT do: nested routes, loaders, param parsing
   beyond one segment, or route-level code splitting. The day any of those is
   needed, delete these two files and install react-router rather than
   growing them.
   ──────────────────────────────────────────────────────────────────────── */

export function RouterProvider({ children }) {
  const [path, setPath] = useState(readPath)

  useEffect(() => {
    const onPop = () => setPath(readPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return <RouteContext.Provider value={path}>{children}</RouteContext.Provider>
}

/**
 * An ordinary anchor that happens not to reload the page. It keeps a real
 * `href`, so middle-click, cmd-click, "open in new tab" and the status bar
 * all behave — intercepting those is the usual way a hand-rolled router ends
 * up worse than no router.
 */
export function Link({ to, children, onClick, ...rest }) {
  const handle = (event) => {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    event.preventDefault()
    navigate(to)
  }

  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  )
}
