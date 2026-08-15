/* ────────────────────────────────────────────────────────────────────────
   Technical stack, grouped by what the tool is actually for. Six groups so
   they tile evenly (2 × 3 on tablet, 3 × 2 on desktop) and the whole stack
   can be taken in without scanning sideways.

   `icon` keys resolve against the brand table in @/lib/techBrands — an entry
   with no matching key falls back to a monogram tile, which is deliberate
   rather than broken.
   ──────────────────────────────────────────────────────────────────────── */

export const groups = [
  {
    id: 'languages',
    label: 'Languages',
    note: 'The grammar underneath all of it.',
    items: [
      { name: 'Python', icon: 'python' },
      { name: 'C', icon: 'c' },
      { name: 'C++', icon: 'cpp' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'SQL', icon: 'sql' },
    ],
  },
  {
    id: 'ml',
    label: 'Machine Learning & AI',
    note: 'Training, evaluation, and the honesty in between.',
    items: [
      { name: 'PyTorch', icon: 'pytorch' },
      { name: 'TensorFlow', icon: 'tensorflow' },
      { name: 'Keras', icon: 'keras' },
      { name: 'Scikit-learn', icon: 'sklearn' },
      { name: 'Hugging Face', icon: 'huggingface' },
      { name: 'LangChain', icon: 'langchain' },
    ],
  },
  {
    id: 'perception',
    label: 'Vision & Speech',
    note: 'Turning pixels and pressure waves into decisions.',
    items: [
      { name: 'OpenCV', icon: 'opencv' },
      { name: 'MediaPipe', icon: 'mediapipe' },
      { name: 'Whisper', icon: 'whisper' },
      { name: 'Silero VAD', icon: 'vad' },
      { name: 'NumPy', icon: 'numpy' },
      { name: 'Pandas', icon: 'pandas' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    note: 'Where the model finally meets a person.',
    items: [
      { name: 'React', icon: 'react' },
      { name: 'Three.js', icon: 'three' },
      { name: 'Framer Motion', icon: 'framer' },
      { name: 'Tailwind CSS', icon: 'tailwind' },
      { name: 'Vite', icon: 'vite' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    note: 'The service the interface talks to.',
    items: [
      { name: 'FastAPI', icon: 'fastapi' },
      { name: 'Flask', icon: 'flask' },
      { name: 'Node.js', icon: 'node' },
      { name: 'SQLite', icon: 'sqlite' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & Tools',
    note: 'Making it run somewhere other than my laptop.',
    items: [
      { name: 'Azure', icon: 'azure' },
      { name: 'Docker', icon: 'docker' },
      { name: 'CUDA', icon: 'nvidia' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
    ],
  },
]
