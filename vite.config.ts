import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/color-converter/', // GitHub Pages deployment path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
