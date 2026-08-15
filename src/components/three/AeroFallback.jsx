/**
 * Static stand-in for the WebGL hero on mobile, low-end GPUs and
 * reduced-motion. Same visual idea — streaklines parting around a body —
 * rendered as one inline SVG with no script and no animation.
 */
const LINES = Array.from({ length: 26 }, (_, i) => {
  const t = (i / 25) * 2 - 1 // -1 → 1 across the frame
  const y = 50 + t * 46
  // Displacement mirrors the shader's 1/(a + d²) falloff around the body
  const push = (Math.sign(t) || 1) * (13 / (0.5 + t * t * 7)) * 0.9
  return { y, push, heat: Math.min(1, Math.abs(push) / 14) }
})

export default function AeroFallback() {
  return (
    <svg
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="streak" x1="0" x2="1">
          <stop offset="0%" stopColor="#8d949c" stopOpacity="0" />
          <stop offset="45%" stopColor="#8d949c" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8d949c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="streak-hot" x1="0" x2="1">
          <stop offset="0%" stopColor="#ff1e00" stopOpacity="0" />
          <stop offset="45%" stopColor="#ff1e00" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ff1e00" stopOpacity="0" />
        </linearGradient>
      </defs>

      {LINES.map(({ y, push, heat }, i) => (
        <path
          key={i}
          d={`M-10 ${y} C 60 ${y}, 78 ${y + push}, 100 ${y + push} S 140 ${y}, 210 ${y}`}
          fill="none"
          stroke={heat > 0.55 ? 'url(#streak-hot)' : 'url(#streak)'}
          strokeWidth={0.35}
        />
      ))}
    </svg>
  )
}
