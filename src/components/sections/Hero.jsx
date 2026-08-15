import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { profile, socials } from '@/data/profile'
import { usePointer } from '@/hooks/usePointer'
import { useDeviceCapability } from '@/hooks/useDeviceCapability'
import { scrollToId } from '@/hooks/useLenis'
import { EASE, fadeUp, lineRise } from '@/lib/motion'
import Button from '@/components/ui/Button'
import AeroFallback from '@/components/three/AeroFallback'
import CanvasBoundary from '@/components/three/CanvasBoundary'
import {
  ArrowDownIcon,
  DownloadIcon,
  GitHubIcon,
  LeetCodeIcon,
  LinkedInIcon,
} from '@/lib/icons'

const HeroCanvas = lazy(() => import('@/components/three/HeroCanvas'))

const ICONS = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  LeetCode: LeetCodeIcon,
}

const StaticField = () => (
  <div className="h-full w-full opacity-70">
    <AeroFallback />
  </div>
)

export default function Hero({ ready }) {
  const sectionRef = useRef(null)
  const pointer = usePointer(0.05)
  const { use3D } = useDeviceCapability()
  const [mounted, setMounted] = useState(false)

  // The canvas is only worth rendering while the hero is on screen.
  const inView = useInView(sectionRef, { margin: '120px' })

  // Defer the WebGL bundle to idle time so it never competes with first paint.
  // requestIdleCallback is raced against a hard deadline: Chrome does not fire
  // idle callbacks in a hidden tab, so on its own it can leave the canvas
  // permanently unmounted for anyone who opens the page in a background tab.
  // (It also must stay bound to `window`, or calling it throws.)
  useEffect(() => {
    if (!use3D || !ready) return undefined

    const mount = () => setMounted(true)
    const idleId = window.requestIdleCallback?.(mount, { timeout: 800 })
    const timeoutId = window.setTimeout(mount, 800)

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
      window.clearTimeout(timeoutId)
    }
  }, [use3D, ready])

  const animate = ready ? 'show' : 'hidden'

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pb-12 pt-[calc(var(--nav-h)+1rem)]"
      aria-label="Introduction"
    >
      {/* Flow field */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        {use3D ? (
          mounted && (
            <CanvasBoundary fallback={<StaticField />}>
              <Suspense fallback={null}>
                <HeroCanvas pointerRef={pointer} active={inView} />
              </Suspense>
            </CanvasBoundary>
          )
        ) : (
          <StaticField />
        )}
        {/* Scrim over the text column only — the flow stays readable elsewhere */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink from-15% via-ink/70 via-45% to-transparent to-70%" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="shell relative z-10 w-full">
        {/* Eyebrow */}
        <motion.p
          className="data-label tick"
          variants={fadeUp(0.15, 12)}
          initial="hidden"
          animate={animate}
        >
          {profile.eyebrow}
        </motion.p>

        {/* Name */}
        <h1 className="mt-5">
          <span className="sr-only">{profile.name}</span>
          <span className="mask-line" aria-hidden="true">
            <motion.span
              className="display block text-[clamp(2.75rem,min(12vw,17vh),9rem)]"
              variants={lineRise(0.28)}
              initial="hidden"
              animate={animate}
            >
              {profile.first}
            </motion.span>
          </span>
          <span className="mask-line" aria-hidden="true">
            <motion.span
              className="display block text-[clamp(2.75rem,min(12vw,17vh),9rem)] text-transparent"
              // The outline has to scale with the letterform. A flat 1px hairline
              // is legible at phone sizes and effectively invisible once the type
              // is 140px tall on a desktop monitor.
              style={{
                WebkitTextStrokeWidth: 'clamp(1.5px, 0.26vw, 3.5px)',
                WebkitTextStrokeColor: 'var(--color-silver)',
              }}
              variants={lineRise(0.38)}
              initial="hidden"
              animate={animate}
            >
              {profile.last}
            </motion.span>
          </span>
        </h1>

        {/* Thesis — set in the display face, not the mono one, so it belongs
            to the same type system as the name above it. The separators take
            the accent colour rather than being neutral punctuation. */}
        <motion.p
          className="mt-7 text-[1.4rem] lowercase leading-none tracking-[-0.005em] text-white md:text-[1.9rem]"
          style={{ fontVariationSettings: "'wdth' 96, 'wght' 500" }}
          variants={fadeUp(0.58)}
          initial="hidden"
          animate={animate}
        >
          {profile.thesis.split(' · ').map((word, i) => (
            <span key={word}>
              {i > 0 && (
                <span aria-hidden="true" className="mx-3 text-red md:mx-4">
                  ·
                </span>
              )}
              {word}
            </span>
          ))}
        </motion.p>

        <motion.p
          className="mt-4 max-w-xl text-pretty text-[1.02rem] leading-relaxed text-silver"
          variants={fadeUp(0.66)}
          initial="hidden"
          animate={animate}
        >
          {profile.hook}
        </motion.p>

        {/* Actions */}
        <motion.div
          className="btn-row mt-9 flex flex-wrap items-center gap-4"
          variants={fadeUp(0.76)}
          initial="hidden"
          animate={animate}
        >
          <Button onClick={() => scrollToId('work')} icon={ArrowDownIcon}>
            See the work
          </Button>
          <Button
            href={profile.resumeFile}
            variant="ghost"
            icon={DownloadIcon}
            download={profile.resumeName}
          >
            Résumé
          </Button>
        </motion.div>

        {/* Where to find him */}
        <motion.ul
          className="mt-10 flex items-center gap-3"
          variants={fadeUp(0.9)}
          initial="hidden"
          animate={animate}
        >
          {socials.map((social) => {
            const Icon = ICONS[social.label]
            return (
              <li key={social.label}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="magnet"
                  aria-label={`${social.label} — ${social.handle}`}
                  className="group relative flex h-12 w-12 items-center justify-center border border-[var(--edge)] bg-carbon/70 text-silver backdrop-blur-sm transition-colors duration-300 hover:border-red hover:text-red"
                >
                  <Icon className="text-[1.2rem] transition-transform duration-300 group-hover:-translate-y-0.5" />
                  {/* Corner tick appears on hover — the site's panel motif */}
                  <span className="absolute -bottom-px -right-px h-2 w-2 scale-0 bg-red transition-transform duration-300 group-hover:scale-100" />
                </a>
              </li>
            )
          })}
        </motion.ul>
      </div>

      {/* Scroll cue — only where there is vertical room below the links,
          otherwise it collides with them on short laptop viewports. */}
      <motion.button
        type="button"
        onClick={() => scrollToId('about')}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 [@media(min-height:920px)]:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
        aria-label="Scroll to about"
      >
        <span className="data-label !text-[0.625rem]">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-[var(--edge-strong)]">
          <motion.span
            className="absolute left-0 top-0 block h-3 w-px bg-red"
            animate={{ y: [-12, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.button>
    </section>
  )
}
