"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { createData } from "../server/api"

const CreateVacancyForm = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    company: currentUser?.profile?.companyName || "",
    salary: "",
    location: "",
    remote: false,
    description: "",
    requirements: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [createdVacancyId, setCreatedVacancyId] = useState(null)

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Исправляем функцию создания вакансии
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Валидация формы
      if (!formData.title || !formData.company || !formData.description) {
        throw new Error("Пожалуйста, заполните все обязательные поля")
      }

      // Создаем новую вакансию с актуальной датой
      const newVacancy = {
        id: Date.now(), // Уникальный ID на основе текущего времени
        title: formData.title,
        company: formData.company,
        salary: formData.salary,
        location: formData.location,
        remote: formData.remote,
        description: formData.description,
        requirements: formData.requirements
          .split(",")
          .map((req) => req.trim())
          .filter((req) => req !== ""),
        date: new Date("2025-04-22").toISOString(),
        authorId: currentUser.id,
        applications: [],
      }

      // Сохраняем вакансию через API
      await createData("vacancies", newVacancy)

      // Сохраняем ID созданной вакансии
      setCreatedVacancyId(newVacancy.id)

      // Показываем сообщение об успехе
      setSuccess(true)

      // Очищаем форму
      setFormData({
        title: "",
        company: currentUser?.profile?.companyName || "",
        salary: "",
        location: "",
        remote: false,
        description: "",
        requirements: "",
      })

      // Перенаправляем на страницу вакансий через 2 секунды
      setTimeout(() => {
        navigate("/vacancies")
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-vacancy-container">
      <h1 className="section-title">Создание новой вакансии</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          Вакансия успешно создана! Перенаправление на страницу вакансий...
          {createdVacancyId && (
            <div className="mt-3">
              <button className="button button_blue_m" onClick={() => navigate(`/vacancy/${createdVacancyId}`)}>
                Просмотреть вакансию
              </button>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="title" className="form-label">
                Название вакансии <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                placeholder="Например: Frontend-разработчик"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="company" className="form-label">
                Компания <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="form-control"
                placeholder="Название вашей компании"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group mb-3">
                <label htmlFor="salary" className="form-label">
                  Зарплата
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  className="form-control"
                  placeholder="Например: 120 000 - 150 000 ₽"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="location" className="form-label">
                  Местоположение
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-control"
                  placeholder="Например: Москва"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group mb-3 checkbox-filter">
                <label>
                  <input type="checkbox" name="remote" checked={formData.remote} onChange={handleChange} />
                  Удаленная работа
                </label>
              </div>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="description" className="form-label">
                Описание вакансии <span className="text-primary">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="5"
                placeholder="Подробное описание вакансии, обязанностей и условий работы"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="form-group mb-3">
              <label htmlFor="requirements" className="form-label">
                Требования (через запятую)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                className="form-control"
                rows="3"
                placeholder="Например: React, JavaScript, CSS, HTML5"
                value={formData.requirements}
                onChange={handleChange}
              ></textarea>
              <small className="form-text text-muted">Укажите требуемые навыки и технологии через запятую</small>
            </div>

            <div className="form-actions">
              <button type="submit" className="button button_blue_m" disabled={isSubmitting}>
                {isSubmitting ? "Создание..." : "Создать вакансию"}
              </button>
              <button type="button" className="button button_gray_m" onClick={() => navigate("/vacancies")}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateVacancyForm
