import { useEffect } from 'react'
import { Badge, Spinner } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import MockBanner from '../components/MockBanner'
import ParticipantImage from '../components/ParticipantImage'
import SimilarParticipants from '../components/SimilarParticipants'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchParticipantThunk } from '../store/participantsSlice'
import { formatDate } from '../utils/status'

// Страница одного участника в портретном режиме
export default function ParticipantPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { current: participant, loading, isMock } = useAppSelector((s) => s.participants)

  useEffect(() => {
    dispatch(fetchParticipantThunk(Number(id)))
  }, [id, dispatch])

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }
  if (!participant) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Участники', to: '/participants' }, { label: 'Не найдено' }]} />
        <p className="empty">Участница не найдена</p>
      </>
    )
  }

  return (
    <>
      <Breadcrumbs items={[{ label: 'Участники', to: '/participants' }, { label: participant.full_name }]} />
      <MockBanner show={isMock} />
      <article className="vibe">
        {participant.video_url ? (
          <video className="vibe__video" src={participant.video_url} poster={participant.image_url ?? undefined} autoPlay muted loop playsInline />
        ) : (
          <ParticipantImage className="vibe__photo" src={participant.image_url} alt={participant.full_name} />
        )}
        <div className="vibe__info">
          <Badge bg="light" text="primary" className="participant-card__badge">
            {participant.position}
          </Badge>
          <h1 className="vibe__name">{participant.full_name}</h1>
          <dl className="vibe__facts">
            <div><dt>Дата рождения</dt><dd>{formatDate(participant.birth_date)}</dd></div>
            <div><dt>Рост</dt><dd>{participant.height_cm} см</dd></div>
            <div><dt>Разряд</dt><dd>{participant.sport_rank}</dd></div>
            <div><dt>Город</dt><dd>{participant.city}</dd></div>
          </dl>
          <p className="vibe__description">{participant.description}</p>
        </div>
      </article>
      <SimilarParticipants participant={participant} />
    </>
  )
}
