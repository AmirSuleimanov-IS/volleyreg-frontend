import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

// Навигационная панель со списком базовых страниц
export default function AppNavbar() {
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
