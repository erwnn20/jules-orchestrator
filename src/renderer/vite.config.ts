import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  // root: 'src/renderer',
  plugins: [react(), tailwindcss()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../src/shared/'),
      '@jules': path.resolve(__dirname, '../../src/shared/jules/'),
      '@github': path.resolve(__dirname, '../../src/shared/github/'),
      '@context': path.resolve(__dirname, './context'),
      '@services': path.resolve(__dirname, './services'),
      '@pages': path.resolve(__dirname, './components/pages'),
      '@components': path.resolve(__dirname, './components'),
      '@renderer': path.resolve(__dirname, '.'),
    },
  },
})
