"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "../css/main.css"

const ReviewsPage = () => {
  const { currentUser } = useAuth()
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: 5, text: "" })
  const [submitted, setSubmitted] = useState(false)

  // Исправляем функцию загрузки отзывов, чтобы использовать актуальные даты
  useEffect(() => {
    // Загрузка отзывов из localStorage
    const savedReviews = localStorage.getItem("reviews")
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews))
    } else {
      // Демо-отзывы, если нет сохраненных
      const demoReviews = [
        {
          id: 1,
          name: "Алексей Петров",
          rating: 5,
          text: "Отличный сервис! Нашел работу мечты за неделю после регистрации.",
          date: "2025-04-22",
          userType: "jobseeker",
        },
        {
          id: 2,
          name: 'ООО "ТехноСтарт"',
          rating: 4,
          text: "Удобная платформа для поиска сотрудников. Интерфейс понятный, много откликов от квалифицированных специалистов.",
          date: "2025-04-15",
          userType: "employer",
        },
        {
          id: 3,
          name: "Мария Иванова",
          rating: 5,
          text: "Благодаря этому сайту я нашла удаленную работу в IT-компании. Очень удобный поиск и фильтрация вакансий.",
          date: "2025-04-08",
          userType: "jobseeker",
        },
      ]
      setReviews(demoReviews)
      localStorage.setItem("reviews", JSON.stringify(demoReviews))
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewReview({
      ...newReview,
      [name]: name === "rating" ? Number.parseInt(value) : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!currentUser) {
      alert("Пожалуйста, войдите в систему, чтобы оставить отзыв.")
      return
    }

    if (!newReview.text.trim()) {
      alert("Пожалуйста, напишите текст отзыва.")
      return
    }

    const review = {
      id: Date.now(),
      name: currentUser.name,
      rating: newReview.rating,
      text: newReview.text,
      date: new Date().toISOString().split("T")[0],
      userType: currentUser.userType || "jobseeker",
    }

    const updatedReviews = [...reviews, review]
    setReviews(updatedReviews)
    localStorage.setItem("reviews", JSON.stringify(updatedReviews))

    setNewReview({ rating: 5, text: "" })
    setSubmitted(true)

    setTimeout(() => {
      setSubmitted(false)
    }, 3000)
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "star filled" : "star"}>
          ★
        </span>,
      )
    }
    return stars
  }

  return (
    <div className="reviews-page">
      <div className="container">
        <h1 className="page-title">Отзывы</h1>

        <div className="reviews-content">
          {currentUser && (
            <div className="review-form-container">
              <h2>Оставить отзыв</h2>

              {submitted ? (
                <div className="success-message">Спасибо за ваш отзыв!</div>
              ) : (
                <form className="review-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Оценка:</label>
                    <div className="rating-input">
                      {[5, 4, 3, 2, 1].map((value) => (
                        <label key={value} className="rating-label">
                          <input
                            type="radio"
                            name="rating"
                            value={value}
                            checked={newReview.rating === value}
                            onChange={handleInputChange}
                          />
                          <span className="star">{value} ★</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="review-text">Ваш отзыв:</label>
                    <textarea
                      id="review-text"
                      name="text"
                      value={newReview.text}
                      onChange={handleInputChange}
                      placeholder="Поделитесь вашим опытом использования нашего сервиса..."
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="button button_blue_m">
                  Отправить отзыв
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="reviews-list">
            <h2>Что говорят наши пользователи</h2>

            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-author">
                      <span className="author-name">{review.name}</span>
                      <span className="author-type">
                        {review.userType === "employer" ? "Работодатель" : "Соискатель"}
                      </span>
                    </div>
                    <div className="review-rating">{renderStars(review.rating)}</div>
                  </div>

                  <div className="review-body">
                    <p>{review.text}</p>
                  </div>

                  <div className="review-footer">
                    <span className="review-date">{review.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-reviews">Пока нет отзывов. Будьте первым!</p>
            )}
          </div>

          {!currentUser && (
            <div className="login-prompt">
              <p>
                Хотите оставить отзыв? <Link to="/login">Войдите</Link> или{" "}
                <Link to="/register">зарегистрируйтесь</Link>.
              </p>
            </div>
          )}

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

export default ReviewsPage
