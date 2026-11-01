/* ────────────────────────────────────────────────────────────────────────
   Case studies — the long form behind the project rows.

   A project row answers "what is it". These answer "what did you decide, and
   how do you know it was right". Everything here is drawn from the repo it
   describes: its README, its evaluation output, its source. Nothing is
   inferred, and the numbers are the ones each project reports on itself.

   Keyed by `project.id`. A project without an entry simply has no deep page,
   which is the intended state for most of them — a case study is a claim that
   there is something worth reading, and nine of those is none.

   Shape (every field but `problem` and `decisions` is optional):
     problem    [string]                  why this exists, 1–2 paragraphs
     decisions  [{ title, body }]         the calls worth defending
     flow       { label, steps: [string] } an ordered pipeline
     table      { caption, head, rows }   measured outcomes
     rejected   [{ title, body }]         what was tried and dropped
     honest     [string]                  limits, caveats, what it does not do
   ──────────────────────────────────────────────────────────────────────── */

export const studies = {
  /* ═══════════════════════════════════════════════════════════════════ */
  'voice-emotion': {
    problem: [
      'The first version was the standard approach: a convolutional network trained on RAVDESS MFCCs, scoring about 95% on a held-out RAVDESS split. On live microphone speech it was unconvincing — the classic symptom of a model that has memorised twenty-four actors reading fixed sentences in a studio.',
      'Fixing it meant treating it as a measurement problem rather than a model problem. Nothing could be improved without a way to tell improvement from noise, so the evaluation harness was built before any of the models that eventually replaced that CNN.',
    ],
    decisions: [
      {
        title: 'The harness came first',
        body: 'Two corpora, scored against the exact production code path: CREMA-D for acted studio speech and MELD for spontaneous television conversation. They answer different questions — CREMA-D catches regressions on clean audio, MELD approximates the live microphone — so they are always reported separately instead of averaged into one flattering number.',
      },
      {
        title: 'Segment at pauses, not on a rolling window',
        body: 'A neural VAD closes an utterance at a 300 ms pause, so the classifier only ever sees the complete utterances it was trained on. The energy heuristic it replaced silently dropped roughly 30% of sad speech — quiet, flat delivery reads as silence to a threshold.',
      },
      {
        title: 'Two models whose errors disagree',
        body: 'Finalised utterances are scored by emotion2vec+ and the Odyssey 2024 WavLM baseline together. One is trained largely on performed speech and the other on spontaneous podcast speech, so their errors decorrelate exactly where a single model would be confidently wrong.',
      },
      {
        title: 'Check the label against the delivery',
        body: 'A wav2vec2 model supplies continuous arousal and valence learned from real conversation. Each emotion carries an expected activation, and emotions whose expectation contradicts the measured delivery are downweighted — so a flat, low-energy “I’m happy” is not scored as happy.',
      },
      {
        title: 'Say when you do not know',
        body: 'Predictions from under three seconds of voiced speech — the model’s documented hallucination regime — carry reduced smoothing weight and are never reported as high-certainty. Unstable results are shown as stabilising rather than flashed at 99.9%.',
      },
    ],
    flow: {
      label: 'Per-utterance pipeline',
      steps: [
        'Browser — Float32 PCM over WebSocket',
        'Utterance buffer, 12 s cap',
        'Silero VAD — segment at 300 ms pauses',
        'emotion2vec+ · Odyssey WavLM · arousal-valence',
        'Ensemble blend on finalised utterances',
        'Calibration and affect fusion',
        'Per-session speaker baseline',
        'Temporal smoothing — finals dominate interims',
      ],
    },
    table: {
      caption:
        'Nine candidate improvements, each measured on both corpora before it was kept.',
      head: ['Change', 'Outcome'],
      rows: [
        ['Foundation model replaces the CNN', 'Shipped — emotion2vec+ as primary engine'],
        ['Neural VAD replaces the energy heuristic', 'Shipped — coverage 106 → 118 of 120 clips'],
        ['Utterance endpointing replaces rolling windows', 'Shipped — inference now matches training'],
        ['Learned arousal and valence', 'Shipped — +3.3 points on acted speech'],
        ['Odyssey WavLM ensemble', 'Shipped — +5.3 points on natural speech'],
        ['Reliability gating and class demotion', 'Shipped — fewer confidently-wrong rare labels'],
        ['Per-session speaker calibration', 'Shipped — no measurable cost'],
        ['ASR text-emotion fusion', 'Rejected — no gain natural, −4 acted'],
        ['emotion2vec+ large', 'Rejected — +0.9 natural, −4.3 acted, 3× latency'],
      ],
    },
    rejected: [
      {
        title: 'ASR text-emotion fusion',
        body: 'Reading emotion from the transcript as well as the tone sounded obviously additive. Measured, it gained nothing on natural speech and cost four points on acted speech. The transcripts stayed — for display only.',
      },
      {
        title: 'emotion2vec+ large',
        body: 'The bigger checkpoint bought +0.9 points on natural speech, lost 4.3 on acted, and tripled latency. The two-model ensemble already covered the ground it would have added.',
      },
    ],
    honest: [
      'Measured on the fused pipeline: about 65% on CREMA-D (acted, six classes) and about 27% on MELD (spontaneous, seven classes). The second number is not a defect. State-of-the-art systems reach roughly 0.31–0.40 macro-F1 on natural eight-class speech, and the same foundation models that score in the seventies on acted corpora drop into the twenties on real conversation.',
      'Emotion recognition from tone alone is a genuinely unsolved problem, and anything advertising 90%-plus is quoting acted-corpus numbers. What the surrounding pipeline buys is the removal of the worst failure modes — predictions on silence, labels that contradict the delivery, wild confidence spikes, dropped quiet speech. The certainty flag says when a result is stable enough to trust.',
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  'dhan-drishti': {
    problem: [
      'Broker exports are a pile of mutually incompatible CSVs, spreadsheets and password-protected PDFs, and most tools that consolidate them do it by showing you a number they cannot justify. The goal here was the opposite: a dashboard where every figure traces back to a transaction you can point at.',
      'That one constraint — no fake data, no dead metrics — decided most of the architecture that follows.',
    ],
    decisions: [
      {
        title: 'Money is never a float',
        body: 'Exact decimals end to end. Binary floating point cannot represent ₹0.10, and a portfolio tracker that drifts by a paisa per transaction is worse than no tracker at all, because the error stays invisible until it is large.',
      },
      {
        title: 'A pure core that does no I/O',
        body: 'The calculation engine is its own package and never reads or writes anything: holdings, XIRR, time-weighted return, FIFO capital gains and benchmark mirroring are deterministic functions of the ledger. That is what makes 108 of the 352 tests possible to write at all.',
      },
      {
        title: 'Every broker behind one interface',
        body: 'Zerodha, Dhan, Vested, Interactive Brokers, Binance, Excel holdings and a CAMS/KFintech CAS PDF all reduce to a single adapter interface. Adding a broker never touches the engine.',
      },
      {
        title: 'Imports are atomic and idempotent',
        body: 'A file is detected, normalised, validated, classified and previewed, then committed all-or-nothing. Re-importing the same export changes nothing, and the result is reconciled against the broker’s own P&L report rather than trusted.',
      },
      {
        title: 'Report, never guess',
        body: 'Anything invalid surfaces on a page that names the account, the stocks, and the exact broker file and date range that would fix it. Missing prices render as an em dash, never a plausible zero. Stock splits absent from an export are filled from public data only after being confirmed against your own trade prices.',
      },
    ],
    flow: {
      label: 'Import pipeline',
      steps: [
        'Upload file',
        'Detect broker',
        'Normalise rows',
        'Validate',
        'Classify — new · duplicate · invalid',
        'Preview counts',
        'Commit, atomic',
        'Reconcile against broker P&L',
      ],
    },
    table: {
      caption: 'Where the 352 tests sit.',
      head: ['Package', 'Tests'],
      rows: [
        ['Core calculation engine', '108'],
        ['Server and importers', '240'],
        ['Web', '4'],
      ],
    },
    honest: [
      'The privacy boundary is specific rather than absolute. Portfolio data stays on the machine; what leaves it is public ticker symbols, currency codes, whatever you type into stock search, and company names with headlines — sent to price, FX, split and news providers. What you hold, and how much, never does.',
      'A few figures cannot be derived from the ledger and say so plainly where they appear: a dividend calendar, a benchmark mirror, an F&O expiry settlement.',
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  'virtual-keyboard-mouse': {
    problem: [
      'Touchless input demos almost always stop at drawing a keyboard over the camera feed. You can watch yourself press keys, but nothing is typed anywhere — the gesture never leaves the demo window.',
      'This one injects at the operating-system level, which makes every design question a harder version of itself. The cursor has to be steady enough to click with, the keyboard has to stay out of the way of the app being typed into, and a misread gesture is a wrong character in somebody’s document.',
    ],
    decisions: [
      {
        title: 'Pinch as a ratio, not a distance',
        body: 'A fixed pixel threshold breaks the moment you lean toward the camera, because everything on screen scales with you. The pinch measure divides thumb-to-index distance by the hand’s own wrist-to-knuckle span, so it reads the same at any distance from the lens.',
      },
      {
        title: 'Hysteresis on the gesture',
        body: 'The pinch engages below 0.42 and does not release until 0.58. A single threshold makes noisy landmarks flicker across the boundary, which the person using it experiences as accidental double-presses.',
      },
      {
        title: 'Type characters, not key codes',
        body: 'Keystrokes are emitted as the exact character requested rather than as a physical key position. That is what lets the shift layer produce a real “!” instead of a “1”, and every injected event is wrapped so a permissions failure surfaces as an on-screen warning instead of a stack trace.',
      },
      {
        title: 'A click-through overlay, not a window',
        body: 'On macOS the keyboard is a borderless window per display at status level, joining every Space, ignoring mouse events, with no Dock icon and no focus. The app underneath keeps working — and the air mouse can click straight through the keyboard it is standing on.',
      },
      {
        title: 'Inset the mapping rectangle',
        body: 'The fingertip maps from a margin-inset rectangle inside the camera frame onto the full desktop. Without the inset you would have to reach the very edge of frame to touch the edge of the screen — which is exactly where tracking is least reliable.',
      },
      {
        title: 'One blend for forty-four keys',
        body: 'Key caps are drawn onto a single copied layer and blended in one full-frame pass rather than forty-four small ones. Hover and press are localised blends over one key’s bounding box, so the expensive work stays proportional to what actually changed.',
      },
      {
        title: 'Straight alpha, not premultiplied',
        body: 'The RGBA canvas is handed to the window server with one buffer copy and no premultiply pass — roughly 0.4 ms per frame instead of several at this canvas size.',
      },
      {
        title: 'The shadow that drifted',
        body: 'Text is drawn twice, offset, for a drop shadow — with the shadow at the same stroke thickness as the text. OpenCV’s Hershey glyph advance grows with thickness, so a bolder shadow drifts a little further right on every character and leaves a visible ghost tail by the end of a long string.',
      },
    ],
    flow: {
      label: 'Per-frame pipeline',
      steps: [
        'Webcam frame',
        'Flip horizontally — so the image is a mirror',
        'HandLandmarker — 21 landmarks and a handedness label',
        'Engine step — pinch, hit-test, cursor map',
        'Inject keystroke or mouse event into the OS',
        'Composite keyboard and status',
        'Transparent window, or the viewfinder',
      ],
    },
    honest: [
      'The original version used MediaPipe’s legacy Solutions API. MediaPipe removed that module in 0.10.30 — importing it now raises AttributeError — so the tracking layer was rewritten against the Tasks vision API and the old code cannot run on a current install at all. It is also why the model file is fetched at runtime rather than vendored.',
      'Overlay mode is macOS only; Windows and Linux fall back to the windowed viewfinder. Cocoa insists on owning the main thread, so capture, tracking and rendering run on a worker and a 60 Hz timer repaints — which is also what hands the interpreter enough control back for Ctrl+C to work.',
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  'muse-v2': {
    problem: [
      'Muse v1 had the identity — the vinyl, the dark stage, the feeling of a record you could touch — and no backend at all. Everything lived in one browser, so an account was a localStorage entry and listening together was impossible.',
      'V2 keeps the feel and answers the question v1 could not: what does it actually mean for two people to hear the same song at the same moment?',
    ],
    decisions: [
      {
        title: 'Agree on a timeline, do not stream audio',
        body: 'A room is not “send everyone the file”. One socket event carries what is playing and the moment it started, and every client does the same arithmetic to know where the needle should be. Nothing is broadcast but a timestamp, so sync costs the same for twenty listeners as for two.',
      },
      {
        title: 'Three parts, three homes',
        body: 'Vercel is right for a static frontend and wrong for realtime — its functions spin up per request and die, while a socket connection needs to stay open. The API and realtime server run on an always-on host and the database on managed Postgres, and that split is what makes one account work on every device.',
      },
      {
        title: 'Content-based recommendations, not collaborative',
        body: 'There is no “people who listened to X” crowd to draw on, so the recommender works from your signal alone: plays, likes, playlist adds and onboarding picks become weighted evidence of taste, and an artist graph expands favourites outward into new ones.',
      },
      {
        title: 'Resolve audio lazily',
        body: 'Muse carries no catalog of its own. Catalog songs travel as lightweight reference placeholders and are not resolved to a playable stream until you press play, like or add — one lookup per song you actually touch, which is what keeps search instant and the app light.',
      },
      {
        title: 'The turntable is drawn, not filmed',
        body: 'The vinyl spins, the tonearm tracks the groove, a canvas beat-ring rides the rim, and dragging the disc scrubs the track. Drawing it rather than looping a video is what lets it react to the audio instead of playing alongside it.',
      },
    ],
    flow: {
      label: 'Where the music comes from',
      steps: [
        'iTunes Search — metadata, cover art, genre',
        'Deezer artist graph — related-artist edges',
        'TheAudioDB — artist portraits',
        'LRCLIB — time-synced lyrics',
        'YouTube / Piped — the audio stream',
      ],
    },
    honest: [
      'Every source is free and keyless, composed server-side and cached. That keeps the project runnable by anyone who clones it — and it also means the catalog is only as good as those public APIs on the day you ask.',
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  synora: {
    problem: [
      'Academic life is scattered across tools that do not know about each other: deadlines in chat groups, attendance scribbled in a notebook, grades on a spreadsheet, the timetable as a screenshot in the camera roll. When the pieces live apart, deadlines become Thursday-night surprises and attendance drops under the cut-off before anyone notices.',
      'The hard part is not any one of those features. It is making seven of them agree with each other.',
    ],
    decisions: [
      {
        title: 'Subjects are the hub, not a field',
        body: 'The timetable, attendance, grades and tasks all point at one subject list rather than each carrying its own copy of a subject name. Renaming a subject once updates it everywhere — which is the difference between a workspace and seven small apps sharing a login.',
      },
      {
        title: 'Local first, synced second',
        body: 'Every page reads from the browser copy, so it opens instantly and keeps working when the network drops. Changes mirror into MySQL in the background 400 ms after the last edit, so a burst of typing becomes one save rather than twelve.',
      },
      {
        title: 'Send the difference, not the document',
        body: 'Each browser keeps the copy it last synced — the base — and sends only what changed against it. An item added on a phone is never deleted by a laptop that has not seen it yet, which is the failure mode of last-write-wins sync.',
      },
      {
        title: 'One transaction per save',
        body: 'The upserts and deletes for a save run inside a single transaction: either every row lands or none does. A failure retries with growing gaps from 5 up to 60 seconds, and unsaved changes wait in the browser instead of being lost.',
      },
      {
        title: 'Seven runtime dependencies',
        body: 'react, react-dom and react-router in the app; express, mysql2, bcryptjs and web-push in the API. Nothing else. The CSS is hand-written against design tokens, and both themes are built rather than one derived from the other.',
      },
    ],
    flow: {
      label: 'What happens when you add a task',
      steps: [
        'Page writes to localStorage',
        'Re-render from the store',
        'Debounce 400 ms',
        'Diff against the last synced base',
        'Send only the changed items',
        'Verify session and ownership',
        'Transaction — upsert, delete, commit',
      ],
    },
    honest: [
      'The API self-migrates: missing tables and columns are added on the first request after a deploy. That keeps a hosted database in step with the code without a separate migration step — a deliberate trade that is convenient at this size, and the first thing to replace if the schema ever has to change under load.',
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  dibz: {
    problem: [
      'Four people eat, the bill lands, someone divides by four. On a ₹1,564 bill for three, headcount says ₹521 each; what they actually ate says ₹753, ₹334 and ₹477. The person who had a salad and tap water is ₹187 out of pocket, everyone notices, and nobody wants to be the one doing arithmetic at the table.',
      'The interesting problem is not the division. It is that a fair split produces fractions — proportions of tax, service charge and tip — while rupees are whole. Round each person independently and the totals stop adding up to the bill, which is the one thing a bill splitter may never get wrong.',
    ],
    decisions: [
      {
        title: 'A multimodal model reads the receipt, not an OCR parser',
        body: 'OCR gives you text and leaves you writing heuristics to guess which number is a price, which is a quantity, and which is the GST line. Gemini is handed the photograph and returns typed JSON directly, so there is no parser to break on an unfamiliar receipt layout. CGST and SGST are merged into one figure on the way out, because no one splitting dinner cares that tax arrived in two halves.',
      },
      {
        title: 'Every extra is allocated by proportion, never per head',
        body: 'Each person’s share of the items gives a proportion of the subtotal, and that one number drives tax, service charge and discount alike. Splitting a service charge per head would quietly reintroduce the exact unfairness the app exists to remove — the light eater subsidising the heavy one, one level further down.',
      },
      {
        title: 'Tip is a decision, not an assumption',
        body: 'Tip can be proportional or split evenly, chosen per bill. Proportional is defensible and even is what groups often actually do, so hardcoding either one would be the app overriding a social call it has no standing to make.',
      },
      {
        title: 'Round to whole rupees, then reconcile the remainder out loud',
        body: 'Each person is rounded to a whole rupee, which leaves the rounded totals a rupee or two off the real bill. That leftover is parked on the largest single bill — the least proportional distortion — and then surfaced on that person’s card as an explicit rounding line. The alternative, spreading fractions silently, produces totals that are correct and unverifiable.',
      },
      {
        title: 'Snap float dust before rounding',
        body: 'When every item is assigned, the shares should sum to the bill exactly, but proportions are divisions and floating point leaves residue. The sum is snapped to the bill total when it is within ~1e-9 of it, so a bill landing on a .5 boundary cannot round away from the figure being displayed.',
      },
      {
        title: 'Uncovered value is measured before rounding, not after',
        body: 'Items nobody tagged are excluded from the split and reported separately. That shortfall is computed on the pre-rounding numbers, so the ±50 paise of whole-rupee rounding can never masquerade as money going missing.',
      },
    ],
    flow: {
      label: 'Six steps, one backend route',
      steps: [
        'Photograph the receipt',
        'Gemini returns typed JSON — items, qty, tax, service',
        'Add people',
        'Tap who ordered what — shared plates split evenly',
        'Confirm charges, choose tip mode',
        'Proportional allocation, round, reconcile, show working',
      ],
    },
    table: {
      caption: 'A real ₹1,564 bill across three people — the gap headcount hides.',
      head: ['Method', 'Aisha', 'Bo', 'Chandni'],
      rows: [
        ['Divided by headcount', '₹521', '₹521', '₹521'],
        ['What they actually ate', '₹753', '₹334', '₹477'],
      ],
    },
    honest: [
      'An assignment pointing at a deleted person does not count as coverage, so removing someone mid-split reopens their items rather than silently dropping them. That is deliberate, but it does mean a half-finished bill can show an uncovered balance until the items are re-tagged.',
      'There are no accounts and no database. The in-progress bill lives in localStorage, which is why installing to the home screen matters on iOS — it is what stops the system clearing the tab out from under a half-entered bill. The cost is that nothing is shared between devices and there is no history.',
      'The receipt photo goes to Gemini to be read and is not stored, but it does leave the device. A fully local split still requires typing the items in by hand.',
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  saahas: {
    problem: [
      'The speech-emotion ensemble had only ever run inside its own evaluation harness, where the inputs are clean and the audience is me. SAAHAS is where it had to serve somebody else’s interface: a trauma-informed check-in, where a confidently wrong reading is not a logged metric but a person being told their own distress is something other than what it is.',
      'That reframes nearly every engineering decision. The question stops being how accurate the model is and becomes what the product does when the model is uncertain, still loading, or unavailable.',
    ],
    decisions: [
      {
        title: 'Inference stays on the machine',
        body: 'A FastAPI process loads roughly 3.5 GB of checkpoints locally and analyses in-process. For an app whose subject matter is trauma, uploading voice recordings of someone’s worst moments to a third-party endpoint is not a trade-off to be balanced — it is the thing that must not happen, and running locally removes the question entirely.',
      },
      {
        title: 'Stream the microphone, finalise on utterances',
        body: 'The Voice Companion streams raw Float32 PCM over a WebSocket and shows tone live. When the sixty-second check-in ends, or the user finishes early, it flushes trailing silence so the backend can finalise the last utterance before the reflection is built. Without that flush the final — usually most considered — thing someone says is the one that never gets scored.',
      },
      {
        title: 'Offline is a state the interface has, not a failure it hides',
        body: 'The first run downloads several gigabytes of checkpoints. Until the backend reports healthy, the Voice Companion says voice analysis is offline and offers a retry, driven by a real health endpoint that reports which models actually loaded. An app in this category that silently returns neutral while its models are still downloading is lying to someone who is checking in on their own wellbeing.',
      },
      {
        title: 'A separate local model for chat, with tone as context',
        body: 'Safe Chat runs Qwen3-4B locally through MLX on Apple Silicon with a trauma-informed system prompt, kept distinct from the emotion models. Voice notes sent to chat still pass through the emotion model and the detected tone gently informs the reply — tone shapes the response rather than being announced back at the user as a label.',
      },
      {
        title: 'Risk language short-circuits the model',
        body: 'Messages suggesting self-harm or danger surface a helpline banner and a direct route to a counsellor. That path does not depend on the language model behaving well, because the one case where a generated reply is least acceptable is exactly the case where it matters most.',
      },
      {
        title: 'One origin in development',
        body: 'Vite proxies the health, predict and WebSocket routes to the backend, so the browser talks to a single origin and there is no CORS configuration to get wrong. A small thing that removes an entire class of works-on-my-machine failure from a two-service project.',
      },
    ],
    flow: {
      label: 'Check-in path',
      steps: [
        'Microphone — Float32 PCM over WebSocket',
        'Live tone while speaking',
        'Flush trailing silence on finish',
        'Backend finalises the last utterance',
        'Stress / Energy / Fatigue updated — needs ≥2 s of speech',
        'Reflection built from real results, never placeholders',
      ],
    },
    honest: [
      'The chat model runs through MLX, which is Apple Silicon only. On other hardware the chat falls back to scripted replies — functional, and visibly not the same thing.',
      'Every accuracy limit from the underlying speech-emotion work carries over intact: roughly 65% on acted corpora, roughly 27% on spontaneous speech. Wrapping the models in a gentler interface does not make them more correct, and the design assumes they are often wrong.',
      'The first run is a multi-gigabyte download before anything works. That is a genuinely poor first impression, and the offline state exists to make it honest rather than to make it fast.',
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  'kinetic-city': {
    problem: [
      'Built as AI Engineer with Team Finbros for the Finvasia Innovation Hackathon. The brief most teams answer is that first-time Indian retail investors lack information, which leads to a product that explains more things at them.',
      'The premise here was that the blocker is fear, not ignorance — and that four different fears need four different answers. Someone afraid of losing money and someone who believes the entire industry is a scam are not helped by the same sentence, however accurate it is.',
    ],
    decisions: [
      {
        title: 'Route the answer on fear type, not topic',
        body: 'KINU classifies into four postures and shifts register for each. Loss leads with worst-case rupee amounts and historical recovery. Jargon wraps every term in an analogy. Scam cites SEBI, AMFI and RBI and shows its sources. Trust drops the personality entirely and leads with index-fund mathematics. The same question gets four genuinely different replies.',
      },
      {
        title: 'Constrain the model in the prompt, hard',
        body: 'Always give rupee amounts. Never use a term without explaining it inline. Frame worst cases as survivable. Say so when you do not know. Never sell anything. Sixty words unless more is asked for. Most of these exist to stop a fluent model from being reassuring in ways it has not earned.',
      },
      {
        title: 'Monte Carlo in rupees, not percentages',
        body: 'SIP portfolio outcomes are simulated and reported as rupee amounts. A distribution of returns is the statistically honest presentation and it is also the one that produces decision paralysis in the exact audience this was built for; "in the worst tenth of outcomes you have ₹X" is a sentence somebody can act on.',
      },
      {
        title: 'Every model call goes through one pool',
        body: 'Backend AI calls route through a single module rather than each router holding its own client. That is what made swapping providers a change in one file — which, over this project’s life, happened more than once.',
      },
    ],
    flow: {
      label: 'Mentor request',
      steps: [
        'Learner asks in context of the current dashboard',
        'Fear type selects the system context',
        'Single pool module — Azure OpenAI GPT-4o',
        'Reply: the fact, what it means, what to do',
        'Rupee-framed, capped at 60 words',
      ],
    },
    honest: [
      'The module every AI call passes through is still named groq_pool.py, and env.example still asks for a GEMINI_API_KEY that nothing reads. The code runs on Azure OpenAI GPT-4o. Three providers’ worth of archaeology survives in the naming because a hackathon rewards the switch working by the deadline and never rewards going back to rename the file. The repo README still advertises Gemini too — it is wrong, and the source is the thing to believe.',
      'This portfolio described it as running on Gemini until that was checked against the code rather than the README. Worth stating plainly, since the whole point of these pages is that the claims are checkable.',
      'Market data comes through yfinance, which is fine for a hackathon and is not a licensed feed. Nothing here is financial advice, and KINU is explicitly built never to recommend a product.',
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  'lily-bloom': {
    problem: [
      'Gesture-controlled AR demos almost always composite a sprite onto a hand landmark. It works, it reads as a filter, and the hard part — making something feel alive — is skipped by shipping an asset somebody else drew.',
      'The constraint here was that nothing on screen is an image file. Every petal, freckle, stamen and glowing throat is drawn in code at the tip of a branch whose position comes from your hand.',
    ],
    decisions: [
      {
        title: 'The flowers are drawn, not placed',
        body: 'Around seven hundred lines of renderer produce recurved tepals, feathered edges, freckle patterns, stamens with anther tips, a glowing throat star and sparkle particles — composited over the video at 95% opacity. The palette is defined as named constants rather than scattered through the drawing code, which is what makes the whole garden retintable in one place.',
      },
      {
        title: 'Two hands, two independent jobs',
        body: 'Pinch distance on the left hand drives stem growth; the right hand drives bloom, with petals only beginning to peel open past a threshold. Separating growth from bloom turns a single slider into something with a sequence — you build the plant, then you open it.',
      },
      {
        title: 'Smooth the gesture, never track it directly',
        body: 'Raw landmark distance is jittery, and mapping it straight to petal angle makes flowers that twitch. Every gesture value is eased toward its target, so the response is slightly heavy — the same reason a well-weighted interface feels better than an instantaneous one.',
      },
      {
        title: 'The garden breathes when you stop moving',
        body: 'A 0.22 Hz breeze, a few pixels of sway at the tips and a slow continuous rotation run regardless of input. Without them the scene freezes the instant you hold still, which reads immediately as a paused video rather than a living thing — the single change that did most for whether it feels alive.',
      },
      {
        title: 'Everything stays on 127.0.0.1',
        body: 'Flask streams annotated frames back to the browser as MJPEG from localhost. A webcam app that uploads nothing has no privacy policy to read, and the camera-unavailable case draws an explanatory frame instead of crashing, with an automatic port hop when 5000 is taken.',
      },
    ],
    flow: {
      label: 'Per-frame path',
      steps: [
        'Webcam frame',
        'MediaPipe — landmarks for both hands',
        'Pinch ratio per hand, eased toward target',
        'State machine advances growth and bloom',
        'Procedural render — stems, leaves, petals, sparkles',
        'Breeze, sway and rotation applied',
        'MJPEG back to the browser',
      ],
    },
    honest: [
      'Rendering is CPU-bound Python compositing per frame. It is comfortable on a modern laptop and it is not a 60 fps engine; the breeze and sway are tuned to stay pleasant at the frame rate it actually achieves.',
      'The repository has its virtual environment committed, which is why it clones at around 100 MB for what is a few hundred kilobytes of source. A straightforward fix, listed here because the repo link is right there and anyone clicking it will see it before I do.',
      'Two plants, seven blooms, one camera. It is a keepsake rather than a tool, and it does not try to be anything else.',
    ],
  },
}

/** Project ids that have a deep page, in the order Work lists them. */
export function studyOrder(projects) {
  return projects.filter((p) => studies[p.id]).map((p) => p.id)
}
