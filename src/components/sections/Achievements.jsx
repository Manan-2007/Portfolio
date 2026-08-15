import { useState } from 'react'
import { certificates, experience } from '@/data/achievements'
import { TechIcon } from '@/lib/techIcons'
import { brandColor } from '@/lib/techBrands'
import SectionHeader from '@/components/ui/SectionHeader'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'
import { ArrowIcon } from '@/lib/icons'

function CertCard({ cert }) {
  const [hover, setHover] = useState(false)
  const colour = brandColor(cert.icon)

  return (
    <RevealItem>
      <a
        href={cert.href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="group relative flex h-full flex-col justify-between border border-[var(--edge)] bg-carbon p-6 transition-colors duration-500 hover:border-[var(--edge-strong)] hover:bg-surface"
      >
        {/* Red rail on hover, matching the project cards */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-red transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
        />

        <div>
          <div className="flex items-start justify-between gap-3">
            <span
              className="flex h-8 items-center text-[1.75rem] leading-none transition-colors duration-300"
              style={{ color: hover && colour ? colour : 'var(--color-silver)' }}
            >
              {colour ? (
                <TechIcon name={cert.icon} />
              ) : (
                <span className="font-mono text-base font-bold tracking-tight">
                  {cert.mono}
                </span>
              )}
            </span>
            <span className="data-label !text-[0.5625rem] !tracking-[0.14em] text-slate/60">
              {cert.type}
            </span>
          </div>

          <h3 className="mt-6 text-balance text-[1rem] font-semibold leading-snug text-white transition-colors duration-300 group-hover:text-red">
            {cert.title}
          </h3>
          <p className="mt-1.5 text-[0.8125rem] text-silver">
            {cert.issuer}
            {cert.code && <span className="text-slate"> · {cert.code}</span>}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <span className="data-value text-[0.75rem] text-slate">{cert.year}</span>
          <ArrowIcon className="text-base text-slate transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-red" />
        </div>
      </a>
    </RevealItem>
  )
}

export default function Achievements() {
  return (
    <section id="achievements" className="shell scroll-mt-24 py-24 md:py-36">
      <SectionHeader
        index="04"
        eyebrow="Achievements"
        title="Certificates & Specializations"
        note="Verified credentials from Microsoft, Google, IBM and DeepLearning.AI — every card links straight to the issuer."
      />

      <RevealGroup
        className="grid gap-px bg-[var(--edge)] sm:grid-cols-2 xl:grid-cols-4"
        gap={0.05}
      >
        {certificates.map((cert) => (
          <CertCard key={cert.title} cert={cert} />
        ))}
      </RevealGroup>

      {/* Roles */}
      <Reveal delay={0.06}>
        <div className="mt-20 flex items-baseline justify-between gap-4">
          <h3 className="data-label tick">Experience</h3>
          <span className="data-label !text-[0.625rem] text-slate/60">
            {experience.length} roles
          </span>
        </div>
        <div className="hairline mt-5" />
      </Reveal>

      <RevealGroup className="grid gap-px bg-[var(--edge)] md:grid-cols-2" gap={0.08}>
        {experience.map((role) => (
          <RevealItem key={role.title}>
            <article className="h-full bg-carbon p-7 transition-colors duration-300 hover:bg-surface md:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <span className="data-label !text-[0.625rem] text-red">
                  {role.context}
                </span>
                <span className="data-value text-[0.75rem] text-slate">
                  {role.period}
                </span>
              </div>

              <h4 className="headline mt-5 text-[1.3rem] md:text-[1.5rem]">
                {role.title}
              </h4>
              <p className="mt-1.5 text-[0.9rem] text-white/85">{role.org}</p>

              <ul className="mt-5 space-y-2.5">
                {role.points.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-[0.9rem] leading-relaxed text-silver"
                  >
                    <span
                      className="mt-2 h-px w-4 shrink-0 bg-[var(--edge-strong)]"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
