/* ────────────────────────────────────────────────────────────────────────
   Identity. Every other data file describes work; this one describes him.
   ──────────────────────────────────────────────────────────────────────── */

export const profile = {
  name: 'Manan Kochhar',
  first: 'Manan',
  last: 'Kochhar',
  monogram: 'MK',
  role: 'AI/ML Engineer',
  email: 'kochharmanan20@gmail.com',
  location: 'Chandigarh, India',
  university: 'Chitkara University',
  degree: 'B.E CSE (AI/ML)',
  years: '2025 — 2029',
  resumeFile: '/resume.pdf',
  resumeName: 'Manan_Kochhar_Resume.pdf',

  /* Hero */
  eyebrow: 'AI/ML Engineer',
  thesis: 'code · create · iterate',
  hook: 'I build AI systems that run fast, stay accessible, and keep working long after the demo.',

  /* About — first person, written the way he would actually say it */
  about: [
    'I study AI/ML at Chitkara University. Most of what I build starts with something being harder than it should be — a webcam that becomes a keyboard, a microphone that reads tone instead of words, a receipt that splits itself. The model is rarely the hard part; making it survive a real room, cheap hardware and a first-time user usually is.',
    'I like working across the whole pipeline: the data, the training run, the evaluation, the API, and the interface someone actually touches. Work that stops at a notebook has never held my attention for long. I would rather take an experiment all the way to something you can open and use, and then keep sharpening it.',
    'Hackathons are where a lot of that gets tested. A short deadline forces honest decisions about what matters, and some of my better work has come out of one. The rest of the time I am reading, breaking something, and rewriting it cleaner than it was.',
  ],

  /* About — the identity card beside the prose */
  card: [
    { label: 'Designation', value: 'AI/ML Engineer' },
    { label: 'Education', value: 'B.E CSE (AI/ML)' },
    { label: 'College', value: 'Chitkara University' },
    { label: 'Based in', value: 'Chandigarh, India' },
  ],

  /* Rendered as chips under the card */
  focus: [
    'Real-time computer vision',
    'Speech & voice interfaces',
    'High-performance PyTorch',
    'Parameter-efficient fine-tuning',
    'Production LLM serving',
  ],
}

export const links = {
  github: {
    label: 'GitHub',
    handle: 'Manan-2007',
    url: 'https://github.com/Manan-2007',
  },
  linkedin: {
    label: 'LinkedIn',
    handle: 'manan-kochhar',
    url: 'https://www.linkedin.com/in/manan-kochhar-b57a56211/',
  },
  leetcode: {
    label: 'LeetCode',
    handle: 'Manan-2007',
    url: 'https://leetcode.com/u/Manan-2007/',
  },
}

export const socials = [links.github, links.linkedin, links.leetcode]

export const navLinks = [
  { id: 'about', label: 'About', index: '01' },
  { id: 'work', label: 'Work', index: '02' },
  { id: 'skills', label: 'Skills', index: '03' },
  { id: 'achievements', label: 'Achievements', index: '04' },
]

/* Marquee strip under the hero */
export const ticker = [
  'Computer Vision',
  'PyTorch',
  'Real-time inference',
  'OpenCV',
  'Speech AI',
  'MediaPipe',
  'FastAPI',
  'Human–computer interaction',
  'CUDA',
  'React',
  'Three.js',
  'Docker',
]
