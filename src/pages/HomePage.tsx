import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'

// Главная страница: о соревновании
export default function HomePage() {
  return (
    <>
      <Breadcrumbs items={[]} />
      <section className="hero">
        <Row className="align-items-center g-4">
          <Col lg={7}>
            <span className="hero__tag">20 ноября 2026 · Норильск</span>
            <h1 className="hero__title">Первенство ЗГУ по волейболу 2026</h1>
            <p className="hero__text">
              Регистрация женских команд на студенческое первенство. Представитель команды выбирает участниц из каталога,
              собирает заявку и отправляет её организатору соревнования. Система рассчитывает средний возраст команды на
              дату соревнования.
            </p>
            <Link to="/participants" className="btn btn-primary btn-lg">
              Смотреть участниц
            </Link>
          </Col>
          <Col lg={5}>
            <img className="hero__image" src={`${import.meta.env.BASE_URL}mock/participant_5.jpg`} alt="Игровой момент" />
          </Col>
        </Row>
      </section>
      <Row className="g-3 steps">
        {[
          ['1', 'Выберите участниц', 'Каталог спортсменок с амплуа, ростом и разрядом'],
          ['2', 'Соберите заявку', 'Укажите команду, тренера и игровые номера'],
          ['3', 'Получите допуск', 'Организатор рассматривает сформированную заявку'],
        ].map(([n, title, text]) => (
          <Col md={4} key={n}>
            <div className="step">
              <span className="step__num">{n}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </Col>
        ))}
      </Row>
    </>
  )
}
