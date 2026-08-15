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
