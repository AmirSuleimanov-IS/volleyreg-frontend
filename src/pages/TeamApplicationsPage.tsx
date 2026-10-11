import { useEffect } from 'react'
import { Alert, Badge, Button, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  fetchTeamApplicationsThunk,
  moderateTeamApplicationThunk,
  setTeamApplicationsFilters,
} from '../store/teamApplicationsSlice'
import { formatDateTime, STATUS_TITLES, STATUS_VARIANTS } from '../utils/status'

const POLLING_MS = 5000

// Список заявок таблицей. Организатор: кнопки допуска/отклонения, фильтр по представителю, short polling
export default function TeamApplicationsPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((s) => s.auth.user)!
  const { items, filters, loading, error } = useAppSelector((s) => s.teamApplications)

  // загрузка при изменении фильтров бэкенда
  useEffect(() => {
    dispatch(fetchTeamApplicationsThunk())
  }, [dispatch, filters.status, filters.formedFrom, filters.formedTo])

  // short polling: организатор видит актуальные статусы без перезагрузки страницы
  useEffect(() => {
    if (!user.is_organizer) return
    const timer = setInterval(() => dispatch(fetchTeamApplicationsThunk({ silent: true })), POLLING_MS)
    return () => clearInterval(timer)
  }, [dispatch, user.is_organizer])

  // фильтр по представителю — на фронтенде
  const creator = filters.creator.trim().toLowerCase()
  const visible = creator ? items.filter((a) => a.creator_login?.toLowerCase().includes(creator)) : items

  return (
    <>
      <Breadcrumbs items={[{ label: 'Заявки' }]} />
      <h1 className="page-title">{user.is_organizer ? 'Заявки команд' : 'Мои заявки'}</h1>

      <Form className="filter">
        <Row className="g-2 align-items-end">
          <Col md={3}>
            <Form.Label htmlFor="status">Статус</Form.Label>
            <Form.Select id="status" value={filters.status} onChange={(e) => dispatch(setTeamApplicationsFilters({ status: e.target.value }))}>
              <option value="">Все</option>
              <option value="formed">Сформирована</option>
              <option value="completed">Допущена</option>
              <option value="rejected">Отклонена</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label htmlFor="formed_from">Дата формирования с</Form.Label>
            <Form.Control id="formed_from" type="date" value={filters.formedFrom} onChange={(e) => dispatch(setTeamApplicationsFilters({ formedFrom: e.target.value }))} />
          </Col>
          <Col md={3}>
            <Form.Label htmlFor="formed_to">по</Form.Label>
            <Form.Control id="formed_to" type="date" value={filters.formedTo} onChange={(e) => dispatch(setTeamApplicationsFilters({ formedTo: e.target.value }))} />
          </Col>
          {user.is_organizer && (
            <Col md={3}>
              <Form.Label htmlFor="creator">Представитель</Form.Label>
              <Form.Control
                id="creator"
                placeholder="логин"
                value={filters.creator}
                onChange={(e) => dispatch(setTeamApplicationsFilters({ creator: e.target.value }))}
              />
            </Col>
          )}
        </Row>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table hover responsive className="apps-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Команда</th>
              <th>Статус</th>
              <th>Сформирована</th>
              <th>Завершена</th>
              {user.is_organizer && <th>Представитель</th>}
              <th>Участниц</th>
              <th>Средний возраст</th>
              {user.is_organizer && <th>Решение</th>}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={user.is_organizer ? 9 : 7} className="text-center text-muted">
                  Заявок нет
                </td>
              </tr>
            )}
            {visible.map((a) => (
              <tr key={a.id} onClick={() => navigate(`/team-applications/${a.id}`)}>
                <td>{a.id}</td>
                <td>{a.team_name ?? '—'}</td>
                <td>
                  <Badge bg={STATUS_VARIANTS[a.status!] ?? 'secondary'}>{STATUS_TITLES[a.status!] ?? a.status}</Badge>
                </td>
                <td>{formatDateTime(a.formed_at)}</td>
                <td>{formatDateTime(a.completed_at)}</td>
                {user.is_organizer && <td>{a.creator_login}</td>}
                <td>{a.participants_count}</td>
                <td>{a.average_age ?? '—'}</td>
                {user.is_organizer && (
                  <td onClick={(e) => e.stopPropagation()}>
                    {a.status === 'formed' ? (
                      <div className="d-flex gap-2">
                        <Button size="sm" variant="success" onClick={() => dispatch(moderateTeamApplicationThunk({ id: a.id!, action: 'complete' }))}>
                          Допустить
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => dispatch(moderateTeamApplicationThunk({ id: a.id!, action: 'reject' }))}>
                          Отклонить
                        </Button>
                      </div>
                    ) : (
                      <span className="text-muted">{a.moderator_login ?? ''}</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}
