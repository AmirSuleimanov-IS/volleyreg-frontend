import { useEffect, useState } from 'react'
import { Col, Row, Spinner } from 'react-bootstrap'
import { getParticipants } from '../api/participants'
import Breadcrumbs from '../components/Breadcrumbs'
import ParticipantCard from '../components/ParticipantCard'
import ParticipantsFilterForm from '../components/ParticipantsFilterForm'
import type { Participant, ParticipantsFilter } from '../types'

// Страница списка участников с фильтрами
export default function ParticipantsPage() {
  const [filter, setFilter] = useState<ParticipantsFilter>({ participantName: '', position: '' })
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getParticipants(filter)
      .then(setParticipants)
      .finally(() => setLoading(false))
  }, [filter])

  return (
    <>
      <Breadcrumbs items={[{ label: 'Участники' }]} />
      <h1 className="page-title">Участницы Первенства ЗГУ по волейболу 2026</h1>
      <ParticipantsFilterForm value={filter} onSearch={setFilter} />

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : participants.length === 0 ? (
        <p className="empty">Участницы не найдены</p>
      ) : (
        <Row xs={1} sm={2} lg={3} className="g-4">
          {participants.map((p) => (
            <Col key={p.id}>
              <ParticipantCard participant={p} />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}
