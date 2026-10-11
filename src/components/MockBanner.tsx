import { Alert } from 'react-bootstrap'

// Предупреждение: бэкенд недоступен, показаны демо-данные из mock
export default function MockBanner({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <Alert variant="warning" className="py-2">
      Нет связи с сервером — показаны демонстрационные данные.
    </Alert>
  )
}
