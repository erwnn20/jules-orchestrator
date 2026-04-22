import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  // root: 'src/renderer',
  plugins: [react(), tailwindcss()],
  base: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@context': path.resolve(__dirname, './context'),
      '@data': path.resolve(__dirname, './data'),
      '@pages': path.resolve(__dirname, './components/pages'),
      '@components': path.resolve(__dirname, './components'),
      '@interfaces': path.resolve(__dirname, './interfaces'),
      '@': path.resolve(__dirname, '.'),
    },
  },
})
