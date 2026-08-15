import { useState } from 'react'
import { disciplines, projects } from '@/data/projects'
import SectionHeader from '@/components/ui/SectionHeader'
import { Reveal, RevealGroup } from '@/components/ui/Reveal'
import ProjectRow from '@/components/work/ProjectRow'
import { ArrowIcon } from '@/lib/icons'

/* Only the disciplines actually represented below, in the order they first
   appear — a legend listing a colour nothing uses is worse than no legend. */
const legend = Object.entries(disciplines).filter(([key]) =>
  projects.some((p) => p.discipline === key)
)

export default function Work() {
  // The lead project opens by default — a visitor should see depth without
  // having to click first.
  const [openId, setOpenId] = useState(projects[0].id)

  return (
    <section id="work" className="shell scroll-mt-24 py-24 md:py-36">
      <SectionHeader
        index="02"
        eyebrow="Work"
        title="Featured Projects"
        note="Things I have built to solve a real problem — computer vision, speech, and interfaces people actually touch."
      />

      {/* Colour key for the row numbers */}
      <Reveal>
        <ul className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2.5">
          {legend.map(([key, { label, tone }]) => (
            <li key={key} className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0"
                style={{ background: tone }}
              />
              <span className="data-label !text-[0.625rem] !tracking-[0.14em]">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      <RevealGroup className="border-t border-[var(--edge)]" gap={0.05}>
        {projects.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={i}
            open={openId === project.id}
            onToggle={() => setOpenId((cur) => (cur === project.id ? null : project.id))}
          />
        ))}
      </RevealGroup>

      <div className="mt-12">
        <a
          href="https://github.com/Manan-2007?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="magnet"
          className="group inline-flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-slate transition-colors duration-300 hover:text-red"
        >
          Everything else on GitHub
          <ArrowIcon className="text-base transition-transform duration-300 group-hover:translate-x-1.5" />
        </a>
      </div>
    </section>
  )
}
