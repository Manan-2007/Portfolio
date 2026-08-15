/* Shared motion vocabulary. Everything on the site eases the same way:
   fast off the line, damped on arrival. Nothing overshoots. */

export const EASE = [0.16, 1, 0.3, 1]
export const EASE_IN_OUT = [0.65, 0, 0.35, 1]

/** Heading lines rise out of a CSS overflow mask. */
export const lineRise = (delay = 0) => ({
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 0.9, ease: EASE, delay } },
})

export const fadeUp = (delay = 0, y = 20) => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } },
})

export const stagger = (gap = 0.07, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})

export const staggerItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

/** Left-to-right wipe — the site's "speed" direction. */
export const wipeIn = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  show: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 0.8, ease: EASE },
    transitionEnd: { clipPath: 'none' },
  },
}

export const VIEWPORT = { once: true, margin: '-12% 0px -8% 0px' }
