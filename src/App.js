"use client"
import { Navigate, BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useAuth, AuthProvider } from "./context/AuthContext"
import { PROFILE_TYPES } from "./constants"
import React, { useEffect } from "react"
import { initializeDatabase } from "./server/api"
import Header from "./components/Header"
import Footer from "./components/Footer"
import BackToTop from "./components/BackToTop"
import HomePage from "./components/HomePage"
import AboutPage from "./components/AboutPage"
import HowItWorksPage from "./components/HowItWorksPage"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import VacancyList from "./components/VacancyList"
import VacancyDetails from "./components/VacancyDetails"
import CreateVacancyForm from "./components/CreateVacancyForm"
import UserProfile from "./components/UserProfile"
import ApplicationsList from "./components/ApplicationsList"
import Search from "./components/Search"
import ReviewsPage from "./components/ReviewsPage"

// Компонент для защиты маршрутов
const PrivateRoute = ({ children, allowedUserTypes = null }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return <div className="loading-indicator">Проверка аутентификации...</div>
  }

  // Проверка типа пользователя, если указаны разрешенные типы
  if (allowedUserTypes && currentUser && !allowedUserTypes.includes(currentUser.userType)) {
    return <Navigate to="/" replace />
  }

  return currentUser ? children : <Navigate to="/login" replace />
}

// Компонент-обертка с шапкой, основным контентом и футером
const Layout = ({ children }) => {
  return (
    <div className="app-wrapper">
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css"
            integrity="sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7"
            crossOrigin="anonymous"
        />
        <Header/>
        <main className="main-content">{children}</main>
        <Footer/>
        <BackToTop/>
    </div>
  )
}

// Компонент с основной логикой маршрутизации
const AppContent = () => {
  const { loading, currentUser } = useAuth()

  useEffect(() => {
    // Инициализируем базу данных при первой загрузке приложения
    initializeDatabase()
  }, [])

  if (loading) {
    return <div className="loading-indicator">Загрузка приложения...</div>
  }

  // Определяем тип профиля для перенаправления
  const getProfilePath = () => {
    if (!currentUser) return "/"
    return currentUser.userType === PROFILE_TYPES.APPLICANT ? "/applicant-profile" : "/employer-profile"
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/vacancies" element={<VacancyList />} />
      <Route path="/vacancy/:id" element={<VacancyDetails />} />

      {/* Защищенные маршруты */}
      <Route
        path="/create-vacancy"
        element={
          <PrivateRoute allowedUserTypes={[PROFILE_TYPES.EMPLOYER]}>
            <CreateVacancyForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/applicant-profile"
        element={
          <PrivateRoute allowedUserTypes={[PROFILE_TYPES.APPLICANT]}>
            <UserProfile profileType={PROFILE_TYPES.APPLICANT} />
          </PrivateRoute>
        }
      />

      <Route
        path="/employer-profile"
        element={
          <PrivateRoute allowedUserTypes={[PROFILE_TYPES.EMPLOYER]}>
            <UserProfile profileType={PROFILE_TYPES.EMPLOYER} />
          </PrivateRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <PrivateRoute>
            <ApplicationsList />
          </PrivateRoute>
        }
      />

      <Route
        path="/search-specialists"
        element={
          <PrivateRoute allowedUserTypes={[PROFILE_TYPES.EMPLOYER]}>
            <Search />
          </PrivateRoute>
        }
      />

      {/* Перенаправление на профиль */}
      <Route path="/profile" element={<Navigate to={getProfilePath()} replace />} />

      {/* Маршрут для несуществующих страниц */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// Основной компонент приложения
function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <AppContent />
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App
