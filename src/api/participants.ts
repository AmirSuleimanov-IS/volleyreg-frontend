import { PARTICIPANTS_MOCK } from '../mocks/participants'
import type { Participant, ParticipantsFilter } from '../types'
import { api } from './index'

// Результат запроса: данные и признак, что они взяты из mock (бэкенд недоступен)
export interface Loaded<T> {
  data: T
  isMock: boolean
}

function filterMock(filter: ParticipantsFilter): Participant[] {
  const name = filter.participantName.trim().toLowerCase()
  return PARTICIPANTS_MOCK.filter(
    (p) => (!name || p.full_name.toLowerCase().includes(name)) && (!filter.position || p.position === filter.position),
  )
}

// GET /api/participants через сгенерированный axios-клиент; при ошибке — mock-коллекция
export async function getParticipants(filter: ParticipantsFilter): Promise<Loaded<Participant[]>> {
  try {
    const { data } = await api.participants.participantsList(
      {
        participant_name: filter.participantName.trim() || undefined,
        position: filter.position || undefined,
      },
      { timeout: 3000 },
    )
    return { data: data as Participant[], isMock: false }
  } catch {
    return { data: filterMock(filter), isMock: true }
  }
}

// GET /api/participants/:id; при ошибке сети — участник из mock
export async function getParticipant(id: number): Promise<Loaded<Participant | undefined>> {
  try {
    const { data } = await api.participants.participantsDetail(id, { timeout: 3000 })
    return { data: data as Participant, isMock: false }
  } catch {
    return { data: PARTICIPANTS_MOCK.find((p) => p.id === id), isMock: true }
  }
}
