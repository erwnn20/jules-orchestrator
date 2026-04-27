import react from '@vitejs/plugin-react'
import path from "path";
import { defineConfig } from 'vite'

export default defineConfig({
  // root: 'src/renderer',
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './components'),
      '@services': path.resolve(__dirname, './services'),
      '@jules': path.resolve(__dirname, '../../src/shared/jules/'),
    },
  },
})