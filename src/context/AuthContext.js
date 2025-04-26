"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { fetchData, updateData, createData } from "../server/api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Проверяем, есть ли сохраненный пользователь в localStorage
    const user = localStorage.getItem("currentUser")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setLoading(false)
  }, [])

  // Функция для регистрации пользователя
  const register = async (email, password, name, userType) => {
    try {
      // Получаем всех пользователей
      const users = await fetchData("users")

      // Проверяем, существует ли уже пользователь с таким email
      const existingUser = users.find((user) => user.email === email)

      if (existingUser) {
        throw new Error("Пользователь с таким email уже существует")
      }

      // Создаем нового пользователя
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        userType,
        password, // В реальном приложении пароль должен быть захеширован
        profile:
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
              },
      }

      // Сохраняем пользователя в "базе данных"
      await createData("users", newUser)

      // Устанавливаем текущего пользователя
      setCurrentUser(newUser)
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      return newUser
    } catch (error) {
      console.error("Ошибка при регистрации:", error)
      throw error
    }
  }

  // Функция для входа пользователя
  const login = async (email, password) => {
    try {
      // Получаем всех пользователей
      const users = await fetchData("users")

      // Ищем пользователя с указанными email и паролем
      const user = users.find((user) => user.email === email && user.password === password)

      if (!user) {
        throw new Error("Неверный email или пароль")
      }

      // Устанавливаем текущего пользователя
      setCurrentUser(user)
      localStorage.setItem("currentUser", JSON.stringify(user))

      return user
    } catch (error) {
      console.error("Ошибка при входе:", error)
      throw error
    }
  }

  // Функция для выхода пользователя
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
  }

  // Функция для обновления профиля пользователя
  const updateProfile = async (profileData) => {
    try {
      // Обновляем данные текущего пользователя
      const updatedUser = {
        ...currentUser,
        ...profileData,
      }

      // Обновляем пользователя в "базе данных"
      await updateData("users", updatedUser.id, updatedUser)

      // Обновляем текущего пользователя
      setCurrentUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      return updatedUser
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error)
      throw error
    }
  }

  // Исправляем функцию создания отклика на вакансию
  const applyForJob = async (jobId) => {
    try {
      if (currentUser.userType !== "jobseeker") {
        throw new Error("Только соискатели могут откликаться на вакансии")
      }

      // Проверяем, не откликался ли пользователь уже на эту вакансию
      if (currentUser.profile.appliedJobs && currentUser.profile.appliedJobs.includes(jobId)) {
        throw new Error("Вы уже откликнулись на эту вакансию")
      }

      // Получаем вакансию
      const vacancies = await fetchData("vacancies")
      const vacancy = vacancies.find((v) => v.id === jobId)

      if (!vacancy) {
        throw new Error("Вакансия не найдена")
      }

      // Добавляем вакансию в список откликов пользователя
      const updatedUser = {
        ...currentUser,
        profile: {
          ...currentUser.profile,
          appliedJobs: [...(currentUser.profile.appliedJobs || []), jobId],
        },
      }

      // Обновляем данные пользователя
      await updateData("users", updatedUser.id, updatedUser)

      // Обновляем текущего пользователя
      setCurrentUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Создаем отклик с актуальной датой
      const newApplication = {
        id: Date.now(),
        vacancyId: jobId,
        vacancyTitle: vacancy.title,
        companyName: vacancy.company,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        date: new Date("2025-04-22").toISOString(),
        status: "pending",
        coverLetter: "Здравствуйте! Я заинтересован в данной вакансии и хотел бы предложить свою кандидатуру.",
        contactPhone: currentUser.profile.contacts?.phone || "",
      }

      // Сохраняем отклик
      await createData("applications", newApplication)

      // Обновляем вакансию, добавляя отклик
      const updatedVacancy = {
        ...vacancy,
        applications: [...(vacancy.applications || []), newApplication.id],
      }

      await updateData("vacancies", updatedVacancy.id, updatedVacancy)

      return updatedUser
    } catch (error) {
      console.error("Ошибка при отклике на вакансию:", error)
      throw error
    }
  }

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateProfile,
    applyForJob,
    isAuthenticated: !!currentUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
