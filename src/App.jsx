import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'
import { useLenis, scrollToId } from '@/hooks/useLenis'
import { useRoute } from '@/lib/route'
import { ticker } from '@/data/profile'

import Preloader, { PRELOAD_MS } from '@/components/layout/Preloader'
import Cursor from '@/components/layout/Cursor'
import GridOverlay from '@/components/layout/GridOverlay'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Work from '@/components/sections/Work'
import Skills from '@/components/sections/Skills'
import Achievements from '@/components/sections/Achievements'
import Contact from '@/components/sections/Contact'
import Marquee from '@/components/ui/Marquee'

/* The case studies are several thousand words of prose that a visitor to the
   home page never reads. Split out, the same way three.js is — a deep page is
   a deliberate click, and paying for it on first paint is the wrong trade. */
const CaseStudy = lazy(() => import('@/components/case/CaseStudy'))

function Home({ ready }) {
  return (
    <>
      <Hero ready={ready} />
      <Marquee items={ticker} />
      <About />
      <Work />
      <Skills />
      <Achievements />
      <Contact />
    </>
  )
}

export default function App() {
  const reduced = useReducedMotion()
  const { isTouch } = useDeviceCapability()
  const [loading, setLoading] = useState(true)
  const path = useRoute()

  const studyId = path.startsWith('/work/') ? path.slice(6) : null

  // Smooth scroll is a desktop nicety; touch platforms already do it better.
  useLenis(!reduced && !isTouch && !loading)

  useEffect(() => {
    const duration = reduced ? 200 : PRELOAD_MS
    const start = performance.now()
    const timer = setTimeout(() => setLoading(false), duration)

    // Background tabs throttle timers, which can strand the start sequence on
    // screen. Re-check the clock the moment the tab is looked at again.
    const onVisible = () => {
      if (!document.hidden && performance.now() - start >= duration) {
        setLoading(false)
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [reduced])

  // Nothing should scroll underneath the start sequence.
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [loading])

  /* A route change has to land somewhere deliberate. A hash means the visitor
     is coming back to a section they were already reading, so jump straight
     to it; anything else starts at the top. Two frames, because the first one
     is the render that mounts the destination and the second is the one where
     it has a height to measure. */
  useEffect(() => {
    if (loading) return undefined

    const hash = window.location.hash.slice(1)
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        if (hash) {
          scrollToId(hash, { immediate: true })
        } else if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true })
        } else {
          window.scrollTo(0, 0)
        }
      })
    })

    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [path, loading])

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only z-[130] bg-red px-5 py-3 font-mono text-xs uppercase tracking-widest text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <AnimatePresence>{loading && <Preloader key="preloader" />}</AnimatePresence>

      <Cursor />
      <GridOverlay />
      <Navbar />

      <main id="main" className="relative z-10">
        {studyId ? (
          // Reserves roughly a screen so the footer does not flash up under
          // the nav while the chunk arrives.
          <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
            <CaseStudy id={studyId} />
          </Suspense>
        ) : (
          <Home ready={!loading} />
        )}
      </main>

      <Footer />
    </MotionConfig>
  )
}
