import { PARTICIPANTS_MOCK } from '../mocks/participants'
import type { Participant, ParticipantsFilter } from '../types'

// Результат запроса: данные и признак, что они взяты из mock (бэкенд недоступен)
export interface Loaded<T> {
  data: T
  isMock: boolean
}

// Адрес API: в режиме разработки запросы идут на тот же origin и проксируются Vite на бэкенд (решение CORS)
const API = '/api'

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { signal: AbortSignal.timeout(3000) })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

function filterMock(filter: ParticipantsFilter): Participant[] {
  const name = filter.participantName.trim().toLowerCase()
  return PARTICIPANTS_MOCK.filter(
    (p) => (!name || p.full_name.toLowerCase().includes(name)) && (!filter.position || p.position === filter.position),
  )
}

// GET /api/participants?participant_name=&position= — фильтрация на бэкенде, при ошибке — mock
export async function getParticipants(filter: ParticipantsFilter): Promise<Loaded<Participant[]>> {
  const params = new URLSearchParams()
  if (filter.participantName.trim()) params.set('participant_name', filter.participantName.trim())
  if (filter.position) params.set('position', filter.position)
  try {
    return { data: await getJSON<Participant[]>(`${API}/participants?${params}`), isMock: false }
  } catch {
    return { data: filterMock(filter), isMock: true }
  }
}

// GET /api/participants/:id — при ошибке сети берём участника из mock
export async function getParticipant(id: number): Promise<Loaded<Participant | undefined>> {
  try {
    return { data: await getJSON<Participant>(`${API}/participants/${id}`), isMock: false }
  } catch {
    return { data: PARTICIPANTS_MOCK.find((p) => p.id === id), isMock: true }
  }
}
