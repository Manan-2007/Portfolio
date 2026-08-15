import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EASE, EASE_IN_OUT } from '@/lib/motion'
import { profile } from '@/data/profile'

/* Five towers, each a pair of stacked pods holding two lamps — the real
   start-gantry arrangement. Only the bottom lamp of a tower ever
   illuminates; the other three stay dark, which is what gives the gantry
   its single row of five red lights. */
const TOWERS = [0, 1, 2, 3, 4]
const PODS = [0, 1]
const LAMPS = [0, 1]
const LAST_POD = PODS.length - 1
const LAST_LAMP = LAMPS.length - 1

/* Exported so App sizes the loading window off the same clock rather than a
   second hard-coded guess. These are the original numbers — do not stretch
   them to buy reading time for the closing line. */
export const LIGHTS_OUT = 1560
export const PRELOAD_MS = 2050

const OFF = '#242428'
const ON = '#ff1e00'

/**
 * Lights-out start sequence: five lights come up in turn, hold, then go out
 * together — which is exactly when a race starts.
 *
 * The lamps are animated by Framer rather than CSS transitions so the ramp
 * up, the glow and the scale settle on one timeline instead of three
 * independent `transition-all` runs. App collapses the whole thing to a
 * blink under reduced motion.
 */
export default function Preloader() {
  const [lit, setLit] = useState(0)
  const [out, setOut] = useState(false)

  useEffect(() => {
    const timers = TOWERS.map((i) =>
      setTimeout(() => setLit(i + 1), 320 + i * 190)
    )
    timers.push(setTimeout(() => setOut(true), LIGHTS_OUT))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-ink px-6"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.75, ease: EASE_IN_OUT } }}
      role="status"
      aria-label="Loading"
    >
      {/* Light gantry */}
      <div className="flex gap-2.5 md:gap-4">
        {TOWERS.map((tower) => {
          const on = !out && lit > tower
          return (
            <div key={tower} className="flex flex-col gap-1 md:gap-1.5">
              {PODS.map((pod) => (
                <div
                  key={pod}
                  className="flex flex-col gap-2 rounded-[0.9rem] bg-[#0a0a0c] p-2 md:gap-2.5 md:rounded-[1.15rem] md:p-2.5"
                >
                  {LAMPS.map((lamp) => {
                    // Only the bottom lamp of the bottom pod illuminates —
                    // that is what leaves one clean row of five red lights.
                    const isSignal = pod === LAST_POD && lamp === LAST_LAMP
                    const active = on && isSignal
                    return (
                      <motion.span
                        key={lamp}
                        className="block h-[1.35rem] w-[1.35rem] rounded-full md:h-7 md:w-7"
                        initial={false}
                        animate={{
                          backgroundColor: active ? ON : OFF,
                          boxShadow: active
                            ? '0 0 26px 5px rgba(255,30,0,0.45)'
                            : '0 0 0px 0px rgba(255,30,0,0)',
                          scale: active ? 1 : 0.94,
                        }}
                        // Coming up is a soft ramp; going out is a hard cut,
                        // because that snap is the whole point of the sequence.
                        transition={
                          out
                            ? { duration: 0.1, ease: 'easeIn' }
                            : { duration: 0.32, ease: EASE }
                        }
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* The line lands on the same beat the lights go out. No `key` here —
          remounting would flash it back to zero instead of lifting it. */}
      <motion.p
        // White throughout, with the reveal carried by opacity alone — the
        // pre-reveal state was slate at 0.4, which on a large panel was closer
        // to invisible than to understated.
        className="data-label mt-10 text-center !text-[0.75rem] !tracking-[0.16em] !text-white xs:!tracking-[0.22em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: out ? 1 : 0.72 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        {out ? 'It’s lights out and away we go' : profile.name}
      </motion.p>

      <div className="mt-6 h-px w-40 overflow-hidden bg-[var(--edge-strong)]">
        <motion.div
          className="h-full w-full origin-left bg-red"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: EASE_IN_OUT }}
        />
      </div>
    </motion.div>
  )
}
