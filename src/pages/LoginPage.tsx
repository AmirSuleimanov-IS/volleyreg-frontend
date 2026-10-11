import { useEffect, useState, type FormEvent } from 'react'
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { clearAuthError, loginThunk } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

// Страница входа: после успешного входа интерфейс гостя переключается на интерфейс пользователя
export default function LoginPage() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const { loading, error } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const registered = (location.state as { registered?: string } | null)?.registered

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const result = await dispatch(loginThunk({ login, password }))
    if (loginThunk.fulfilled.match(result)) {
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? (result.payload.is_organizer ? '/team-applications' : '/participants'))
    }
  }

  return (
    <>
      <Breadcrumbs items={[{ label: 'Вход' }]} />
      <Card className="auth-card">
        <Card.Body>
          <h1 className="page-title">Вход</h1>
          {registered && <Alert variant="success">Пользователь {registered} зарегистрирован, войдите в систему.</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>Логин</Form.Label>
              <Form.Control value={login} onChange={(e) => setLogin(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Войти'}
            </Button>
          </Form>
          <p className="auth-card__hint">
            Нет аккаунта? <Link to="/register">Регистрация</Link>
          </p>
        </Card.Body>
      </Card>
    </>
  )
}
