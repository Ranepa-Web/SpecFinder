"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { fetchData, updateData } from "../server/api"

const ApplicationsList = () => {
  const { currentUser } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, pending, viewed, approved, rejected

  useEffect(() => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    // Загрузка откликов из API
    const loadApplications = async () => {
      try {
        setLoading(true)
        const allApplications = await fetchData("applications")
        let filteredApplications = []

        if (currentUser.userType === "employer") {
          // Для работодателя - отклики на его вакансии
          const userVacancies = await fetchData("vacancies")
          const userVacancyIds = userVacancies
            .filter((vacancy) => vacancy.authorId === currentUser.id)
            .map((vacancy) => vacancy.id)

          filteredApplications = allApplications.filter((app) => userVacancyIds.includes(app.vacancyId))
        } else {
          // Для соискателя - его отклики
          filteredApplications = allApplications.filter((app) => app.userId === currentUser.id)
        }

        setApplications(filteredApplications)
        setLoading(false)
      } catch (err) {
        console.error("Ошибка при загрузке откликов:", err)
        setLoading(false)
      }
    }

    loadApplications()
  }, [currentUser])

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      // Обновление статуса отклика
      const allApplications = await fetchData("applications")
      const applicationToUpdate = allApplications.find((app) => app.id === applicationId)

      if (!applicationToUpdate) {
        throw new Error("Отклик не найден")
      }

      const updatedApplication = {
        ...applicationToUpdate,
        status: newStatus,
      }

      // Обновляем отклик в базе данных
      await updateData("applications", applicationId, updatedApplication)

      // Обновляем состояние
      setApplications(applications.map((app) => (app.id === applicationId ? updatedApplication : app)))
    } catch (error) {
      console.error("Ошибка при обновлении статуса отклика:", error)
      alert("Не удалось обновить статус отклика. Пожалуйста, попробуйте позже.")
    }
  }

  const getFilteredApplications = () => {
    if (filter === "all") {
      return applications
    }
    return applications.filter((app) => app.status === filter)
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "На рассмотрении"
      case "viewed":
        return "Просмотрено"
      case "approved":
        return "Одобрено"
      case "rejected":
        return "Отклонено"
      default:
        return "Неизвестно"
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending"
      case "viewed":
        return "status-viewed"
      case "approved":
        return "status-approved"
      case "rejected":
        return "status-rejected"
      default:
        return ""
    }
  }

  if (loading) {
    return (
      <div className="applications-list loading">
        <div className="container">
          <div className="loading-indicator">Загрузка данных...</div>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="applications-list not-authorized">
        <div className="container">
          <h2>Доступ запрещен</h2>
          <p>Для просмотра откликов необходимо авторизоваться.</p>
          <Link to="/login" className="button button_blue_m">
            Войти
          </Link>
        </div>
      </div>
    )
  }

  const filteredApplications = getFilteredApplications()

  return (
    <div className="applications-list">
      <div className="container">
        <h1 className="page-title">
          {currentUser.userType === "employer" ? "Отклики на ваши вакансии" : "Ваши отклики на вакансии"}
        </h1>

        <div className="filter-controls">
          <span>Фильтр:</span>
          <div className="filter-buttons">
            <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
              Все
            </button>
            <button
              className={`filter-btn ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              На рассмотрении
            </button>
            <button className={`filter-btn ${filter === "viewed" ? "active" : ""}`} onClick={() => setFilter("viewed")}>
              Просмотрено
            </button>
            <button
              className={`filter-btn ${filter === "approved" ? "active" : ""}`}
              onClick={() => setFilter("approved")}
            >
              Одобрено
            </button>
            <button
              className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
              onClick={() => setFilter("rejected")}
            >
              Отклонено
            </button>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="no-applications">
            <p>Нет откликов, соответствующих выбранным критериям.</p>
            {currentUser.userType !== "employer" && (
              <Link to="/vacancies" className="button button_blue_m">
                Найти вакансии
              </Link>
            )}
          </div>
        ) : (
          <div className="applications-grid">
            {filteredApplications.map((application) => (
              <div key={application.id} className="application-card">
                <div className="application-header">
                  <h3 className="application-title">
                    {currentUser.userType === "employer"
                      ? `Отклик от ${application.userName}`
                      : application.vacancyTitle}
                  </h3>
                  <span className={`application-status ${getStatusClass(application.status)}`}>
                    {getStatusLabel(application.status)}
                  </span>
                </div>

                <div className="application-details">
                  {currentUser.userType === "employer" ? (
                    <>
                      <p>
                        <strong>Email:</strong> {application.userEmail}
                      </p>
                      <p>
                        <strong>Телефон:</strong> {application.contactPhone || "Не указан"}
                      </p>
                      <p>
                        <strong>Дата отклика:</strong> {new Date(application.date).toLocaleDateString("ru-RU")}
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Компания:</strong> {application.companyName}
                      </p>
                      <p>
                        <strong>Дата отклика:</strong> {new Date(application.date).toLocaleDateString("ru-RU")}
                      </p>
                    </>
                  )}
                </div>

                <div className="application-message">
                  <h4>Сопроводительное письмо:</h4>
                  <p>{application.coverLetter}</p>
                </div>

                {currentUser.userType === "employer" && application.status === "pending" && (
                  <div className="application-actions">
                    <button
                      className="button button_gray_m"
                      onClick={() => handleStatusChange(application.id, "viewed")}
                    >
                      Отметить как просмотренное
                    </button>
                    <button
                      className="button button_blue_m"
                      onClick={() => handleStatusChange(application.id, "approved")}
                    >
                      Одобрить
                    </button>
                    <button
                      className="button button_white_m"
                      onClick={() => handleStatusChange(application.id, "rejected")}
                    >
                      Отклонить
                    </button>
                  </div>
                )}

                {currentUser.userType === "employer" && application.status === "viewed" && (
                  <div className="application-actions">
                    <button
                      className="button button_blue_m"
                      onClick={() => handleStatusChange(application.id, "approved")}
                    >
                      Одобрить
                    </button>
                    <button
                      className="button button_white_m"
                      onClick={() => handleStatusChange(application.id, "rejected")}
                    >
                      Отклонить
                    </button>
                  </div>
                )}

                {currentUser.userType === "employer" &&
                  (application.status === "approved" || application.status === "rejected") && (
                    <div className="application-actions">
                      <Link to={`/vacancy/${application.vacancyId}`} className="button button_gray_m">
                        Просмотреть вакансию
                      </Link>
                    </div>
                  )}

                {currentUser.userType !== "employer" && (
                  <div className="application-actions">
                    <Link to={`/vacancy/${application.vacancyId}`} className="button button_gray_m">
                      Просмотреть вакансию
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="back-link">
          <Link
            to={currentUser.userType === "employer" ? "/employer-profile" : "/applicant-profile"}
            className="button button_gray_m"
          >
            Вернуться в профиль
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ApplicationsList
