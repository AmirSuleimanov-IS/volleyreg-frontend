import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { logoutThunk } from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'

// в нативном приложении Tauri только интерфейс гостя (без входа и редактирования)
const GUEST_ONLY = import.meta.env.VITE_GUEST_ONLY === 'true'

// Навигационная панель: меню гостя или пользователя, переключение по кнопке Вход / Выход
export default function AppNavbar() {
  const user = useAppSelector((s) => s.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const logout = async () => {
    await dispatch(logoutThunk())
    navigate('/participants')
  }

  return (
    <Navbar expand="md" variant="dark" className="app-navbar">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          🏐 VolleyReg
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Главная
            </Nav.Link>
            <Nav.Link as={NavLink} to="/participants">
              Участники
            </Nav.Link>
            {user && (
              <Nav.Link as={NavLink} to="/team-applications">
                {user.is_organizer ? 'Заявки команд' : 'Мои заявки'}
              </Nav.Link>
            )}
          </Nav>
          <Nav className="align-items-md-center gap-2">
            {GUEST_ONLY ? null : user ? (
              <>
                <Nav.Link as={NavLink} to="/profile" className="navbar-user">
                  {user.is_organizer ? '🛡 ' : '👤 '}
                  {user.full_name || user.login}
                </Nav.Link>
                <Button variant="outline-light" size="sm" onClick={logout}>
                  Выход
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/register">
                  Регистрация
                </Nav.Link>
                <Button variant="light" size="sm" onClick={() => navigate('/login')}>
                  Вход
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
