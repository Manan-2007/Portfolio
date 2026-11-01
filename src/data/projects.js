/* ────────────────────────────────────────────────────────────────────────
   Featured work. Descriptions, stacks and links are drawn from each repo's
   own README and GitHub metadata — nothing here is invented, including the
   three figures each project reports on itself.

   Ordered strongest first; Work.jsx opens projects[0] by default, so row 01
   is the one thing a visitor is guaranteed to read.
   ──────────────────────────────────────────────────────────────────────── */

/* Categorical colour coding for the project numbers. These are the palette's
   data tones — they encode a discipline here, they are not decoration. */
export const disciplines = {
  vision: { label: 'Computer Vision', tone: 'var(--color-green)' },
  speech: { label: 'Speech & Audio', tone: 'var(--color-amber)' },
  ai: { label: 'Applied AI', tone: 'var(--color-purple)' },
  web: { label: 'Web & Systems', tone: 'var(--color-red)' },
}

export const projects = [
  {
    id: 'voice-emotion',
    name: 'Voice Emotion Detection',
    kind: 'Speech Emotion Recognition',
    discipline: 'speech',
    year: '2026',
    headline: 'Reads how you say it, not what you said.',
    summary:
      'Real-time speech emotion recognition driven by a foundation-model ensemble. A neural VAD segments speech at natural pauses so the classifier only sees complete utterances, and an ambient orb interface reacts as you speak.',
    detail: [
      'Four neural models vote on every prediction: a speech-emotion foundation model, a second trained on spontaneous conversation, an arousal/valence regressor, and a neural voice-activity detector.',
      'Ships its own two-corpus evaluation harness — several plausible-sounding additions were measured and dropped because the numbers refused to support them.',
      'Audio never leaves the machine: the browser streams the mic to a local FastAPI server over WebSockets, which analyses on the fly and records nothing.',
    ],
    stats: [
      { label: 'Emotions', value: '8' },
      { label: 'Latency', value: '<1s' },
      { label: 'Training speech', value: '42.5k h' },
    ],
    stack: ['Python', 'PyTorch', 'FastAPI', 'WebSockets', 'TensorFlow', 'TypeScript'],
    repo: 'https://github.com/Manan-2007/voice-emotion-detection',
    study: true,
  },
  {
    id: 'dhan-drishti',
    name: 'Dhan Drishti',
    kind: 'Portfolio & Wealth Tracker',
    discipline: 'web',
    year: '2026',
    headline: 'Every figure traces back to a real transaction.',
    summary:
      'A self-hosted wealth tracker that consolidates exports from every broker into one normalised ledger, then derives holdings, returns and net worth from it. Nothing on the dashboard is a placeholder, and only public tickers ever reach the outside world.',
    detail: [
      'Money is never a float — exact decimals end to end, behind a pure, deterministic calculation engine that does no I/O and is covered by 352 tests.',
      'Every broker sits behind one adapter interface, so imports are idempotent, deduped and atomic: a file is detected, normalised, validated and previewed, then committed all-or-nothing and reconciled against the broker’s own P&L report.',
      'Gaps are repaired rather than guessed — stock splits missing from an export are filled from public data only after being confirmed against your own trade prices, and anything invalid is reported instead of inferred.',
    ],
    stats: [
      { label: 'Tests passing', value: '352' },
      { label: 'Import sources', value: '7' },
      { label: 'Float arithmetic', value: '0' },
    ],
    stack: ['TypeScript', 'React', 'Fastify', 'SQLite', 'Drizzle', 'decimal.js'],
    repo: 'https://github.com/Manan-2007/Dhan_Drishti',
    study: true,
  },
  {
    id: 'virtual-keyboard-mouse',
    name: 'Virtual Keyboard & Air Mouse',
    kind: 'Touchless Input System',
    discipline: 'vision',
    year: '2026',
    headline: 'Two hands become two real input devices.',
    summary:
      'A computer-vision input system that lets you type and drive the OS cursor with nothing but a webcam. Keystrokes and clicks are injected at the operating-system level, so what you type in the air lands in whatever app is actually focused.',
    detail: [
      'The hand tracker labels each hand and gives it a job — right hand steers the real cursor (pinch to click, hold to drag), left hand types on an on-screen keyboard.',
      'Full layout: number row, three letter rows, and a function row with shift, backspace, space and enter.',
      'On macOS the keyboard renders as a transparent, click-through overlay above every app and Space, so the target window stays visible on a single laptop screen.',
    ],
    stats: [
      { label: 'Keys', value: '40' },
      { label: 'Hands tracked', value: '2' },
      { label: 'Input', value: 'OS-level' },
    ],
    stack: ['Python', 'OpenCV', 'MediaPipe', 'NumPy', 'macOS Quartz'],
    repo: 'https://github.com/Manan-2007/virtual-keyboard-mouse',
    study: true,
  },
  {
    id: 'muse-v2',
    name: 'Muse. v2',
    kind: 'Social Listening Platform',
    discipline: 'web',
    year: '2026',
    headline: 'A record you can touch, in a room that hears the same second.',
    summary:
      'A full-stack music platform built around a turntable you actually scrub, and rooms where every device lands on the same second of the same song. The ground-up rebuild of Muse v1, with a real backend underneath it.',
    detail: [
      'Rooms do not stream audio to each other. One socket event carries what is playing and the moment it started, and every client computes `now − startedAt` to find the needle — agreeing on a timeline rather than shipping a file is what keeps devices in sync.',
      'The recommender is content-based rather than collaborative: four taste signals — plays, likes, playlist adds and onboarding picks — are weighted into a profile, so it works from your own signal with no crowd required.',
      'The turntable is canvas, not video — the vinyl spins, the tonearm tracks, a beat-ring rides the rim, and dragging the disc seeks the track.',
    ],
    stats: [
      { label: 'Room sync', value: '1 event' },
      { label: 'Taste signals', value: '4' },
      { label: 'Realtime', value: 'Socket.io' },
    ],
    stack: ['TypeScript', 'React', 'Socket.io', 'Prisma', 'PostgreSQL', 'Express'],
    repo: 'https://github.com/Manan-2007/Muse._v2',
    study: true,
    live: 'https://muse-music-v2.vercel.app',
  },
  {
    id: 'dibz',
    name: 'DIBZ',
    kind: 'AI Bill Splitter',
    discipline: 'ai',
    year: '2026',
    headline: 'Pay for what you actually ate.',
    summary:
      'A shipped, installable web app that ends the divide-by-headcount tax at the dinner table. Photograph the receipt, tap who ordered what, and every person gets their real share — including a proportional slice of tax, service charge and tip.',
    detail: [
      'Receipt scanning runs on Gemini rather than OCR: a multimodal model reads the photo and returns typed JSON, so there is no brittle parser guessing which number is a price and which is a quantity.',
      'The split shows its working — every card lists that person’s dishes, their share of each charge, and the rounding adjustment, so the displayed totals sum to exactly the bill.',
      'One API route is the entire backend. No accounts, no database; the in-progress bill lives in localStorage, and installing it to the home screen is what stops iOS clearing it.',
    ],
    stats: [
      { label: 'Split steps', value: '6' },
      { label: 'Backend routes', value: '1' },
      { label: 'Rounding drift', value: '₹0' },
    ],
    stack: ['TypeScript', 'Next.js', 'Gemini', 'Tailwind', 'PWA'],
    repo: 'https://github.com/Manan-2007/DIBZ',
    live: 'https://dibz-v1.vercel.app',
    study: true,
  },
  {
    id: 'synora',
    name: 'Synora',
    kind: 'Student Workspace',
    discipline: 'web',
    year: '2026',
    headline: 'One calm home for everything you are studying.',
    summary:
      'Tasks, timetable, notes, a focus timer, CGPA, attendance and achievements in a single workspace, with the subject list as the hub every other feature points at. Shipped, installable, and running on a real relational schema.',
    detail: [
      'Twenty tables in MySQL; nineteen are owned by a user and cascade on delete, so removing an account removes everything it owns. The API adds whatever columns are missing on its first request after a deploy.',
      'Renaming a subject updates the timetable, attendance, grades and tasks at once — subjects sit at the centre of the schema instead of having their names copied across features.',
      'Seven runtime dependencies in total across app and API, and hand-written CSS with design tokens rather than a UI kit. Light and dark are both built, not themed on afterwards.',
    ],
    stats: [
      { label: 'Tables', value: '20' },
      { label: 'Runtime deps', value: '7' },
      { label: 'Themes', value: '2' },
    ],
    stack: ['JavaScript', 'React', 'Express', 'MySQL', 'Vite'],
    repo: 'https://github.com/Manan-2007/Synora',
    study: true,
    live: 'https://synora-v1.vercel.app',
  },
  {
    id: 'saahas',
    name: 'SAAHAS',
    kind: 'Trauma-Informed Support App',
    discipline: 'speech',
    year: '2026',
    headline: 'A voice check-in that hears tone, not words.',
    summary:
      'A trauma-informed sanctuary app whose Voice Companion check-in runs on a local speech-emotion service. I built the voice half — the FastAPI inference backend and the way the React app consumes it.',
    detail: [
      'The models from my own speech-emotion work are wired in here as a service, which is where that ensemble had to survive contact with somebody else’s interface rather than its own demo.',
      'Inference stays local: a FastAPI process loads roughly 3.5 GB of checkpoints on first run and analyses in-process, so no audio is uploaded anywhere.',
      'The interface degrades honestly — until the backend has finished loading, the Voice Companion says voice analysis is offline and offers a retry instead of failing silently.',
    ],
    stats: [
      { label: 'Model size', value: '3.5 GB' },
      { label: 'Services', value: '2' },
      { label: 'Inference', value: 'Local' },
    ],
    stack: ['Python', 'PyTorch', 'FastAPI', 'React', 'Vite', 'Tailwind'],
    repo: 'https://github.com/Manan-2007/SAAHAS',
    study: true,
  },
  {
    id: 'kinetic-city',
    name: 'Kinetic City',
    kind: 'AI Learning Platform',
    discipline: 'ai',
    year: '2026',
    headline: 'Financial decisions, made legible.',
    summary:
      'An interactive learning platform that turns financial concepts into a navigable cityscape driven by live market data. Built as AI Engineer with Team Finbros for the Finvasia Innovation Hackathon.',
    detail: [
      'Curriculum tracks — Foundations, Technical Analysis, Wealth Building — each backed by interactive dashboards over real-time stock data.',
      'KINU, an AI mentor on Azure OpenAI GPT-4o, answers in the context of whatever the learner is currently looking at, and shifts register across four kinds of investor fear.',
      'React + TypeScript + Zustand front end against a FastAPI service pulling market data through yfinance.',
    ],
    stats: [
      { label: 'Learning tracks', value: '3' },
      { label: 'AI mentor', value: 'GPT-4o' },
      { label: 'Data feed', value: 'yfinance' },
    ],
    stack: ['TypeScript', 'React', 'Zustand', 'Python', 'FastAPI', 'Azure OpenAI'],
    repo: 'https://github.com/Manan-2007/Kinetic-City',
    study: true,
  },
  {
    id: 'lily-bloom',
    name: 'Lily Bloom',
    kind: 'Gesture-Driven AR',
    discipline: 'vision',
    year: '2026',
    headline: 'Grow a garden with the wave of a hand.',
    summary:
      'A gesture-controlled AR web app that turns a webcam feed into a living canvas. Spread your left hand and stems rise; open your right and seven stargazer lilies bloom, sway and breathe in a simulated breeze.',
    detail: [
      'MediaPipe reads both hands in real time; a small state machine grows two plants from the bottom of the frame based on pinch distance.',
      'The lilies are not sprites — a hand-written renderer draws petals, freckles, stamens and glowing throats procedurally at the tip of each branch.',
      'Flask streams the annotated frames back to the browser, so the whole thing runs locally with no upload step.',
    ],
    stats: [
      { label: 'Blooms', value: '7' },
      { label: 'Gesture input', value: '2 hands' },
      { label: 'Sprites', value: '0' },
    ],
    stack: ['Python', 'OpenCV', 'MediaPipe', 'Flask', 'NumPy'],
    repo: 'https://github.com/Manan-2007/Lily-Flower-Hand-Gesture',
    study: true,
  },
]
