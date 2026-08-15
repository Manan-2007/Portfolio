import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { navLinks, profile } from '@/data/profile'
import { scrollToId } from '@/hooks/useLenis'
import { EASE } from '@/lib/motion'

/** Marks the section currently occupying the upper third of the viewport. */
function useActiveSection(ids) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5] }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [ids])

  return active
}

const ids = navLinks.map((l) => l.id)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(ids)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    // Switch to the solid bar almost immediately: a transparent nav sitting
    // over scrolled hero copy reads as two overlapping lines of text.
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The mobile sheet takes over the viewport, so the page beneath must not scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (id) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[80] transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled || open
          ? 'border-b border-[var(--edge)] bg-ink/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* Three tracks at desktop width, not `justify-between`: the monogram
          and the call to action are different widths, so space distribution
          would leave the links visibly off-centre. Equal 1fr side columns
          pin the link row to the true centre of the bar. */}
      <nav
        className="shell flex h-[var(--nav-h)] items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr]"
        aria-label="Primary"
      >
        {/* Monogram */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            window.lenis ? window.lenis.scrollTo(0) : window.scrollTo({ top: 0 })
          }}
          data-cursor="magnet"
          className="group flex items-center gap-3 lg:justify-self-start"
          aria-label={`${profile.name} — back to top`}
        >
          <span className="h-6 w-[2px] bg-red transition-[height] duration-300 group-hover:h-7" />
          <span className="headline text-base tracking-[0.14em]">
            {profile.monogram}
          </span>
        </a>

        {/* Section links */}
        <ul className="hidden items-center gap-7 lg:flex lg:justify-self-center xl:gap-9">
          {navLinks.map((link) => {
            const isActive = active === link.id
            return (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => go(link.id)}
                  className={`group relative flex items-baseline gap-2 py-2 font-mono text-[0.75rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-silver hover:text-white'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span
                    aria-hidden="true"
                    className={isActive ? 'text-red' : 'text-slate'}
                  >
                    {link.index}
                  </span>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-marker"
                      className="absolute inset-x-0 -bottom-0.5 h-[2px] bg-red"
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-3 lg:justify-self-end">
          <button
            type="button"
            onClick={() => go('contact')}
            data-cursor="magnet"
            className="btn btn-primary hidden !px-5 !py-3 lg:inline-flex"
          >
            Get in touch
          </button>

          {/* Two hairlines rather than three bars — the glyph is lighter, and
              the tap target stays a full 44px regardless. */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className="relative block h-[11px] w-[22px]">
              <motion.span
                className="absolute left-0 top-0 block h-[1.5px] w-full origin-center bg-white"
                animate={open ? { rotate: 45, y: 4.75 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              />
              <motion.span
                className="absolute bottom-0 left-0 block h-[1.5px] w-full origin-center bg-white"
                animate={open ? { rotate: -45, y: -4.75 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Scroll progress */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-red"
        style={{ scaleX: progress }}
      />

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden border-t border-[var(--edge)] bg-ink lg:hidden"
          >
            <ul className="shell flex flex-col py-6">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, ease: EASE }}
                  className="border-b border-[var(--edge)] last:border-0"
                >
                  <button
                    type="button"
                    onClick={() => go(link.id)}
                    className="flex w-full items-baseline gap-4 py-4 text-left"
                  >
                    <span aria-hidden="true" className="data-label text-red">
                      {link.index}
                    </span>
                    <span className="headline text-2xl">{link.label}</span>
                  </button>
                </motion.li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => go('contact')}
                  className="btn btn-primary mt-6 w-full"
                >
                  Get in touch
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
