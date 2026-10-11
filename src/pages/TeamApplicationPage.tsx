import { useEffect, useState, type FormEvent } from 'react'
import { Alert, Badge, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import ParticipantImage from '../components/ParticipantImage'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  deleteTeamApplicationThunk,
  fetchTeamApplicationThunk,
  formTeamApplicationThunk,
  removeParticipantThunk,
  updateJerseyNumberThunk,
  updateTeamApplicationThunk,
} from '../store/teamApplicationSlice'
import { formatDate, formatDateTime, STATUS_TITLES, STATUS_VARIANTS } from '../utils/status'

// Страница заявки команды: черновик можно редактировать, остальные статусы — только просмотр
export default function TeamApplicationPage() {
  const id = Number(useParams().id)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)
  const { app, loading, saving, error } = useAppSelector((s) => s.teamApplication)

  const [fields, setFields] = useState({ team_name: '', institution: '', coach_name: '', competition_date: '' })
  const [numbers, setNumbers] = useState<Record<number, string>>({})

  useEffect(() => {
    dispatch(fetchTeamApplicationThunk(id))
  }, [id, dispatch])

  // заполнить форму значениями из загруженной заявки
  useEffect(() => {
    if (!app) return
    setFields({
      team_name: app.team_name ?? '',
      institution: app.institution ?? '',
      coach_name: app.coach_name ?? '',
      competition_date: app.competition_date ?? '',
    })
    setNumbers(Object.fromEntries((app.participants ?? []).map((p) => [p.id!, p.jersey_number?.toString() ?? ''])))
  }, [app])

  if (loading || (!app && !error)) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    )
  }
  if (!app) {
    return (
      <>
        <Breadcrumbs items={[{ label: 'Заявки', to: '/team-applications' }, { label: `№${id}` }]} />
        <Alert variant="danger">{error}</Alert>
      </>
    )
  }

  const editable = app.status === 'draft' && app.creator_login === user?.login

  const saveFields = (e: FormEvent) => {
    e.preventDefault()
    dispatch(updateTeamApplicationThunk({ id, body: fields }))
  }
  const form = () => dispatch(formTeamApplicationThunk(id))
  const remove = async () => {
    const result = await dispatch(deleteTeamApplicationThunk(id))
    if (deleteTeamApplicationThunk.fulfilled.match(result)) navigate('/participants')
  }

  return (
    <>
      <Breadcrumbs items={[{ label: 'Заявки', to: '/team-applications' }, { label: `Заявка №${app.id}` }]} />
      <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
        <h1 className="page-title mb-0">Заявка команды №{app.id}</h1>
        <Badge bg={STATUS_VARIANTS[app.status!] ?? 'secondary'} className="status-badge">
          {STATUS_TITLES[app.status!] ?? app.status}
        </Badge>
        {saving && <Spinner animation="border" size="sm" variant="primary" />}
      </div>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        <Col lg={8}>
          <Card className="app-card">
            <Card.Body>
              <Form onSubmit={saveFields}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="team_name">
                      <Form.Label>Название команды</Form.Label>
                      <Form.Control value={fields.team_name} disabled={!editable} onChange={(e) => setFields({ ...fields, team_name: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="competition_date">
                      <Form.Label>Дата соревнования</Form.Label>
                      <Form.Control type="date" value={fields.competition_date} disabled={!editable} onChange={(e) => setFields({ ...fields, competition_date: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="institution">
                      <Form.Label>Учебное заведение</Form.Label>
                      <Form.Control value={fields.institution} disabled={!editable} onChange={(e) => setFields({ ...fields, institution: e.target.value })} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="coach_name">
                      <Form.Label>Тренер</Form.Label>
                      <Form.Control value={fields.coach_name} disabled={!editable} onChange={(e) => setFields({ ...fields, coach_name: e.target.value })} />
                    </Form.Group>
                  </Col>
                </Row>
                {editable && (
                  <div className="app-actions">
                    <Button type="submit" variant="outline-primary" disabled={saving}>
                      Сохранить поля
                    </Button>
                    <Button onClick={form} disabled={saving}>
                      Сформировать заявку
                    </Button>
                    <Button variant="danger" onClick={remove} disabled={saving}>
                      Удалить заявку
                    </Button>
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="app-result">
            <Card.Body>
              <div className="app-result__label">Средний возраст команды, лет</div>
              <div className="app-result__value">{app.average_age ?? '—'}</div>
              <dl className="app-result__dates">
                <dt>Представитель</dt>
                <dd>{app.creator_login}</dd>
                <dt>Создана</dt>
                <dd>{formatDateTime(app.created_at)}</dd>
                <dt>Сформирована</dt>
                <dd>{formatDateTime(app.formed_at)}</dd>
                <dt>Завершена</dt>
                <dd>{formatDateTime(app.completed_at)}</dd>
                {app.moderator_login && (
                  <>
                    <dt>Организатор</dt>
                    <dd>{app.moderator_login}</dd>
                  </>
                )}
              </dl>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="section-title">Состав команды ({app.participants?.length ?? 0})</h2>
      {(app.participants ?? []).length === 0 && <p className="empty">В заявке нет участниц. Добавьте их на странице участников.</p>}
      <div className="roster">
        {(app.participants ?? []).map((p) => (
          <Card key={p.id} className="roster-row">
            <Card.Body className="d-flex align-items-center gap-3 flex-wrap">
              <ParticipantImage className="roster-row__image" src={p.image_url ?? null} alt={p.full_name} />
              <div className="roster-row__info">
                <Link to={`/participants/${p.id}`} className="roster-row__name">
                  {p.full_name}
                </Link>
                <span>{p.position}</span>
                <span>{p.height_cm} см</span>
                <span>{p.sport_rank}</span>
                <span>{formatDate(p.birth_date)}</span>
              </div>
              <div className="roster-row__number">
                <Form.Label className="mb-1">Игровой номер</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  max={99}
                  value={numbers[p.id!] ?? ''}
                  disabled={!editable}
                  onChange={(e) => setNumbers({ ...numbers, [p.id!]: e.target.value })}
                />
              </div>
              {editable && (
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    disabled={saving || numbers[p.id!] === ''}
                    onClick={() => dispatch(updateJerseyNumberThunk({ id, participantId: p.id!, jerseyNumber: Number(numbers[p.id!]) }))}
                  >
                    Сохранить номер
                  </Button>
                  <Button size="sm" variant="outline-danger" disabled={saving} onClick={() => dispatch(removeParticipantThunk({ id, participantId: p.id! }))}>
                    Убрать
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  )
}
