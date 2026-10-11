import { useEffect } from 'react'
import { Alert, Col, Row, Spinner } from 'react-bootstrap'
import Breadcrumbs from '../components/Breadcrumbs'
import DraftButton from '../components/DraftButton'
import MockBanner from '../components/MockBanner'
import ParticipantCard from '../components/ParticipantCard'
import ParticipantsFilterForm from '../components/ParticipantsFilterForm'
import { addToDraftThunk, fetchDraftThunk } from '../store/draftSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchParticipantsThunk, setParticipantsFilter } from '../store/participantsSlice'

// Страница списка участников с фильтрами; после входа — кнопки «Добавить» и иконка заявки
export default function ParticipantsPage() {
  const dispatch = useAppDispatch()
  // фильтр и список — в Redux: фильтр переживает переход на другие страницы
  const { filter, items: participants, loading, isMock } = useAppSelector((s) => s.participants)
  const user = useAppSelector((s) => s.auth.user)
  const { addingId, error } = useAppSelector((s) => s.draft)

  // загрузка списка через thunk при открытии страницы и при изменении фильтра
  useEffect(() => {
    dispatch(fetchParticipantsThunk())
  }, [filter, dispatch])

  // иконка заявки: id черновика и количество участниц
  useEffect(() => {
    if (user) dispatch(fetchDraftThunk())
  }, [user, dispatch])

  return (
    <>
      <Breadcrumbs items={[{ label: 'Участники' }]} />
      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
        <h1 className="page-title">Участницы Первенства ЗГУ по волейболу 2026</h1>
        {user && <DraftButton />}
      </div>
      <MockBanner show={isMock} />
      {error && <Alert variant="danger">{error}</Alert>}
      <ParticipantsFilterForm value={filter} onSearch={(f) => dispatch(setParticipantsFilter(f))} />

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
              <ParticipantCard
                participant={p}
                onAdd={user && !isMock ? (id) => dispatch(addToDraftThunk(id)) : undefined}
                adding={addingId === p.id}
              />
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}
