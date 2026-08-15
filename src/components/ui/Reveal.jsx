import { motion } from 'framer-motion'
import { EASE, VIEWPORT, stagger, staggerItem } from '@/lib/motion'

/** Fade-and-rise once, on scroll into view. */
export function Reveal({ children, delay = 0, y = 26, className, as = 'div' }) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

/** Parent that staggers its `<RevealItem>` children. */
export function RevealGroup({ children, className, gap = 0.07, delay = 0, as = 'div' }) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={stagger(gap, delay)}
    >
      {children}
    </Tag>
  )
}

export function RevealItem({ children, className, as = 'div' }) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag className={className} variants={staggerItem}>
      {children}
    </Tag>
  )
}
