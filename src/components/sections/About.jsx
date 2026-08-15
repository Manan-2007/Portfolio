import { profile } from '@/data/profile'
import SectionHeader from '@/components/ui/SectionHeader'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal'

export default function About() {
  return (
    <section id="about" className="shell scroll-mt-24 py-24 md:py-36">
      <SectionHeader
        index="01"
        eyebrow="The Builder"
        title="Who I Am"
        note="A model is only finished when someone who isn't me can use it."
      />

      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        {/* Prose */}
        <div className="lg:col-span-7">
          <RevealGroup className="space-y-6" gap={0.1}>
            {profile.about.map((para, i) => (
              <RevealItem key={i} as="p">
                <span
                  className={
                    i === 0
                      ? 'text-lg leading-relaxed text-white md:text-xl'
                      : 'leading-relaxed text-silver'
                  }
                >
                  {para}
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Identity card — the engineering counterpart to the prose */}
        <Reveal delay={0.1} className="lg:col-span-5">
          <div className="panel notch">
            <div className="flex items-center justify-between border-b border-[var(--edge)] px-5 py-3.5">
              <span className="data-label !text-[0.625rem]">{profile.monogram}</span>
              <span className="data-label !text-[0.625rem] text-red">
                {profile.years.replace(/\s/g, '')}
              </span>
            </div>

            <dl className="divide-y divide-[var(--edge)]">
              {profile.card.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[7.5rem_1fr] items-baseline gap-3 px-5 py-4 transition-colors duration-300 hover:bg-elevated"
                >
                  <dt className="data-label !text-[0.625rem] !tracking-[0.16em]">
                    {row.label}
                  </dt>
                  <dd className="data-value text-[0.8125rem] leading-snug">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="border-t border-[var(--edge)] px-5 py-5">
              <span className="data-label !text-[0.625rem] !tracking-[0.16em]">
                Current focus
              </span>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {profile.focus.map((item) => (
                  <li
                    key={item}
                    className="border border-[var(--edge)] px-2.5 py-1.5 font-mono text-[0.6875rem] text-silver transition-colors duration-300 hover:border-red/50 hover:text-white"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
