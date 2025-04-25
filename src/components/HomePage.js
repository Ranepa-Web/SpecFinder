import { Link } from "react-router-dom"
import MainBanner from "./MainBanner"
import VacancyList from "./VacancyList"

function HomePage() {
  return (
    <div className="home-page">
      <MainBanner />
      <div className="container">
        <section className="popular-section">
          <div className="section-header">
            <h2 className="section-title">Популярные вакансии</h2>
            <Link to="/vacancies" className="view-all-link">
              Смотреть все <span className="arrow">→</span>
            </Link>
          </div>
          <VacancyList limit={3} />
        </section>
      </div>
    </div>
  )
}

export default HomePage
