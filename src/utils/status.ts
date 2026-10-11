// Названия статусов заявки команды для интерфейса
export const STATUS_TITLES: Record<string, string> = {
  draft: 'Черновик',
  formed: 'Сформирована',
  completed: 'Допущена',
  rejected: 'Отклонена',
  deleted: 'Удалена',
}

export const STATUS_VARIANTS: Record<string, string> = {
  draft: 'secondary',
  formed: 'primary',
  completed: 'success',
  rejected: 'danger',
}

export const formatDate = (iso?: string | null) => (iso ? iso.slice(0, 10).split('-').reverse().join('.') : '—')

export const formatDateTime = (iso?: string | null) =>
  iso ? `${formatDate(iso)} ${new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}` : '—'
