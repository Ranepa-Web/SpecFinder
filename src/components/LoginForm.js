"use client"

// src/components/LoginForm.js
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
// Импортируем SVG как React компоненты
import { ReactComponent as EmailIcon } from "../images/mail.svg"
import { ReactComponent as PasswordIcon } from "../images/password.svg"

export const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate("/")
    } catch (err) {
      console.error("Ошибка входа:", err)
      setError(err.message || "Произошла ошибка при входе.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-form-container login-form">
      <div className="card">
        <div className="card-body">
          <h2 className="auth-title">Вход в аккаунт</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                E-mail <span className="text-primary">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <EmailIcon />
                </span>
                <input
                  type="email"
                  id="login-email"
                  className="form-control"
                  placeholder="Введите ваш e-mail..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">
                Пароль <span className="text-primary">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <PasswordIcon />
                </span>
                <input
                  type="password"
                  id="login-password"
                  className="form-control"
                  placeholder="Введите пароль..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <button type="submit" className="button button_blue_m w-100" disabled={isSubmitting}>
              {isSubmitting ? "Вход..." : "Войти в аккаунт"}
            </button>

            <div className="auth-links">
              Нет аккаунта? <Link to="/register">Регистрация</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
