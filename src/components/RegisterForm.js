"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { ReactComponent as EmailIcon } from "../images/mail.svg"
import { ReactComponent as PasswordIcon } from "../images/password.svg"
import { ReactComponent as UserIcon } from "../images/user.svg"

const RegisterForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [userType, setUserType] = useState("jobseeker") // 'jobseeker' или 'employer'
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      setLoading(false)
      return
    }

    try {
      // Создаем профиль с правильной структурой в зависимости от типа пользователя
      const profileData =
        userType === "jobseeker"
          ? {
              position: "",
              skills: [],
              experience: "",
              education: "",
              about: "",
              contacts: {
                phone: "",
                telegram: "",
                linkedin: "",
              },
              resume: null,
              appliedJobs: [],
            }
          : {
              companyName: name,
              industry: "",
              companySize: "",
              description: "",
              website: "",
              contacts: {
                phone: "",
                email: email,
                address: "",
              },
              postedJobs: [],
            }

      await register(email, password, name, userType, profileData)
      navigate("/profile")
    } catch (err) {
      setError(err.message || "Ошибка при регистрации")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container register-form">
        <h2 className="auth-title">Регистрация</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Имя</label>
            <div className="input-group">
              <span className="input-group-text">
                <UserIcon />
              </span>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-control"
                placeholder="Введите ваше имя"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-group">
              <span className="input-group-text">
                <EmailIcon />
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
                placeholder="Введите email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <div className="input-group">
              <span className="input-group-text">
                <PasswordIcon />
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
                placeholder="Введите пароль"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <div className="input-group">
              <span className="input-group-text">
                <PasswordIcon />
              </span>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-control"
                placeholder="Подтвердите пароль"
              />
            </div>
          </div>

          <div className="form-group user-type-selection">
            <label>Вы:</label>
            <div className="user-type-options">
              <label className={`user-type-option ${userType === "jobseeker" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="userType"
                  value="jobseeker"
                  checked={userType === "jobseeker"}
                  onChange={() => setUserType("jobseeker")}
                />
                <span className="radio-custom"></span>
                <span className="option-label">Ищу работу</span>
              </label>
              <label className={`user-type-option ${userType === "employer" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="userType"
                  value="employer"
                  checked={userType === "employer"}
                  onChange={() => setUserType("employer")}
                />
                <span className="radio-custom"></span>
                <span className="option-label">Хочу нанять</span>
              </label>
            </div>
          </div>

          <button type="submit" className="button button_blue_m w-100" disabled={loading}>
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
        <div className="auth-links">
          <p>
            Уже есть аккаунт?{" "}
            <Link to="/login" className="auth-link">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
