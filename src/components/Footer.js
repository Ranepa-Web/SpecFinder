import { Link } from "react-router-dom"

function Footer() {
  // Устанавливаем фиксированный год 2025 вместо динамического получения текущего года
  const currentYear = 2025

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h4>SpecFinder</h4>
            <p>Платформа для поиска специалистов</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h5>О сервисе</h5>
              <ul>
                <li>
                  <Link to="/about">О нас</Link>
                </li>
                <li>
                  <Link to="/how-it-works">Как это работает</Link>
                </li>
                <li>
                  <Link to="/reviews">Отзывы</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h5>Поддержка</h5>
              <ul>
                <li>
                  <Link to="/help">Помощь</Link>
                </li>
                <li>
                  <Link to="/contacts">Контакты</Link>
                </li>
                <li>
                  <Link to="/faq">Частые вопросы</Link>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h5>Правовая информация</h5>
              <ul>
                <li>
                  <Link to="/terms">Условия использования</Link>
                </li>
                <li>
                  <Link to="/privacy">Политика конфиденциальности</Link>
                </li>
                <li>
                  <Link to="/cookies">Cookies</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} SpecFinder. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
