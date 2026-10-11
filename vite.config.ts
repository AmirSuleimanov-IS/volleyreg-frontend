import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    // проксирование запросов к API на бэкенд: для браузера это тот же origin, поэтому CORS не мешает
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  // transformers.js загружает WASM-модули сам, их не нужно предварительно собирать
  optimizeDeps: {
    exclude: ['@huggingface/transformers'],
  },
})
