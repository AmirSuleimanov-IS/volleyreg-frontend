// Участник соревнования (услуга) — как в ответе GET /api/participants
export interface Participant {
  id: number
  full_name: string
  description: string
  birth_date: string
  position: string
  height_cm: number
  sport_rank: string
  city: string
  image_url: string | null
  video_url: string | null
}

// Фильтры списка участников
export interface ParticipantsFilter {
  participantName: string
  position: string
}

export const POSITIONS = ['Связующая', 'Доигровщица', 'Диагональная', 'Центральная блокирующая', 'Либеро']
