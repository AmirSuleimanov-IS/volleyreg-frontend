import { Link } from 'react-router-dom'

export interface Crumb {
  label: string
  to?: string
}

// Самописная навигационная цепочка: путь от главной страницы до текущей
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: 'Главная', to: '/' }, ...items]
  return (
    <nav className="breadcrumbs" aria-label="breadcrumb">
      {all.map((item, i) => {
        const last = i === all.length - 1
        return (
          <span key={i} className="breadcrumbs__item">
            {item.to && !last ? <Link to={item.to}>{item.label}</Link> : <span className="breadcrumbs__current">{item.label}</span>}
            {!last && <span className="breadcrumbs__sep">/</span>}
          </span>
        )
      })}
    </nav>
  )
}
