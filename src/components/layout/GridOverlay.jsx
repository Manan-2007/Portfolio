/**
 * Page furniture: a fixed measuring grid and corner registration marks.
 * Pure CSS, no scripting, sits behind everything at 3% opacity — it should
 * register as texture, not as a graphic.
 */
export default function GridOverlay() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="grid-lines absolute inset-0 opacity-[0.55]" />
      <div className="weave absolute inset-0 opacity-40" />

      {/* Registration marks */}
      <span className="absolute left-5 top-5 block h-4 w-[1px] bg-red/40 md:left-8 md:top-8" />
      <span className="absolute left-5 top-5 block h-[1px] w-4 bg-red/40 md:left-8 md:top-8" />
      <span className="absolute right-5 top-5 block h-4 w-[1px] bg-red/40 md:right-8 md:top-8" />
      <span className="absolute right-5 top-5 block h-[1px] w-4 bg-red/40 md:right-8 md:top-8" />

      {/* Vignette keeps the centre of the page the brightest thing on screen */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 40%, transparent 40%, rgba(5,5,6,0.85) 100%)',
        }}
      />
    </div>
  )
}
