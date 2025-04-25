import { Link } from "react-router-dom";
import "../css/main.css";


import { TEAM_MEMBERS } from "../constants";

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <h1 className="page-title">О нас</h1>

        <div className="about-content">
          <p className="about-description">
            Наш сайт по поиску работы был создан командой из четырех студентов РАНХиГС, объединенных общей целью -
            сделать процесс поиска работы и найма сотрудников максимально простым и эффективным.
          </p>

          <h2 className="team-title">Наша команда</h2>

          {/* Динамическая генерация карточек команды */}
          <div className="team-members">
            {TEAM_MEMBERS.map((member) => (
              <div className="team-member" key={member.id}>
                <div className="member-photo">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                {/* Если нужно описание, можно добавить: <p>{member.description}</p> */}
              </div>
            ))}
          </div> {/* --- Конец team-members --- */}


          <div className="about-mission">
             {/* ----- ДОБАВЛЯЕМ className="team-title" ----- */}
            <h2 className="team-title">Наша миссия</h2>
            <p>
              Мы стремимся создать платформу, которая соединяет талантливых специалистов с лучшими работодателями, делая
              процесс трудоустройства максимально прозрачным и удобным для всех сторон.
            </p>
          </div>

          <div className="about-contact">
             {/* ----- ДОБАВЛЯЕМ className="team-title" ----- */}
            <h2 className="team-title">Связаться с нами</h2>
            <p>
              Если у вас есть вопросы или предложения, пожалуйста, свяжитесь с нами по адресу:
              <a href="mailto:info@jobsearch.ru"> info@jobsearch.ru</a>
            </p>
          </div>

          <div className="back-link">
          <Link to="/" className="button button_blue_m">
           Вернуться на главную
           </Link>
           </div>
        </div> {/* --- Конец about-content --- */}
      </div> {/* --- Конец container --- */}
    </div> // {/* --- Конец about-page --- */ }
  );
};

export default AboutPage;