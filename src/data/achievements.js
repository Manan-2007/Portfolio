/* ────────────────────────────────────────────────────────────────────────
   Credentials and engineering roles. `icon` resolves against the brand
   table in @/lib/techIcons; issuers without a published mark carry a
   `mono` string instead and render as a lettered tile.

   Every `href` was opened and read before being written here. Coursera's
   `/accomplishments/certificate/<id>` form returns an empty "Course
   Record" shell rather than a 404, so seven links on this page pointed at
   blank pages while still answering 200. The form that renders is
   `/verify/<id>` for a course and `/specialization/<id>` for a
   specialisation.

   Eight of twenty held credentials are listed. The Google specialisation
   subsumes its four component courses, so listing the parts would spend
   four cards on one credential; the Python intro courses and the Excel
   course are left off because the roster leads with AI and cloud. Python
   Data Structures stays as the single fundamentals card.
   ──────────────────────────────────────────────────────────────────────── */

export const certificates = [
  {
    /* The Credly badge reads "Microsoft Certified: Azure AI Fundamentals",
       issued 2025-11-17. It was previously labelled here as AZ-900, which is
       a different exam — the badge link made that checkable in one click. */
    title: 'Azure AI Fundamentals',
    code: 'AI-900',
    issuer: 'Microsoft',
    icon: 'microsoft',
    year: '2025',
    type: 'Certification',
    href: 'https://www.credly.com/badges/5847bf49-b3f6-4474-bb38-352728c156e9/public_url',
  },
  {
    title: 'Azure Data Fundamentals',
    code: 'DP-900',
    issuer: 'Microsoft',
    icon: 'microsoft',
    year: '2026',
    type: 'Certification',
    href: 'https://www.credly.com/badges/3c2b9e02-cfe8-4dd9-87d7-862c086939ea/public_url',
  },
  {
    /* Coursera calls this "Introduction to Generative AI Learning Path", and
       the issuer of record is Google Cloud rather than Google. It subsumes the
       four Feb-2026 component courses (Intro to GenAI, Intro to LLMs, Intro to
       Responsible AI, Responsible AI with Google Cloud), so only the
       specialisation is listed — the parts would quadruple the row for one
       credential. */
    title: 'Introduction to Generative AI Learning Path',
    issuer: 'Google Cloud',
    icon: 'google',
    year: '2026',
    type: 'Specialisation',
    href: 'https://www.coursera.org/account/accomplishments/specialization/VDTRCKLK20LY',
  },
  {
    title: 'Build RAG Applications: Get Started',
    issuer: 'IBM',
    icon: 'ibm',
    year: '2026',
    type: 'Certificate',
    href: 'https://www.coursera.org/account/accomplishments/verify/9BE91E3XN6NS',
  },
  {
    title: 'Develop Generative AI Applications: Get Started',
    issuer: 'IBM',
    icon: 'ibm',
    year: '2026',
    type: 'Certificate',
    href: 'https://www.coursera.org/account/accomplishments/verify/DLJS3455NNEW',
  },
  {
    title: 'AI For Everyone',
    issuer: 'DeepLearning.AI',
    mono: 'DL',
    year: '2025',
    type: 'Certificate',
    href: 'https://www.coursera.org/account/accomplishments/verify/PC5962JE1FBR',
  },
  {
    title: 'Cybersecurity for Everyone',
    issuer: 'University of Maryland',
    mono: 'UMD',
    year: '2026',
    type: 'Certificate',
    href: 'https://www.coursera.org/account/accomplishments/verify/HU1FNO62FCJR',
  },
  {
    title: 'Python Data Structures',
    issuer: 'University of Michigan',
    mono: 'UM',
    year: '2025',
    type: 'Certificate',
    href: 'https://www.coursera.org/account/accomplishments/verify/2YZNHI0UN759',
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
