import { Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

// Кнопка «корзины»: черновик есть — ведёт на страницу заявки по id; нет — другой стиль и недоступна
export default function DraftButton() {
  const { draftId, count } = useAppSelector((s) => s.draft)
  if (!draftId) {
    return (
      <span className="draft-button draft-button--disabled" title="Добавьте участницу, чтобы создать заявку">
        Заявка команды <Badge bg="secondary">0</Badge>
      </span>
    )
  }
  return (
    <Link to={`/team-applications/${draftId}`} className="draft-button">
      Заявка команды <Badge bg="danger">{count}</Badge>
    </Link>
  )
}
