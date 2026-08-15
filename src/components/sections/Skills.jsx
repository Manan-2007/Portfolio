import { useState } from 'react'
import { groups } from '@/data/skills'
import { TechIcon } from '@/lib/techIcons'
import { brandColor } from '@/lib/techBrands'
import SectionHeader from '@/components/ui/SectionHeader'
import { RevealGroup, RevealItem } from '@/components/ui/Reveal'

/**
 * One tool. The mark stays neutral until the pointer is on it, then takes
 * its own brand colour — so a full grid reads as one system rather than a
 * bag of clashing logos.
 */
function Skill({ item }) {
  const [hover, setHover] = useState(false)
  const colour = brandColor(item.icon)

  return (
    <li
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group/skill flex flex-col items-center gap-2.5 px-1 py-3 transition-colors duration-300 hover:bg-white/[0.03]"
    >
      <span
        className="flex h-8 items-center text-[2rem] leading-none transition-[color,transform] duration-300 [transition-timing-function:var(--ease-out-expo)] group-hover/skill:-translate-y-0.5"
        style={{ color: hover && colour ? colour : 'var(--color-silver)' }}
      >
        {colour ? (
          <TechIcon name={item.icon} />
        ) : (
          <span className="font-mono text-base font-bold tracking-tight">
            {item.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </span>

      {/* Two lines' worth of room whether or not the name wraps, so every
          cell in a block is the same height and the rows stay level. */}
      <span className="min-h-[2.1em] text-balance text-center font-mono text-[0.6875rem] leading-tight text-slate transition-colors duration-300 group-hover/skill:text-white">
        {item.name}
      </span>
    </li>
  )
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="scroll-mt-24 border-y border-[var(--edge)] bg-carbon py-24 md:py-36"
    >
      <div className="shell">
        <SectionHeader
          index="03"
          eyebrow="Expertise"
          title="Technologies I Build With"
          note="Grouped by what each tool is actually for, from the model down to the interface."
        />

        {/* Blocks tile downward rather than running as full-width bands, so
            most of the stack is readable in a single view. */}
        <RevealGroup
          className="grid gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-3"
          gap={0.06}
        >
          {groups.map((group, i) => (
            <RevealItem key={group.id}>
              <div className="panel flex h-full flex-col p-6 transition-colors duration-300 hover:bg-elevated md:p-7">
                <div className="flex items-baseline gap-3">
                  <span
                    aria-hidden="true"
                    className="data-label !text-[0.625rem] text-red"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="headline text-balance text-[1.05rem] md:text-[1.15rem]">
                    {group.label}
                  </h3>
                </div>

                <p className="mt-2 text-[0.8125rem] leading-relaxed text-slate">
                  {group.note}
                </p>

                <div className="hairline my-6" />

                <ul className="grid grid-cols-3 gap-x-2 gap-y-4">
                  {group.items.map((item) => (
                    <Skill key={item.name} item={item} />
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
