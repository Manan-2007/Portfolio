/* ────────────────────────────────────────────────────────────────────────
   Credentials and engineering roles. `icon` resolves against the brand
   table in @/lib/techIcons; issuers without a published mark carry a
   `mono` string instead and render as a lettered tile.
   ──────────────────────────────────────────────────────────────────────── */

export const certificates = [
  {
    title: 'Azure Fundamentals',
    code: 'AZ-900',
    issuer: 'Microsoft',
    icon: 'microsoft',
    year: '2025',
    type: 'Certification',
    href: 'https://www.credly.com/badges/5847bf49-b3f6-4474-bb38-352728c156e9/linked_in_profile',
  },
  {
    title: 'Introduction to Generative AI',
    issuer: 'Google',
    icon: 'google',
    year: '2026',
    type: 'Specialisation',
    href: 'https://www.coursera.org/account/accomplishments/specialization/certificate/VDTRCKLK20LY',
  },
  {
    title: 'Build RAG Applications',
    issuer: 'IBM',
    icon: 'ibm',
    year: '2026',
    type: 'Certificate',
    href: 'https://www.coursera.org/account/accomplishments/certificate/9BE91E3XN6NS',
  },
  {
    title: 'Develop Generative AI Applications',
    issuer: 'IBM',
    icon: 'ibm',
    year: '2026',
    type: 'Certificate',
    href: 'https://www.coursera.org/account/accomplishments/certificate/DLJS3455NNEW',
  },
  {
    title: 'AI For Everyone',
    issuer: 'DeepLearning.AI',
    mono: 'DL',
    year: '2025',
    type: 'Certificate',
    href: 'https://www.coursera.org/account/accomplishments/certificate/PC5962JE1FBR',
  },
  {
    title: 'Python Data Structures',
    issuer: 'University of Michigan',
    mono: 'UM',
    year: '2025',
    type: 'Certificate',
    href: 'https://www.coursera.org/account/accomplishments/certificate/2YZNHI0UN759',
  },
  {
    title: 'Crash Course on Python',
    issuer: 'Google',
    icon: 'google',
    year: '2025',
    type: 'Certificate',
    href: 'https://www.coursera.org/account/accomplishments/certificate/TKAGYCEAWZUG',
  },
  {
    title: 'Excel Essentials for Data Analytics',
    issuer: 'IBM',
    icon: 'ibm',
    year: '2025',
    type: 'Certificate',
    href: 'https://www.coursera.org/account/accomplishments/certificate/R3H9HS663F1K',
  },
]

/* Engineering roles — the two places this work has been done for someone
   other than me. Kept alongside the credentials rather than on a timeline. */
export const experience = [
  {
    title: 'AI Engineer',
    org: 'Kinetic City · Team Finbros',
    context: 'Finvasia Innovation Hackathon',
    period: 'Jan 2026',
    points: [
      'Built an AI companion for first-time Indian retail investors, aimed at the fear that stops people investing at all.',
      'Implemented Monte Carlo SIP portfolio simulation with rupee-framed output to cut decision paralysis.',
      'Measured the result against investor confidence rather than model accuracy.',
    ],
  },
  {
    title: 'Speech-to-Text Pipeline Lead',
    org: 'ASHA-VANI · Hinglish Voice AI',
    context: 'Team project',
    period: '2025',
    points: [
      'Led the end-to-end STT pipeline for ASHA health workers using Faster-Whisper and Silero VAD on an RTX 40-series GPU.',
      'Added Hinglish and Bhojpuri support and benchmarked word error rate with jiwer across real-world audio conditions.',
      'Authored a contract spec fixing 16 kHz mono int16 PCM so four developers could integrate against one audio format.',
    ],
  },
]
