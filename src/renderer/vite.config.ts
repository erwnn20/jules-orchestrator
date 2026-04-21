import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
      '@pages': path.resolve(__dirname, './components/pages'),
      '@components': path.resolve(__dirname, './components'),
      '@interfaces': path.resolve(__dirname, './interfaces'),
    },
  },
})
