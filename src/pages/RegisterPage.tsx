import { useState, type FormEvent } from 'react'
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import { registerThunk } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

// Регистрация представителя команды
export default function RegisterPage() {
  const [login, setLogin] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const { loading, error } = useAppSelector((s) => s.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const result = await dispatch(registerThunk({ login, password, full_name: fullName }))
    if (registerThunk.fulfilled.match(result)) {
      navigate('/login', { state: { registered: login } })
    }
  }

  return (
    <>
      <Breadcrumbs items={[{ label: 'Регистрация' }]} />
      <Card className="auth-card">
        <Card.Body>
          <h1 className="page-title">Регистрация</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>ФИО представителя команды</Form.Label>
              <Form.Control value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Логин</Form.Label>
              <Form.Control value={login} onChange={(e) => setLogin(e.target.value)} minLength={3} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пароль (не короче 6 символов)</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
            </Form.Group>
            <Button type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Зарегистрироваться'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}
