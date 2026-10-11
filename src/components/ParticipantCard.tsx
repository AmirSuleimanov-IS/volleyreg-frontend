import { Badge, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import type { Participant } from '../types'
import ParticipantImage from './ParticipantImage'

interface Props {
  participant: Participant
}

// Карточка участника в списке
export default function ParticipantCard({ participant }: Props) {
  return (
    <Card className="participant-card h-100">
      <Link to={`/participants/${participant.id}`}>
        <ParticipantImage className="card-img-top participant-card__image" src={participant.image_url} alt={participant.full_name} />
      </Link>
      <Card.Body>
        <Badge bg="light" text="primary" className="participant-card__badge">
          {participant.position}
        </Badge>
        <Card.Title className="participant-card__title">
          <Link to={`/participants/${participant.id}`}>{participant.full_name}</Link>
        </Card.Title>
        <Card.Text className="participant-card__meta">
          Рост {participant.height_cm} см · {participant.sport_rank}
          <br />
          {participant.city}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}
