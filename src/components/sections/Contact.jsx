import { useEffect, useRef, useState } from 'react'
import { profile, socials } from '@/data/profile'
import { Reveal } from '@/components/ui/Reveal'
import Button from '@/components/ui/Button'
import StatusDot from '@/components/ui/StatusDot'
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  GitHubIcon,
  LeetCodeIcon,
  LinkedInIcon,
  MailIcon,
} from '@/lib/icons'

const ICONS = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  LeetCode: LeetCodeIcon,
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked by permissions — the mailto link still works.
    }
  }

  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-[var(--edge)] bg-carbon py-24 md:py-32"
    >
      <div className="shell">
        <div className="panel notch mx-auto max-w-4xl">
          <div className="flex items-center justify-between border-b border-[var(--edge)] px-6 py-4">
            <span className="data-label tick !text-[0.625rem]">Contact</span>
            <StatusDot tone="green" label="Open to roles" pulse />
          </div>

          <div className="px-6 py-12 text-center md:px-12 md:py-16">
            <Reveal>
              <h2 className="headline text-[clamp(2rem,6vw,3.6rem)]">
                Let&apos;s build something
                <br />
                that has to work.
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mx-auto mt-6 max-w-lg text-pretty leading-relaxed text-silver">
                Open to engineering roles and internships in AI, computer vision and
                speech. If you have a problem that has to work outside a demo, I would
                like to hear about it.
              </p>
            </Reveal>

            {/* Email */}
            <Reveal delay={0.14}>
              <div className="mx-auto mt-10 flex max-w-md items-stretch border border-[var(--edge)]">
                <a
                  href={`mailto:${profile.email}`}
                  className="flex-1 truncate px-4 py-4 text-left font-mono text-[0.8125rem] text-white transition-colors duration-300 hover:text-red"
                >
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="flex w-14 shrink-0 items-center justify-center border-l border-[var(--edge)] text-silver transition-colors duration-300 hover:text-red"
                  aria-label={copied ? 'Email copied' : 'Copy email address'}
                >
                  {copied ? (
                    <CheckIcon className="text-base text-green" />
                  ) : (
                    <CopyIcon className="text-base" />
                  )}
                </button>
              </div>
              <p aria-live="polite" className="data-label mt-3 !text-[0.625rem] h-4">
                {copied ? 'Copied to clipboard' : ''}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="btn-row mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button href={`mailto:${profile.email}`} icon={MailIcon}>
                  Send a message
                </Button>
                <Button
                  href={profile.resumeFile}
                  variant="ghost"
                  icon={DownloadIcon}
                  download={profile.resumeName}
                >
                  Résumé
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.26}>
              <ul className="mt-12 flex items-center justify-center gap-6">
                {socials.map((social) => {
                  const Icon = ICONS[social.label]
                  return (
                    <li key={social.label}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="magnet"
                        className="group flex flex-col items-center gap-2 text-silver transition-colors duration-300 hover:text-red"
                      >
                        <Icon className="text-xl" />
                        <span className="data-label !text-[0.5625rem] group-hover:text-red">
                          {social.label}
                        </span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
