import { useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE } from '@/lib/motion'
import { disciplines } from '@/data/projects'
import { RevealItem } from '@/components/ui/Reveal'
import { ExternalIcon, GitHubIcon, PlusIcon } from '@/lib/icons'

/**
 * One project. Collapsed it reads as a single scannable line — number, name,
 * discipline, stack. Open it becomes the full engineering brief. Keeping the
 * depth behind a disclosure is what lets eight projects sit on one screen
 * without turning into a card wall.
 *
 * Deliberately typographic: no thumbnails, no screenshots. The work is
 * described, not illustrated.
 *
 * The row publishes its discipline colour as `--tone`, which the number, the
 * name, the toggle and the `.edge-wipe` rail all read from — so the colour
 * means the same thing everywhere it appears. The legend above the list is
 * what makes it legible rather than decorative.
 */
export default function ProjectRow({ project, index, open, onToggle }) {
  const panelId = useId()
  const tone = disciplines[project.discipline]

  return (
    <RevealItem>
      <div
        data-open={open}
        style={{ '--tone': tone.tone }}
        className={`edge-wipe group relative border-b border-[var(--edge)] transition-colors duration-500 ${
          open ? 'bg-surface' : 'bg-carbon hover:bg-surface/70'
        }`}
      >
        <h3>
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={panelId}
            className="grid w-full grid-cols-[2.25rem_1fr_2.25rem] items-center gap-4 px-4 py-6 text-left sm:gap-5 md:grid-cols-[3rem_1fr_auto_2.5rem] md:gap-7 md:px-8 md:py-7"
          >
            {/* Position — always carries the discipline colour, so the list
                doubles as a colour key you can read down. */}
            <span
              className="font-mono text-sm font-bold tabular-nums text-[var(--tone)] md:text-base"
              title={tone.label}
            >
              {String(index + 1).padStart(2, '0')}
              <span className="sr-only"> — {tone.label}</span>
            </span>

            {/* Name — wraps rather than truncating; a half-shown project name
                is worse than a two-line row. */}
            <span className="min-w-0">
              <span
                className={`headline block text-balance text-[1.3rem] transition-colors duration-300 xs:text-[1.45rem] md:text-[1.85rem] ${
                  open ? 'text-[var(--tone)]' : 'group-hover:text-[var(--tone)]'
                }`}
              >
                {project.name}
              </span>
              {/* Tighter tracking on phones so the kind and year stay on one
                  line inside the narrow middle column. */}
              <span className="data-label mt-2 block !tracking-[0.08em] xs:!tracking-[0.16em]">
                {project.kind}
                <span className="text-slate/50"> · {project.year}</span>
              </span>
            </span>

            {/* Stack preview — desktop only, the row must stay compact on phones */}
            <span className="hidden max-w-[18rem] flex-wrap justify-end gap-1.5 md:flex">
              {project.stack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="border border-[var(--edge)] px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-slate transition-colors duration-300 group-hover:border-red/30 group-hover:text-silver"
                >
                  {tech}
                </span>
              ))}
            </span>

            {/* Only the glyph rotates — spinning the bordered box would turn
                the control into a diamond. */}
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center justify-self-end border transition-colors duration-300 ${
                open
                  ? 'border-[var(--tone)] text-[var(--tone)]'
                  : 'border-[var(--edge)] text-silver group-hover:border-[var(--tone)] group-hover:text-[var(--tone)]'
              }`}
            >
              <motion.span
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex"
              >
                <PlusIcon className="text-base" />
              </motion.span>
            </span>
          </button>
        </h3>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.5, ease: EASE },
                opacity: { duration: 0.3, ease: EASE },
              }}
              className="overflow-hidden"
            >
              {/* The container opens first, the contents settle into it */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12, ease: EASE }}
                className="grid gap-8 px-4 pb-10 md:grid-cols-12 md:gap-12 md:px-8 md:pl-[7rem]"
              >
                <div className="md:col-span-7">
                  <p className="text-pretty text-lg leading-snug text-white md:text-xl">
                    {project.headline}
                  </p>
                  <p className="mt-4 leading-relaxed text-silver">{project.summary}</p>

                  <ul className="mt-7 space-y-3">
                    {project.detail.map((line, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-[0.9rem] leading-relaxed text-silver"
                      >
                        <span
                          className="mt-2 h-px w-4 shrink-0 bg-red"
                          aria-hidden="true"
                        />
                        {line}
                      </li>
                    ))}
                  </ul>

                  <div className="btn-row mt-8 flex flex-wrap gap-3">
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost !px-5 !py-3"
                    >
                      <GitHubIcon className="text-[1.05em]" />
                      Repository
                    </a>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary !px-5 !py-3"
                      >
                        Live site
                        <ExternalIcon className="text-[1.05em]" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Readout + full stack, as a spec column beside the prose */}
                <div className="md:col-span-5">
                  {/* One hairline panel with internal dividers — the same
                      construction as the About spec card, rather than a filled
                      grid that reads as a different material. `flex-col-reverse`
                      puts the value on top while keeping dt before dd in the
                      markup. */}
                  <dl className="grid grid-cols-3 divide-x divide-[var(--edge)] border border-[var(--edge)]">
                    {project.stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="flex flex-col-reverse justify-end px-2.5 py-4 text-center transition-colors duration-300 hover:bg-elevated"
                      >
                        <dt className="data-label mt-2 !text-[0.5625rem] !tracking-[0.12em]">
                          {stat.label}
                        </dt>
                        <dd className="data-value text-balance text-[1.05rem] leading-tight md:text-xl">
                          {stat.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-6">
                    <span className="data-label !text-[0.625rem]">Built with</span>
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="border border-[var(--edge)] px-2.5 py-1.5 font-mono text-[0.6875rem] text-silver transition-colors duration-300 hover:border-red/50 hover:text-white"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RevealItem>
  )
}
