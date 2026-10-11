import { Container } from 'react-bootstrap'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import RequireAuth from './components/RequireAuth'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ParticipantPage from './pages/ParticipantPage'
import ParticipantsPage from './pages/ParticipantsPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import TeamApplicationPage from './pages/TeamApplicationPage'
import TeamApplicationsPage from './pages/TeamApplicationsPage'

function Layout() {
  return (
    <>
      <AppNavbar />
      <Container className="page">
        <Outlet />
      </Container>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          {/* интерфейс гостя */}
          <Route path="/" element={<HomePage />} />
          <Route path="/participants" element={<ParticipantsPage />} />
          <Route path="/participants/:id" element={<ParticipantPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* интерфейс пользователя: представитель команды и организатор */}
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="/team-applications" element={<RequireAuth><TeamApplicationsPage /></RequireAuth>} />
          <Route path="/team-applications/:id" element={<RequireAuth><TeamApplicationPage /></RequireAuth>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
