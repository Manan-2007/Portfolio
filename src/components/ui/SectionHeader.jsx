import { Reveal } from './Reveal'

/**
 * Every section opens the same way: an indexed eyebrow, a condensed title,
 * an optional note column, and a hairline that closes the block.
 */
export default function SectionHeader({ index, eyebrow, title, note, id }) {
  return (
    <header className="mb-14 md:mb-20">
      <Reveal>
        <div className="flex items-baseline gap-4">
          <span className="data-label tick">{eyebrow}</span>
          {index && (
            <span
              aria-hidden="true"
              className="data-label ml-auto text-slate/60 tabular-nums"
            >
              {index}
            </span>
          )}
        </div>
      </Reveal>

      <div className="mt-5 grid gap-6 md:grid-cols-12 md:items-end">
        <Reveal delay={0.06} className="md:col-span-7">
          <h2
            id={id}
            className="headline text-[clamp(2.1rem,5.6vw,4rem)]"
          >
            {title}
          </h2>
        </Reveal>

        {note && (
          <Reveal delay={0.12} className="md:col-span-5">
            <p className="max-w-md text-pretty text-[0.95rem] leading-relaxed text-silver md:text-right md:ml-auto">
              {note}
            </p>
          </Reveal>
        )}
      </div>

      <Reveal delay={0.16}>
        <div className="hairline mt-8" />
      </Reveal>
    </header>
  )
}
