const TONE = {
  green: 'bg-green',
  purple: 'bg-purple',
  amber: 'bg-amber',
  red: 'bg-red',
}

/** Timing-screen status pill. Colour carries meaning; it is never decorative. */
export default function StatusDot({ tone = 'green', label, pulse = false }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`h-1.5 w-1.5 shrink-0 ${TONE[tone] ?? TONE.green} ${pulse ? 'pulse-dot' : ''}`}
      />
      {label && <span className="data-label !tracking-[0.16em] text-silver">{label}</span>}
    </span>
  )
}
