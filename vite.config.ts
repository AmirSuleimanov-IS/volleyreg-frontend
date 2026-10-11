import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Режимы сборки:
//   npm run dev          — разработка, /api проксируется на бэкенд
//   npm run dev:https    — то же по HTTPS (самоподписанный сертификат)
//   npm run build:pages  — GitHub Pages: base /volleyreg-frontend/, PWA, mock при недоступном бэкенде (.env.pages)
//   npm run build:tauri  — нативное приложение Tauri для гостя, бэкенд по IP в локальной сети (.env.tauri)
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_BASE || '/',
    plugins: [
      react(),
      mode === 'https' && basicSsl(),
      mode !== 'tauri' &&
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['default_participant.svg', 'icons/apple-touch-icon.png'],
          manifest: {
            name: 'VolleyReg — регистрация команд',
            short_name: 'VolleyReg',
            description: 'Регистрация команд на Первенство ЗГУ по волейболу 2026',
            lang: 'ru',
            theme_color: '#18214D',
            background_color: '#EFF2F6',
            display: 'standalone',
            start_url: '.',
            scope: '.',
            icons: [
              { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
              { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
              { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
            ],
          },
          workbox: {
            // в офлайн-кэш кладём приложение и mock-фото; тяжёлые WASM transformers.js и видео не кэшируем
            globPatterns: ['**/*.{js,css,html,svg,png,jpg}'],
            globIgnores: ['**/*.wasm', '**/*.mp4'],
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            navigateFallback: 'index.html',
          },
        }),
    ].filter(Boolean),
    server: {
      port: 3000,
      host: true,
      // проксирование запросов к API на бэкенд: для браузера это тот же origin, поэтому CORS не мешает
      proxy: {
        '/api': 'http://localhost:8080',
      },
    },
    preview: { port: 4173, host: true },
    // transformers.js загружает WASM-модули сам, их не нужно предварительно собирать
    optimizeDeps: {
      exclude: ['@huggingface/transformers'],
    },
  }
})
