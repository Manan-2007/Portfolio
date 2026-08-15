import { techMark } from './techBrands'

/**
 * A single tech or issuer logo. Renders in `currentColor`; callers swap in
 * the brand hex from `brandColor` on hover.
 */
export function TechIcon({ name, className, ...rest }) {
  const mark = techMark(name)
  if (!mark) return null
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <path d={mark[1]} />
    </svg>
  )
}
