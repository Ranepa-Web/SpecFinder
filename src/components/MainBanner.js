import { Link } from "react-router-dom"
import sms from "../images/sms_1.png" // Импортируем изображение чата

const MainBanner = () => {
  return (
    <div className="main_banner_background" style={{ backgroundImage: `url('/images/back_1.png')` }}>
      <div className="container">
        <div className="banner_content">
          <div className="banner_text">
            <h1>
              Найдите
              <br />
              специалиста
              <br />
              <span className="text_fifty">для любой задачи</span>
            </h1>
            <p className="banner_p">
              Быстрый и бесплатный поиск дистанционных специалистов. Обращайтесь к профи · 900 видов услуг. На рынке с
              2014 года. Работают очно и онлайн. Более 8 млн отзывов. 3 млн специалистов. Уже 15 млн клиентов.
            </p>
            <Link to="/search-specialists" className="button button_blue_m">
              К поиску
            </Link>
            <Link to="/about" className="button button_white_m">
              Узнать подробнее
            </Link>
          </div>
          <div className="banner_image">
            <img className="chat-bubbles" src={sms || "/placeholder.svg"} alt="Пример переписки с исполнителем" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainBanner
