"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { fetchData, updateData, createData } from "../server/api"
import PhoneInput from "./inputs/PhoneInput";

const VacancyDetails = () => {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [vacancy, setVacancy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [application, setApplication] = useState({
    coverLetter: "",
    contactPhone: currentUser?.profile?.contacts?.phone || "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [similarVacancies, setSimilarVacancies] = useState([])

  useEffect(() => {
    const loadVacancy = async () => {
      try {
        setLoading(true)
        // Загрузка вакансии из API
        const vacancies = await fetchData("vacancies")
        const foundVacancy = vacancies.find((v) => v.id === Number.parseInt(id))

        if (foundVacancy) {
          setVacancy(foundVacancy)

          // Загрузка похожих вакансий
          const similar = vacancies
            .filter(
              (v) =>
                v.id !== foundVacancy.id &&
                (v.requirements?.some((req) => foundVacancy.requirements?.includes(req)) ||
                  v.company === foundVacancy.company),
            )
            .slice(0, 3)

          setSimilarVacancies(similar)
        } else {
          setError("Вакансия не найдена")
        }

        // Проверка, откликался ли уже пользователь на эту вакансию
        if (currentUser) {
          const applications = await fetchData("applications")
          const userApplication = applications.find(
            (app) => app.vacancyId === Number.parseInt(id) && app.userId === currentUser.id,
          )

          if (userApplication || (currentUser.profile?.appliedJobs || []).includes(Number.parseInt(id))) {
            setAlreadyApplied(true)
          }
        }

        setLoading(false)
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err)
        setError("Ошибка при загрузке данных")
        setLoading(false)
      }
    }

    loadVacancy()
  }, [id, currentUser])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setApplication({
      ...application,
      [name]: value,
    })
  }

  // Исправляем функцию отклика на вакансию
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentUser) {
      alert("Пожалуйста, войдите в систему, чтобы откликнуться на вакансию")
      navigate("/login")
      return
    }

    if (currentUser.userType === "employer") {
      alert("Работодатели не могут откликаться на вакансии")
      return
    }

    try {
      // Создание нового отклика с актуальной датой
      const newApplication = {
        id: Date.now(),
        vacancyId: Number.parseInt(id),
        vacancyTitle: vacancy.title,
        companyName: vacancy.company,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        coverLetter: application.coverLetter,
        contactPhone: application.contactPhone,
        status: "pending", // pending, viewed, rejected, approved
        date: new Date("2025-04-22").toISOString(),
      }

      // Сохранение отклика через API
      await createData("applications", newApplication)

      // Обновление профиля пользователя
      const users = await fetchData("users")
      const currentUserData = users.find((user) => user.id === currentUser.id)

      if (currentUserData) {
        const updatedUser = {
          ...currentUserData,
          profile: {
            ...currentUserData.profile,
            appliedJobs: [...(currentUserData.profile.appliedJobs || []), Number.parseInt(id)],
          },
        }

        await updateData("users", updatedUser.id, updatedUser)

        // Обновляем текущего пользователя в localStorage
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }

      setSubmitted(true)
      setAlreadyApplied(true)

      // Обновление счетчика откликов в вакансии
      const updatedVacancy = {
        ...vacancy,
        applications: [...(vacancy.applications || []), newApplication.id],
      }

      await updateData("vacancies", updatedVacancy.id, updatedVacancy)

      // Показываем сообщение об успехе
      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    } catch (err) {
      console.error("Ошибка при отклике на вакансию:", err)
      setError("Ошибка при отклике на вакансию. Пожалуйста, попробуйте позже.")
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("ru-RU", options)
  }

  if (loading) {
    return (
      <div className="vacancy-details loading">
        <div className="container">
          <div className="loading-indicator">Загрузка данных...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="vacancy-details error">
        <div className="container">
          <h2>Ошибка</h2>
          <p>{error}</p>
          <Link to="/vacancies" className="button button_blue_m">
            Вернуться к списку вакансий
          </Link>
        </div>
      </div>
    )
  }

  if (!vacancy) {
    return (
      <div className="vacancy-details not-found">
        <div className="container">
          <h2>Вакансия не найдена</h2>
          <p>Запрашиваемая вакансия не существует или была удалена.</p>
          <Link to="/vacancies" className="button button_blue_m">
            Вернуться к списку вакансий
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="vacancy-details">
      <div className="container">
        <div className="vacancy-header">
          <h1>{vacancy.title}</h1>
          <div className="vacancy-meta">
            <span className="company">{vacancy.company}</span>
            <span className="location">{vacancy.location}</span>
            {vacancy.remote && <span className="remote-badge">Удаленная работа</span>}
          </div>
          <div className="vacancy-salary">{vacancy.salary ? `${vacancy.salary} ₽` : "Зарплата не указана"}</div>
        </div>

        <div className="vacancy-body">
          <div className="vacancy-section">
            <h2>Описание вакансии</h2>
            <p>{vacancy.description}</p>
          </div>

          {vacancy.requirements && vacancy.requirements.length > 0 && (
            <div className="vacancy-section">
              <h2>Требования</h2>
              <div className="requirements-tags">
                {vacancy.requirements.map((req, index) => (
                  <span key={index} className="requirement-tag">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="vacancy-section">
            <h2>Дата публикации</h2>
            <p>{formatDate(vacancy.date)}</p>
          </div>

          {currentUser && currentUser.userType === "jobseeker" && !alreadyApplied && (
            <div className="application-form-container">
              <h2>Откликнуться на вакансию</h2>

              {submitted ? (
                <div className="success-message">
                  <p>Ваш отклик успешно отправлен!</p>
                  <p>Работодатель свяжется с вами, если ваша кандидатура будет интересна.</p>
                </div>
              ) : (
                <form className="application-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="coverLetter">Сопроводительное письмо:</label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      className="form-control"
                      value={application.coverLetter}
                      onChange={handleInputChange}
                      placeholder="Расскажите, почему вы подходите на эту должность..."
                      rows="5"
                      required
                    ></textarea>
                  </div>

                  <PhoneInput
                      name="contactPhone"
                      phone={application.contactPhone}
                      onChange={handleInputChange}
                  />

                  <button type="submit" className="button button_blue_m">
                    Отправить отклик
                  </button>
                </form>
              )}
            </div>
          )}

          {currentUser && currentUser.userType === "jobseeker" && alreadyApplied && (
            <div className="already-applied-message success-message">
              <p>Вы уже откликнулись на эту вакансию.</p>
              <Link to="/applicant-profile" className="button button_gray_m">
                Перейти в профиль для просмотра статуса
              </Link>
            </div>
          )}

          {currentUser && currentUser.userType === "employer" && currentUser.id === vacancy.authorId && (
            <div className="employer-controls">
              <h2>Управление вакансией</h2>
              <div className="button-group">
                <Link to={`/vacancies/edit/${vacancy.id}`} className="button button_gray_m">
                  Редактировать вакансию
                </Link>
                <Link to="/applications" className="button button_blue_m">
                  Просмотреть отклики
                </Link>
              </div>
            </div>
          )}

          {!currentUser && (
            <div className="login-prompt">
              <p>
                Чтобы откликнуться на вакансию, необходимо <Link to="/login">войти</Link> или{" "}
                <Link to="/register">зарегистрироваться</Link>.
              </p>
            </div>
          )}
        </div>

        {similarVacancies.length > 0 && (
          <div className="similar-vacancies">
            <h2>Похожие вакансии</h2>
            <div className="vacancies-list">
              {similarVacancies.map((vacancy) => (
                <div key={vacancy.id} className="vacancy-card">
                  <div className="vacancy-header">
                    <h3 className="vacancy-title">{vacancy.title}</h3>
                    <div className="vacancy-salary">
                      {vacancy.salary ? `${vacancy.salary} ₽` : "Зарплата не указана"}
                    </div>
                  </div>
                  <div className="vacancy-company">{vacancy.company}</div>
                  <div className="vacancy-description">
                    {vacancy.description.length > 100
                      ? `${vacancy.description.substring(0, 100)}...`
                      : vacancy.description}
                  </div>
                  <div className="vacancy-footer">
                    <Link to={`/vacancy/${vacancy.id}`} className="button button_blue_m">
                      Подробнее
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="vacancy-footer">
          <Link to="/vacancies" className="button button_gray_m">
            Вернуться к списку вакансий
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VacancyDetails
