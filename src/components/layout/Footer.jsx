import { profile, socials } from '@/data/profile'
import { GitHubIcon, LinkedInIcon, LeetCodeIcon } from '@/lib/icons'

const ICONS = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  LeetCode: LeetCodeIcon,
}

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--edge)] bg-carbon">
      <div className="shell flex flex-col items-center gap-8 py-14 sm:flex-row sm:justify-between sm:py-12">
        <div className="flex items-center gap-3">
          <span className="h-5 w-[2px] bg-red" />
          <span className="headline text-sm tracking-[0.16em]">
            {profile.name}
          </span>
        </div>

        <ul className="flex items-center gap-2">
          {socials.map((social) => {
            const Icon = ICONS[social.label]
            return (
              <li key={social.label}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="magnet"
                  aria-label={`${social.label} — ${social.handle}`}
                  className="flex h-11 w-11 items-center justify-center border border-[var(--edge)] text-silver transition-colors duration-300 hover:border-red hover:text-red"
                >
                  <Icon className="text-[1.15rem]" />
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </footer>
  )
}
