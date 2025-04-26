import { Link } from "react-router-dom"
import "../css/main.css"

const HowItWorksPage = () => {
  return (
    <div className="how-it-works-page">
      <div className="container">
        <h1 className="page-title">Как это работает</h1>

        <div className="how-it-works-content">
          <div className="process-section">
            <h2>Для соискателей</h2>

            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Регистрация</h3>
                  <p>
                    Создайте аккаунт, указав, что вы ищете работу. Заполните свой профиль, добавьте резюме и укажите
                    свои навыки.
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Поиск вакансий</h3>
                  <p>
                    Используйте удобный поиск для нахождения подходящих вакансий. Фильтруйте результаты по зарплате,
                    местоположению и другим параметрам.
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Отклик на вакансии</h3>
                  <p>Нашли интересную вакансию? Откликнитесь на нее в один клик и ожидайте ответа от работодателя.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Управление откликами</h3>
                  <p>
                    Отслеживайте статус ваших откликов в личном кабинете и общайтесь с потенциальными работодателями.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="process-section">
            <h2>Для работодателей</h2>

            <div className="process-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Регистрация</h3>
                  <p>Создайте аккаунт, указав, что вы работодатель. Заполните информацию о вашей компании.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Размещение вакансий</h3>
                  <p>Создавайте и публикуйте вакансии, указывая все необходимые требования и условия работы.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Просмотр откликов</h3>
                  <p>Получайте отклики от соискателей и просматривайте их резюме и профили.</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Связь с кандидатами</h3>
                  <p>Связывайтесь с подходящими кандидатами напрямую через нашу платформу.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="benefits-section">
            <h2>Преимущества нашей платформы</h2>

            <div className="benefits">
              <div className="benefit">
                <h3>Простота использования</h3>
                <p>Интуитивно понятный интерфейс делает работу с сайтом удобной для всех пользователей.</p>
              </div>

              <div className="benefit">
                <h3>Быстрый поиск</h3>
                <p>Продвинутые алгоритмы поиска помогают находить наиболее подходящие вакансии и кандидатов.</p>
              </div>

              <div className="benefit">
                <h3>Безопасность</h3>
                <p>Мы обеспечиваем безопасность ваших данных и конфиденциальность общения.</p>
              </div>

              <div className="benefit">
                <h3>Бесплатно</h3>
                <p>Основные функции нашей платформы доступны бесплатно для всех пользователей.</p>
              </div>
            </div>
          </div>

          <div className="back-link">
         <Link to="/" className="button button_blue_m"> 
        Вернуться на главную
         </Link>
        </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorksPage
