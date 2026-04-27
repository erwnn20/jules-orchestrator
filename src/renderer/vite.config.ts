import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react'
import path from 'path'
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
      '@services': path.resolve(__dirname, './services'),
      '@jules': path.resolve(__dirname, '../../src/shared/jules/'),
      '@config': path.resolve(__dirname, './config'),
      '@context': path.resolve(__dirname, './context'),
      '@data': path.resolve(__dirname, './data'),
      '@pages': path.resolve(__dirname, './components/pages'),
      '@components': path.resolve(__dirname, './components'),
      '@interfaces': path.resolve(__dirname, './interfaces'),
      '@': path.resolve(__dirname, '.'),
    },
  },
})
