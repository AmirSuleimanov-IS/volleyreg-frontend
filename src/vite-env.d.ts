/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string // адрес бэкенда; пусто — тот же origin (proxy Vite)
  readonly VITE_BASE?: string // базовый путь сайта (GitHub Pages)
  readonly VITE_GUEST_ONLY?: string // 'true' — только интерфейс гостя (Tauri)
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
