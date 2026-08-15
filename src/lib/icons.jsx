/* Inline SVGs — no icon package, no runtime cost. All 24×24, currentColor. */

const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  'aria-hidden': 'true',
  focusable: 'false',
}

const stroke = {
  ...base,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const GitHubIcon = (props) => (
  <svg {...base} fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
  </svg>
)

export const LinkedInIcon = (props) => (
  <svg {...base} fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
  </svg>
)

export const LeetCodeIcon = (props) => (
  <svg {...base} fill="currentColor" {...props}>
    <path d="M13.48 2.4a1.02 1.02 0 0 1 1.45 1.43l-2.24 2.27 4.14 4.1a1.02 1.02 0 1 1-1.44 1.45l-4.86-4.83a1.02 1.02 0 0 1 0-1.44l2.95-2.98ZM8.9 7.03a1.02 1.02 0 0 1 1.44 1.44L7.4 11.4a3.38 3.38 0 0 0 0 4.78l3.07 3.05c.63.62 1.47.97 2.36.97.9 0 1.74-.35 2.36-.97l1.9-1.88a1.02 1.02 0 1 1 1.43 1.45l-1.9 1.88A5.36 5.36 0 0 1 12.84 22c-1.44 0-2.8-.56-3.8-1.56l-3.08-3.05a5.42 5.42 0 0 1 0-7.68L8.9 7.03Zm12.08 6.02a1.02 1.02 0 1 1 0 2.04h-8.05a1.02 1.02 0 1 1 0-2.04h8.05Z" />
  </svg>
)

export const MailIcon = (props) => (
  <svg {...stroke} {...props}>
    <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" />
    <path d="m3 6 9 6.5L21 6" />
  </svg>
)

export const DownloadIcon = (props) => (
  <svg {...stroke} {...props}>
    <path d="M12 3v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M4 20h16" />
  </svg>
)

export const ArrowIcon = (props) => (
  <svg {...stroke} {...props}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
)

export const ArrowDownIcon = (props) => (
  <svg {...stroke} {...props}>
    <path d="M12 4v15" />
    <path d="m6 13 6 6 6-6" />
  </svg>
)

export const ExternalIcon = (props) => (
  <svg {...stroke} {...props}>
    <path d="M14 4h6v6" />
    <path d="M20 4 11 13" />
    <path d="M18 14v5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
  </svg>
)

export const CopyIcon = (props) => (
  <svg {...stroke} {...props}>
    <rect x="9" y="9" width="12" height="12" rx="1.5" />
    <path d="M6 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V6" />
  </svg>
)

export const CheckIcon = (props) => (
  <svg {...stroke} {...props}>
    <path d="m4 12.5 5.5 5.5L20 7" />
  </svg>
)

export const PlusIcon = (props) => (
  <svg {...stroke} {...props}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
)
