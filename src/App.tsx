import { Container } from 'react-bootstrap'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import HomePage from './pages/HomePage'
import ParticipantPage from './pages/ParticipantPage'
import ParticipantsPage from './pages/ParticipantsPage'

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
          <Route path="/" element={<HomePage />} />
          <Route path="/participants" element={<ParticipantsPage />} />
          <Route path="/participants/:id" element={<ParticipantPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
