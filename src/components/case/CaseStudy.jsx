import { useEffect } from 'react'
import { disciplines, projects } from '@/data/projects'
import { studies, studyOrder } from '@/data/studies'
import { profile } from '@/data/profile'
import { Link } from '@/lib/router'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { ArrowIcon, ExternalIcon, GitHubIcon } from '@/lib/icons'

/* ────────────────────────────────────────────────────────────────────────
   One project, at length.

   The row in Work says what a thing is. This says what was decided and how
   it is known to have been right — which is the part a reviewer is actually
   reading for, and the part three stats cannot carry.

   Same construction as the rest of the site: hairline rules, mono labels,
   notched panels, and the project's discipline colour published as `--tone`
   so the accent means the same thing here as it does in the list.
   ──────────────────────────────────────────────────────────────────────── */

/** Section opener — the page-level SectionHeader, scaled down one step. */
function Heading({ children, note }) {
  return (
    <Reveal>
      <div className="mb-8 border-t border-[var(--edge)] pt-8">
        <h2 className="data-label tick !text-[0.6875rem]">{children}</h2>
        {note && (
          <p className="mt-4 max-w-2xl text-pretty text-[0.9rem] leading-relaxed text-slate">
            {note}
          </p>
        )}
      </div>
    </Reveal>
  )
}

