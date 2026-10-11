import { PARTICIPANTS_MOCK } from '../mocks/participants'
import type { Participant, ParticipantsFilter } from '../types'

// Лабораторная 5: данные берутся из mock-коллекции, фильтрация — на клиенте

export async function getParticipants(filter: ParticipantsFilter): Promise<Participant[]> {
  const name = filter.participantName.trim().toLowerCase()
  return PARTICIPANTS_MOCK.filter(
    (p) =>
      (!name || p.full_name.toLowerCase().includes(name)) &&
      (!filter.position || p.position === filter.position),
  )
}

export async function getParticipant(id: number): Promise<Participant | undefined> {
  return PARTICIPANTS_MOCK.find((p) => p.id === id)
}
