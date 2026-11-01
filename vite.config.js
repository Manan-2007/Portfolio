import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    /* Naming a vendor group below also enlists it in the entry's preload
       graph, so `<link rel="modulepreload">` for three and R3F was being
       emitted into every page's head. That quietly undid the lazy import:
       224 kB gzip of WebGL was fetched eagerly on first paint — on phones
       that never render it, under prefers-reduced-motion, and on the
       case-study routes that have no canvas at all.

       React and Framer Motion stay preloaded because they genuinely are the
       critical path. Dropping these two from the hint list does not stop
       them loading; the dynamic import still pulls them when the hero
       decides it wants them. */
    modulePreload: {
      resolveDependencies: (_url, deps, { hostType }) =>
        hostType === 'html'
          ? deps.filter((d) => !/vendor-(three|r3f)/.test(d))
          : deps,
    },
    // Vite 8 runs on rolldown — the classic rollup `manualChunks` object form
    // is a hard error here, so vendor splitting goes through codeSplitting.
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'vendor-three', test: /node_modules\/three\// },
            { name: 'vendor-r3f', test: /node_modules\/(@react-three|three-stdlib)/ },
            { name: 'vendor-motion', test: /node_modules\/(framer-motion|motion-dom|motion-utils)/ },
            { name: 'vendor-react', test: /node_modules\/(react|react-dom|scheduler)\// },
          ],
        },
      },
    },
  },
  server: {
    port: Number(process.env.PORT) || 5173,
  },
})
