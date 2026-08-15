import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, useReducedMotion } from 'framer-motion'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'
import { useLenis } from '@/hooks/useLenis'
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

export default function App() {
  const reduced = useReducedMotion()
  const { isTouch } = useDeviceCapability()
  const [loading, setLoading] = useState(true)

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
        <Hero ready={!loading} />
        <Marquee items={ticker} />
        <About />
        <Work />
        <Skills />
        <Achievements />
        <Contact />
      </main>

      <Footer />
    </MotionConfig>
  )
}