export default function CaseStudy({ id }) {
  const project = projects.find((p) => p.id === id)
  const study = studies[id]

  const order = studyOrder(projects)
  const at = order.indexOf(id)
  const prev = at > 0 ? projects.find((p) => p.id === order[at - 1]) : null
  const next = at < order.length - 1 ? projects.find((p) => p.id === order[at + 1]) : null

  const tone = project ? disciplines[project.discipline] : null

  useEffect(() => {
    if (!project) return undefined
    const previous = document.title
    document.title = `${project.name} — ${profile.name}`
    return () => {
      document.title = previous
    }
  }, [project])

  // Reachable by typing a URL, so it has to resolve to something.
  if (!project || !study) {
    return (
      <div className="shell flex min-h-[70vh] flex-col justify-center py-32">
        <span className="data-label tick">404</span>
        <h1 className="headline mt-6 text-[clamp(2rem,6vw,3.5rem)]">
          No case study here
        </h1>
        <p className="mt-5 max-w-md leading-relaxed text-silver">
          That project either does not exist or does not have a deep page.
        </p>
        <Link to="/#work" className="btn btn-primary mt-10 self-start !px-6 !py-3.5">
          Back to work
          <ArrowIcon className="text-[1.05em]" />
        </Link>
      </div>
    )
  }

  return (
    <article style={{ '--tone': tone.tone }} className="shell pb-28 pt-28 md:pt-36">
      {/* ── Back ─────────────────────────────────────────────────────── */}
      <Reveal y={14}>
        <Link
          to="/#work"
          data-cursor="magnet"
          className="group inline-flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-slate transition-colors duration-300 hover:text-red"
        >
          <ArrowIcon className="rotate-180 text-base transition-transform duration-300 group-hover:-translate-x-1.5" />
          All work
        </Link>
      </Reveal>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="mt-10">
        <Reveal delay={0.04}>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0"
                style={{ background: tone.tone }}
              />
              <span className="data-label !text-[0.625rem] !tracking-[0.14em]">
                {tone.label}
              </span>
            </span>
            <span className="data-label !text-[0.625rem] !tracking-[0.14em] text-slate/60">
              {project.kind} · {project.year}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="display mt-6 text-[clamp(2.4rem,8vw,5.5rem)]">
            {project.name}
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-7 max-w-3xl text-balance text-xl leading-snug text-white md:text-2xl">
            {project.headline}
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-silver">
            {project.summary}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="btn-row mt-9 flex flex-wrap gap-3">
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
        </Reveal>
      </header>

      {/* ── Readout ──────────────────────────────────────────────────── */}
      <Reveal delay={0.24}>
        <dl className="mt-14 grid grid-cols-3 divide-x divide-[var(--edge)] border border-[var(--edge)]">
          {project.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse justify-end px-3 py-6 text-center transition-colors duration-300 hover:bg-elevated md:py-7"
            >
              <dt className="data-label mt-2.5 !text-[0.5625rem] !tracking-[0.12em]">
                {stat.label}
              </dt>
              <dd className="data-value text-balance text-[1.35rem] leading-tight md:text-3xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* ── The problem ──────────────────────────────────────────────── */}
      <section className="mt-20">
        <Heading>The problem</Heading>
        <RevealGroup className="grid gap-6 md:grid-cols-2 md:gap-10">
          {study.problem.map((para, i) => (
            <RevealItem key={i}>
              <p className="text-pretty text-[1.05rem] leading-relaxed text-silver">
                {para}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Decisions ────────────────────────────────────────────────── */}
      <section className="mt-20">
        <Heading note="The calls that shaped it, and the reasoning that is worth defending.">
          Decisions
        </Heading>
        <RevealGroup className="border-t border-[var(--edge)]" gap={0.05}>
          {study.decisions.map((d, i) => (
            <RevealItem key={d.title}>
              <div className="edge-wipe group relative grid gap-3 border-b border-[var(--edge)] bg-carbon px-4 py-7 transition-colors duration-500 hover:bg-surface md:grid-cols-12 md:gap-8 md:px-8">
                <div className="flex items-baseline gap-4 md:col-span-4">
                  <span className="font-mono text-sm font-bold tabular-nums text-[var(--tone)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-balance text-[1.05rem] font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-[var(--tone)]">
                    {d.title}
                  </h3>
                </div>
                <p className="text-pretty leading-relaxed text-silver md:col-span-8">
                  {d.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ── Pipeline ─────────────────────────────────────────────────── */}
      {study.flow && (
        <section className="mt-20">
          <Heading>{study.flow.label}</Heading>
          <RevealGroup className="grid gap-px bg-[var(--edge)] sm:grid-cols-2 lg:grid-cols-4" gap={0.04}>
            {study.flow.steps.map((step, i) => (
              <RevealItem key={step}>
                <div className="flex h-full flex-col justify-between gap-5 bg-carbon p-5 transition-colors duration-300 hover:bg-surface">
                  <span className="data-label !text-[0.5625rem] !tracking-[0.14em] text-slate/60 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-pretty text-[0.9rem] leading-snug text-silver">
                    {step}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {/* ── Measured ─────────────────────────────────────────────────── */}
      {study.table && (
        <section className="mt-20">
          <Heading note={study.table.caption}>Measured</Heading>
          <Reveal>
            {/* Scrolls rather than wraps on phones — a measurement table is
                unreadable once the left column starts folding. Any number of
                columns: the first cell of a row is its header, the rest are
                values, so a comparison across people reads the same way a
                two-column outcome table does. */}
            <div className="overflow-x-auto border border-[var(--edge)]">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--edge)]">
                    {study.table.head.map((h, i) => (
                      <th
                        key={i}
                        scope="col"
                        className="data-label !text-[0.5625rem] !tracking-[0.14em] px-5 py-4"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {study.table.rows.map((row) => {
                    const [label, ...values] = row
                    return (
                      <tr
                        key={label}
                        className="border-b border-[var(--edge)] last:border-b-0 transition-colors duration-300 hover:bg-elevated"
                      >
                        <th
                          scope="row"
                          className="px-5 py-4 text-[0.9rem] font-normal text-silver"
                        >
                          {label}
                        </th>
                        {values.map((cell, i) => (
                          <td
                            key={i}
                            className={`px-5 py-4 font-mono text-[0.8rem] ${
                              /^Rejected/.test(cell) ? 'text-slate' : 'text-white'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>
      )}

      {/* ── Rejected ─────────────────────────────────────────────────── */}
      {study.rejected && (
        <section className="mt-20">
          <Heading note="Ideas that sounded right and did not survive contact with the evaluation harness.">
            Tried and dropped
          </Heading>
          <RevealGroup className="grid gap-px bg-[var(--edge)] md:grid-cols-2" gap={0.05}>
            {study.rejected.map((r) => (
              <RevealItem key={r.title}>
                <div className="flex h-full flex-col gap-3.5 bg-carbon p-6 transition-colors duration-300 hover:bg-surface">
                  <h3 className="text-[1rem] font-semibold leading-snug text-white">
                    {r.title}
                  </h3>
                  <p className="text-pretty text-[0.9rem] leading-relaxed text-silver">
                    {r.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {/* ── Honestly ─────────────────────────────────────────────────── */}
      {study.honest && (
        <section className="mt-20">
          <Heading>What it does not do</Heading>
          <RevealGroup className="grid gap-6 md:grid-cols-2 md:gap-10">
            {study.honest.map((para, i) => (
              <RevealItem key={i}>
                <p className="text-pretty leading-relaxed text-silver">{para}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      {/* ── Stack ────────────────────────────────────────────────────── */}
      <section className="mt-20">
        <Heading>Built with</Heading>
        <Reveal>
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="border border-[var(--edge)] px-3 py-2 font-mono text-[0.6875rem] text-silver transition-colors duration-300 hover:border-red/50 hover:text-white"
              >
                {tech}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Prev / next ──────────────────────────────────────────────── */}
      <nav aria-label="Other case studies" className="mt-24 border-t border-[var(--edge)] pt-8">
        {/* At either end of the list only one side exists, and it takes the
            full width — a placeholder cell beside it is just an empty panel. */}
        <div
          className={`grid gap-px bg-[var(--edge)] ${
            prev && next ? 'sm:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {[
            ['Previous', prev],
            ['Next', next],
          ]
            .filter(([, p]) => p)
            .map(([label, p]) => (
              <Link
                key={label}
                to={`/work/${p.id}`}
                data-cursor="magnet"
                className={`group flex flex-col gap-2.5 bg-carbon p-6 transition-colors duration-300 hover:bg-surface ${
                  label === 'Next' ? 'sm:items-end sm:text-right' : ''
                }`}
              >
                <span className="data-label !text-[0.5625rem] !tracking-[0.14em]">
                  {label}
                </span>
                <span className="headline text-[1.2rem] transition-colors duration-300 group-hover:text-red">
                  {p.name}
                </span>
              </Link>
            ))}
        </div>
      </nav>
    </article>
  )
}
