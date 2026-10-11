import { useState, type FormEvent } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { POSITIONS, type ParticipantsFilter } from '../types'

interface Props {
  value: ParticipantsFilter
  onSearch: (filter: ParticipantsFilter) => void
}

// Фильтры списка участников: ФИО и амплуа
export default function ParticipantsFilterForm({ value, onSearch }: Props) {
  const [participantName, setParticipantName] = useState(value.participantName)
  const [position, setPosition] = useState(value.position)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    onSearch({ participantName, position })
  }

  return (
    <Form className="filter" onSubmit={submit}>
      <Row className="g-2">
        <Col md={6}>
          <Form.Control
            placeholder="Поиск по ФИО участника"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select value={position} onChange={(e) => setPosition(e.target.value)}>
            <option value="">Все амплуа</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button type="submit" className="w-100">
            Найти
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
