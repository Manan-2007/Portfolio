import Magnetic from './Magnetic'

/**
 * Notched button. Renders an `<a>` when given an href, a `<button>` otherwise,
 * so keyboard and screen-reader semantics stay correct in both cases.
 */
export default function Button({
  children,
  href,
  variant = 'primary',
  icon: Icon,
  magnetic = true,
  className = '',
  ...rest
}) {
  const classes = `btn btn-${variant} ${className}`
  const external = href?.startsWith('http')

  const content = (
    <>
      {children}
      {Icon && <Icon className="text-[1.05em]" />}
    </>
  )

  const el = href ? (
    <a
      href={href}
      className={classes}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...rest}
    >
      {content}
    </a>
  ) : (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  )

  return magnetic ? <Magnetic>{el}</Magnetic> : el
}
