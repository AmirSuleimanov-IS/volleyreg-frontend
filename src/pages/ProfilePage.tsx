import { useState, type FormEvent } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import Breadcrumbs from '../components/Breadcrumbs'
import { updateProfileThunk } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

// Личный кабинет: смена ФИО и пароля
export default function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user)!
  const dispatch = useAppDispatch()
  const [fullName, setFullName] = useState(user.full_name ?? '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const result = await dispatch(updateProfileThunk({ full_name: fullName, password: password || undefined }))
    if (updateProfileThunk.fulfilled.match(result)) {
      setMessage({ ok: true, text: password ? 'Данные и пароль сохранены' : 'Данные сохранены' })
      setPassword('')
    } else {
      setMessage({ ok: false, text: result.payload as string })
    }
  }

  return (
    <>
      <Breadcrumbs items={[{ label: 'Личный кабинет' }]} />
      <Card className="auth-card">
        <Card.Body>
          <h1 className="page-title">Личный кабинет</h1>
          <p className="text-muted">
            Логин: <b>{user.login}</b> · Роль: <b>{user.is_organizer ? 'организатор соревнования' : 'представитель команды'}</b>
          </p>
          {message && <Alert variant={message.ok ? 'success' : 'danger'}>{message.text}</Alert>}
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>ФИО</Form.Label>
              <Form.Control value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Новый пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="оставьте пустым, чтобы не менять"
                value={password}
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button type="submit">Сохранить</Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}
