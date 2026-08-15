/* ────────────────────────────────────────────────────────────────────────
   Featured work. Descriptions, stacks and links are drawn from each repo's
   own README and GitHub metadata — nothing here is invented, including the
   three figures each project reports on itself.
   ──────────────────────────────────────────────────────────────────────── */

/* Categorical colour coding for the project numbers. These are the palette's
   data tones — they encode a discipline here, they are not decoration. */
export const disciplines = {
  vision: { label: 'Computer Vision', tone: 'var(--color-green)' },
  speech: { label: 'Speech & Audio', tone: 'var(--color-amber)' },
  ai: { label: 'Applied AI', tone: 'var(--color-purple)' },
  web: { label: 'Web & 3D', tone: 'var(--color-red)' },
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
    featured: true,
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
    featured: true,
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
      'KINU, an AI mentor running on Gemini, answers in the context of whatever the learner is currently looking at.',
      'React + TypeScript + Zustand front end against a FastAPI service pulling market data through yfinance.',
    ],
    stats: [
      { label: 'Learning tracks', value: '3' },
      { label: 'AI mentor', value: 'Gemini' },
      { label: 'Data feed', value: 'yfinance' },
    ],
    stack: ['TypeScript', 'React', 'Zustand', 'Python', 'FastAPI', 'Gemini'],
    repo: 'https://github.com/Manan-2007/Kinetic-City',
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
    featured: true,
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
  },
  {
    id: 'f1-club',
    name: 'F1 Club Chitkara',
    kind: '3D Web Experience',
    discipline: 'web',
    year: '2026',
    headline: 'A club site built like a race weekend.',
    summary:
      'The official site of the F1 Chitkara club — a cinematic web experience pairing motorsport design language with a real-time 3D hero, a mouse-driven camera rig and a studio lighting setup.',
    detail: [
      'React Three Fiber scene with a lerped camera rig, HDRI-lit metallic paint, a shadow-catcher floor and runtime bounding-box normalisation so the model sits correctly regardless of export units.',
      'Device-capability gating drops the 3 MB model entirely on mobile, low-end GPUs and reduced-motion, falling back to a 2D parallax hero.',
      'GSAP ScrollTrigger reveals, Lenis smooth scroll, route transitions and vendor chunk splitting keep the 3D payload off the critical path.',
    ],
    stats: [
      { label: 'Pages', value: '7' },
      { label: 'Hero model', value: '3 MB' },
      { label: 'Renderer', value: 'R3F' },
    ],
    stack: ['React', 'Three.js', 'R3F', 'GSAP', 'Lenis', 'Tailwind'],
    repo: 'https://github.com/Manan-2007/F1_club',
    live: 'https://f1-club.vercel.app',
  },
  {
    id: 'muse',
    name: 'Muse.',
    kind: 'Music Player',
    discipline: 'web',
    year: '2026',
    headline: 'A native-feeling player, in plain JavaScript.',
    summary:
      'A responsive, multi-page music player built with no framework and no dependencies — a full audio engine, glassmorphic UI and page transitions that hold up next to a native app.',
    detail: [
      'Complete playback engine: play/pause, skip, seek, volume, shuffle and single-track repeat, wired to a 20-track searchable library.',
      'Album art spins like a record during playback, and the backdrop re-colours itself from the current track’s artwork.',
      'Seven pages — home feed, player, library, playlists, about and a simulated auth flow persisted in localStorage.',
    ],
    stats: [
      { label: 'Tracks', value: '20' },
      { label: 'Pages', value: '7' },
      { label: 'Dependencies', value: '0' },
    ],
    stack: ['JavaScript', 'HTML5', 'CSS3', 'Web Audio'],
    // The repo still advertises muse-five-sooty.vercel.app, but that
    // deployment 404s — no `live` until it is back up.
    repo: 'https://github.com/Manan-2007/Muse.',
  },
  {
    id: 'memory-game',
    name: 'Memory Game',
    kind: 'Browser Game',
    discipline: 'web',
    year: '2025',
    headline: 'Sixteen cards, one timer, no libraries.',
    summary:
      'A card-matching memory game written in vanilla HTML, CSS and JavaScript — jungle animal cards, a live timer, a move counter and 3D flip animations built purely in CSS.',
    detail: [
      'Twelve animals in the pool; eight are drawn and shuffled into a fresh 4×4 grid every round.',
      'Cards flip on a CSS rotateY transform with backface-visibility, so the animation costs nothing at runtime.',
      'Game logic guards the edge cases — matched cards lock, and only one pair is ever evaluated at a time.',
    ],
    stats: [
      { label: 'Board', value: '4×4' },
      { label: 'Pairs', value: '8' },
      { label: 'Card pool', value: '12' },
    ],
    stack: ['JavaScript', 'HTML5', 'CSS3'],
    repo: 'https://github.com/Manan-2007/Memory-Game',
  },
]
