import { useEffect, useState } from 'react'
import { Col, Row, Spinner } from 'react-bootstrap'
import { getParticipants } from '../api/participants'
import type { Participant } from '../types'
import { topSimilar } from '../utils/similarity'
import ParticipantCard from './ParticipantCard'

// Похожие участницы: близость эмбеддингов описаний (transformers.js прямо в браузере)
export default function SimilarParticipants({ participant }: { participant: Participant }) {
  const [similar, setSimilar] = useState<Participant[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    getParticipants({ participantName: '', position: '' })
      .then(async ({ data: all }) => {
        // transformers.js загружается отдельным чанком только на странице участника
        const { embed } = await import('../utils/embeddings')
        const vectors = await embed(all.map((p) => p.description))
        const byId = new Map(all.map((p, i) => [p.id, vectors[i]]))
        const ids = topSimilar(participant.id, byId, 3)
        if (!cancelled) {
          setSimilar(ids.map((id) => all.find((p) => p.id === id)!))
          setStatus('ready')
        }
      })
      .catch(() => !cancelled && setStatus('error'))
    return () => {
      cancelled = true
    }
  }, [participant.id])

  return (
    <section className="similar">
      <h2 className="similar__title">Похожие участницы</h2>
      {status === 'loading' && (
        <p className="similar__status">
          <Spinner animation="border" size="sm" /> Загружается AI-модель и считаются эмбеддинги описаний…
        </p>
      )}
      {status === 'error' && <p className="similar__status">Не удалось загрузить модель эмбеддингов.</p>}
      {status === 'ready' && (
        <Row xs={1} sm={2} lg={3} className="g-4">
          {similar.map((p) => (
            <Col key={p.id}>
              <ParticipantCard participant={p} />
            </Col>
          ))}
        </Row>
      )}
    </section>
  )
}
