import axios from 'axios'
import { Api } from './generated/Api'

// ключ, под которым JWT хранится в localStorage
export const TOKEN_KEY = 'volleyreg_token'

// Клиент API, сгенерированный из Swagger бэкенда (npm run generate-api).
// baseURL пустой: запросы /api/... идут на тот же origin и проксируются Vite на бэкенд.
// securityWorker добавляет заголовок Authorization: Bearer <JWT> к методам, помеченным @Security в Swagger.
export const api = new Api({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  securityWorker: () => {
    const token = localStorage.getItem(TOKEN_KEY)
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {}
  },
})

// Текст ошибки из ответа бэкенда ({"error": "..."}) или сообщение axios
export function errorMessage(e: unknown): string {
  if (axios.isAxiosError(e)) {
    return (e.response?.data as { error?: string } | undefined)?.error ?? e.message
  }
  return e instanceof Error ? e.message : String(e)
}
