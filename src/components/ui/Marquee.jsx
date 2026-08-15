/**
 * Infinite marquee. The track is duplicated once and translated -50%, so the
 * loop is seamless; the animation is pure CSS and never touches the main thread.
 */
export default function Marquee({ items, duration = 44 }) {
  const run = [...items, ...items]

  return (
    <div
      className="marquee relative overflow-hidden border-y border-[var(--edge)] bg-carbon py-4"
      aria-hidden="true"
    >
      {/* Fade the strip into the page edges instead of cutting it */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent md:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent md:w-32" />

      <div
        className="marquee-track flex w-max items-center gap-10 whitespace-nowrap md:gap-14"
        style={{ '--marquee-duration': `${duration}s` }}
      >
        {run.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10 md:gap-14">
            <span className="font-mono text-xs tracking-[0.2em] text-silver uppercase">
              {item}
            </span>
            <span className="h-1 w-1 shrink-0 bg-red" />
          </span>
        ))}
      </div>
    </div>
  )
}
