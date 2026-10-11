import { Badge, Button, Card, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import type { Participant } from '../types'
import ParticipantImage from './ParticipantImage'

interface Props {
  participant: Participant
  onAdd?: (id: number) => void // кнопка «Добавить» в заявку (только для авторизованного пользователя)
  adding?: boolean
}

// Карточка участника в списке
export default function ParticipantCard({ participant, onAdd, adding }: Props) {
  return (
    <Card className="participant-card h-100">
      <Link to={`/participants/${participant.id}`}>
        <ParticipantImage className="card-img-top participant-card__image" src={participant.image_url} alt={participant.full_name} />
      </Link>
      <Card.Body className="d-flex flex-column">
        <div>
          <Badge bg="light" text="primary" className="participant-card__badge">
            {participant.position}
          </Badge>
        </div>
        <Card.Title className="participant-card__title">
          <Link to={`/participants/${participant.id}`}>{participant.full_name}</Link>
        </Card.Title>
        <Card.Text className="participant-card__meta">
          Рост {participant.height_cm} см · {participant.sport_rank}
          <br />
          {participant.city}
        </Card.Text>
        {onAdd && (
          <Button className="mt-auto align-self-start" size="sm" disabled={adding} onClick={() => onAdd(participant.id)}>
            {adding ? <Spinner animation="border" size="sm" /> : 'Добавить'}
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}
