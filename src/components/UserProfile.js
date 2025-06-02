"use client"

import React, {useState, useEffect} from "react"
import {Link, useLocation} from "react-router-dom"
import {useAuth} from "../context/AuthContext"
import {PROFILE_TYPES} from "../constants"
import PhoneInput from "./inputs/PhoneInput"
import "../css/inputs/phone_input.css"
import {isValidPhoneNumber} from "libphonenumber-js"
import SkillsInput from "./forms/SkillsInput"
import WorkExperienceSection from "./sections/WorkExperienceSection"
import "../css/popup.css"

// Компонент для профиля соискателя
function ApplicantProfile() {
    const {currentUser} = useAuth()
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const routerLocation = useLocation()
    const params = new URLSearchParams(routerLocation.search)
    const initialTab = params.get("tab") === "applications" ? "applications" : "profile"
    const itemRefs = {};
    const [activeTab, setActiveTab] = useState(initialTab)
    const [profileData, setProfileData] = useState({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        phone: "",
        city: "",
        position: "",
        experience: "",
        skills: [],
        about: "",
        workExperiences: []
    })
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [validationErrors, setValidationErrors] = useState({})

    useEffect(() => {
        const vacancyId = parseInt(params.get("vacancyId"))
        if (vacancyId && itemRefs[vacancyId]) {
            scrollTo(vacancyId)

        }
    }, [itemRefs])

    useEffect(() => {
        setLoading(true)
        try {
            const storedApplications = JSON.parse(localStorage.getItem(`db_applications`)) || []
            const userApplications = storedApplications.filter((app) => app.userId === currentUser.id)
            setApplications(userApplications)

            const users = JSON.parse(localStorage.getItem(`db_users`)) || []
            const user = users.find((u) => u.id === currentUser.id)
            if (user) {
                setProfileData({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.profile?.contacts?.phone || "",
                    city: user.profile?.city || "",
                    position: user.profile?.position || "",
                    experience: user.profile?.experience || "",
                    skills: user.profile?.skills || [],
                    about: user.profile?.about || "",
                    workExperiences: user.profile?.workExperiences || []
                })
            }
        } catch (error) {
            console.error("Ошибка при загрузке данных профиля:", error)
        } finally {
            setLoading(false)
        }
    }, [currentUser.id])

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setProfileData({
            ...profileData, [name]: value,
        })
    }

    const scrollTo = (id) => {
        const element = itemRefs[id];
        if (element) {
            const headerHeight = 80; // Замените на реальную высоту вашего header'а
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerHeight;

            window.scrollTo({
                top: offsetPosition
            });
        }
    }

    const handleWorkExperienceChange = (workExperiences) => {
        setProfileData({
            ...profileData, workExperiences
        })
    }

    const handleSaveProfile = () => {
        try {
            const errors = {}
            if (profileData.phone && !isValidPhoneNumber(profileData.phone)) {
                errors.phone = 'Неверный формат номера телефона'
            } else {
                validationErrors.phone = null
            }

            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors)
                setErrorMessage("Данные невалидны - проверьте выделенные поля")
                setTimeout(() => {
                    setErrorMessage("")
                }, 3200)
                return
            }

            const users = JSON.parse(localStorage.getItem(`db_users`)) || []
            const updatedUsers = users.map((user) => {
                if (user.id === currentUser.id) {
                    return {
                        ...user, name: profileData.name, profile: {
                            ...user.profile,
                            city: profileData.city,
                            position: profileData.position,
                            experience: profileData.experience,
                            skills: profileData.skills,
                            about: profileData.about,
                            workExperiences: profileData.workExperiences,
                            contacts: {
                                ...user.profile.contacts, phone: profileData.phone,
                            },
                        },
                    }
                }
                return user
            })

            localStorage.setItem(`db_users`, JSON.stringify(updatedUsers))
            const updatedCurrentUser = updatedUsers.find((user) => user.id === currentUser.id)
            localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser))
            setSuccessMessage("Профиль успешно обновлен")
            setTimeout(() => {
                setSuccessMessage("")
            }, 1200)
        } catch (error) {
            console.error("Ошибка при сохранении профиля:", error)
        }
    }

    if (loading) {
        return (<div className="container">
                <div className="loading-indicator">Загрузка профиля...</div>
            </div>)
    }

    return (<div className="profile-tabs">
            <div className="tabs-header">
                <button
                    className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                >
                    Мой профиль
                </button>
                <button
                    className={`tab-button ${activeTab === "applications" ? "active" : ""}`}
                    onClick={() => setActiveTab("applications")}
                >
                    Мои отклики
                </button>
            </div>

            <div className="tab-content">
                {activeTab === "profile" && (<div className="profile-info">
                        <div className="profile-header">
                            <div className="profile-avatar-container">
                                <div className="profile-avatar">{profileData.name.charAt(0).toUpperCase()}</div>
                            </div>
                            <div className="profile-details">
                                <h3 className="profile-name">{profileData.name}</h3>
                                <p className="profile-email">{profileData.email}</p>
                                <p className="profile-type">Соискатель</p>
                            </div>
                        </div>

                        {successMessage && (<div className="success-popup">
                                {successMessage}
                            </div>)}

                        {errorMessage && (<div className="error-popup">
                            {errorMessage}
                        </div>)}

                        <div className="profile-section">
                            <h4 className="profile-section-title">Личная информация</h4>
                            <div className="profile-form">
                                <div className="form-group">
                                    <label htmlFor="name">Имя</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-control"
                                        value={profileData.email}
                                        readOnly
                                    />
                                </div>
                                <PhoneInput
                                    name="phone"
                                    phone={profileData.phone}
                                    onChange={handleInputChange}
                                    error={validationErrors.phone}
                                />
                                <div className="form-group">
                                    <label htmlFor="city">Город</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        className="form-control"
                                        placeholder="Укажите город проживания"
                                        value={profileData.city}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <WorkExperienceSection
                            workExperiences={profileData.workExperiences}
                            onChange={handleWorkExperienceChange}
                        />

                        <div className="profile-section">
                            <h4 className="profile-section-title">Профессиональная информация</h4>
                            <div className="profile-form">
                                <div className="form-group">
                                    <label htmlFor="position">Должность</label>
                                    <input
                                        type="text"
                                        id="position"
                                        name="position"
                                        className="form-control"
                                        placeholder="Например: Frontend-разработчик"
                                        value={profileData.position}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="experience">Опыт работы</label>
                                    <select
                                        id="experience"
                                        name="experience"
                                        className="form-control"
                                        value={profileData.experience}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Выберите опыт работы</option>
                                        <option value="no-experience">Нет опыта</option>
                                        <option value="1-3">1-3 года</option>
                                        <option value="3-5">3-5 лет</option>
                                        <option value="5+">Более 5 лет</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="skills">Навыки</label>
                                    <SkillsInput
                                        value={profileData.skills}
                                        onChange={handleInputChange}
                                        placeholder="React, Node.js, Figma..."
                                        autoAddNewSkills={true}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="about">О себе</label>
                                    <textarea
                                        id="about"
                                        name="about"
                                        className="form-control profile-textarea"
                                        placeholder="Расскажите о своем опыте и навыках"
                                        value={profileData.about}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button className="button button_blue_m" onClick={handleSaveProfile}>
                                Сохранить изменения
                            </button>
                        </div>
                    </div>)}

                {activeTab === "applications" && (<div className="applications-info">
                        <h3>Мои отклики на вакансии</h3>
                        {applications.length === 0 ? (<div className="no-data-message">
                                <p>У вас пока нет откликов на вакансии.</p>
                                <Link to="/vacancies" className="button button_blue_m">
                                    Найти вакансии
                                </Link>
                            </div>) : (<div className="applications-grid">
                                {applications.map((application) => (<div key={application.vacancyId}
                                                                         className="application-card"
                                                                         ref={el => (itemRefs[application.vacancyId] = el)}
                                    >
                                        <div className="application-header">
                                            <h4 className="application-title">{application.vacancyTitle}</h4>
                                            <span className={`application-status status-${application.status}`}>
                        {application.status === "pending" ? "На рассмотрении" : application.status === "viewed" ? "Просмотрено" : application.status === "approved" ? "Одобрено" : "Отклонено"}
                      </span>
                                        </div>
                                        <div className="application-company">{application.companyName}</div>
                                        <div className="application-date">
                                            Дата отклика: {new Date(application.date).toLocaleDateString("ru-RU")}
                                        </div>
                                        <div className="application-message">
                                            <h5>Сопроводительное письмо:</h5>
                                            <p>{application.coverLetter}</p>
                                        </div>
                                        <div className="application-actions">
                                            <Link to={`/vacancy/${application.vacancyId}`}
                                                  className="button button_gray_m">
                                                Просмотреть вакансию
                                            </Link>
                                        </div>
                                    </div>))}
                            </div>)}
                    </div>)}
            </div>
        </div>)
}

// Компонент для профиля работодателя
function EmployerProfile() {
    const {currentUser} = useAuth()
    const [applications, setApplications] = useState([])
    const [vacancies, setVacancies] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("profile")
    const [profileData, setProfileData] = useState({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        phone: "",
        companyName: "",
        industry: "",
        website: "",
        description: "",
    })
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [validationErrors, setValidationErrors] = useState({})

    useEffect(() => {
        setLoading(true)
        try {
            const storedApplications = JSON.parse(localStorage.getItem(`db_applications`)) || []
            const storedVacancies = JSON.parse(localStorage.getItem(`db_vacancies`)) || []

            const userVacancies = storedVacancies.filter((vac) => vac.authorId === currentUser.id)
            setVacancies(userVacancies)

            // Get applications for employer's vacancies
            const employerVacancyIds = userVacancies.map((vac) => vac.id)
            const employerApplications = storedApplications.filter((app) => employerVacancyIds.includes(app.vacancyId))
            setApplications(employerApplications)

            const users = JSON.parse(localStorage.getItem(`db_users`)) || []
            const user = users.find((u) => u.id === currentUser.id)
            if (user) {
                setProfileData({
                    name: user.name || "",
                    email: user.email || "",
                    phone: user.profile?.contacts?.phone || "",
                    companyName: user.profile?.companyName || user.name || "",
                    industry: user.profile?.industry || "",
                    website: user.profile?.website || "",
                    description: user.profile?.description || "",
                })
            }
        } catch (error) {
            console.error("Ошибка при загрузке данных профиля:", error)
        } finally {
            setLoading(false)
        }
    }, [currentUser.id])

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setProfileData({
            ...profileData, [name]: value,
        })
    }

    const handleSaveProfile = () => {
        try {
            const errors = {}
            if (profileData.phone && !isValidPhoneNumber(profileData.phone)) {
                errors.phone = 'Неверный формат номера телефона'
            } else {
                delete errors.phone
            }

            if (!profileData.companyName?.trim()) {
                errors.companyName = "Название компании обязательно для заполнения"
            } else if (profileData.companyName.trim().length < 2) {
                errors.companyName = "Название компании должно содержать минимум 2 символа"
            } else {
                delete errors.companyName
            }

            setValidationErrors(errors)

            if (Object.keys(errors).length > 0) {
                setErrorMessage("Данные невалидны - проверьте выделенные поля")
                setTimeout(() => {
                    setErrorMessage("")
                }, 3200)
                return
            }

            const users = JSON.parse(localStorage.getItem(`db_users`)) || []
            const updatedUsers = users.map((user) => {
                if (user.id === currentUser.id) {
                    return {
                        ...user, name: profileData.name, profile: {
                            ...user.profile,
                            companyName: profileData.companyName,
                            industry: profileData.industry,
                            website: profileData.website,
                            description: profileData.description,
                            contacts: {
                                ...user.profile.contacts, phone: profileData.phone,
                            },
                        },
                    }
                }
                return user
            })

            localStorage.setItem(`db_users`, JSON.stringify(updatedUsers))
            const updatedCurrentUser = updatedUsers.find((user) => user.id === currentUser.id)
            localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser))
            setSuccessMessage("Профиль успешно обновлен")
            setTimeout(() => {
                setSuccessMessage("")
            }, 1200)
        } catch (error) {
            console.error("Ошибка при сохранении профиля:", error)
        }
    }

    if (loading) {
        return (<div className="container">
                <div className="loading-indicator">Загрузка профиля...</div>
            </div>)
    }

    return (<div className="profile-tabs">
            <div className="tabs-header">
                <button
                    className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                >
                    Профиль компании
                </button>
                <button
                    className={`tab-button ${activeTab === "vacancies" ? "active" : ""}`}
                    onClick={() => setActiveTab("vacancies")}
                >
                    Мои вакансии
                </button>
                <button
                    className={`tab-button ${activeTab === "applications" ? "active" : ""}`}
                    onClick={() => setActiveTab("applications")}
                >
                    Отклики соискателей
                </button>
            </div>

            <div className="tab-content">
                {activeTab === "profile" && (<div className="profile-info">
                        <div className="profile-header">
                            <div className="profile-avatar-container">
                                <div className="profile-avatar">{profileData.companyName.charAt(0).toUpperCase()}</div>
                            </div>
                            <div className="profile-details">
                                <h3 className="profile-name">{profileData.companyName}</h3>
                                <p className="profile-email">{profileData.email}</p>
                                <p className="profile-type">Работодатель</p>
                            </div>
                        </div>

                        {successMessage && (<div className="success-popup">
                                {successMessage}
                            </div>)}
                        {errorMessage && (<div className="error-popup">
                            {errorMessage}
                        </div>)}

                        <div className="profile-section">
                            <h4 className="profile-section-title">Информация о компании</h4>
                            <div className="profile-form">
                                <div className="form-group">
                                    <label htmlFor="companyName">Название компании</label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        name="companyName"
                                        className="form-control"
                                        value={profileData.companyName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    {validationErrors.companyName && (<div className="error-message">
                                            {validationErrors.companyName}
                                        </div>)}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="industry">Отрасль</label>
                                    <input
                                        type="text"
                                        id="industry"
                                        name="industry"
                                        className="form-control"
                                        placeholder="Например: IT, Финансы, Образование"
                                        value={profileData.industry}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="website">Веб-сайт</label>
                                    <input
                                        type="url"
                                        id="website"
                                        name="website"
                                        className="form-control"
                                        placeholder="https://example.com"
                                        value={profileData.website}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Описание компании</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="form-control profile-textarea"
                                        placeholder="Расскажите о вашей компании"
                                        value={profileData.description}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="profile-section">
                            <h4 className="profile-section-title">Контактная информация</h4>
                            <div className="profile-form">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-control"
                                        value={profileData.email}
                                        readOnly
                                    />
                                </div>
                                <PhoneInput
                                    name="phone"
                                    phone={profileData.phone}
                                    onChange={handleInputChange}
                                    error={validationErrors.phone}
                                />
                            </div>
                        </div>

                        <div className="profile-actions">
                            <button className="button button_blue_m" onClick={handleSaveProfile}>
                                Сохранить изменения
                            </button>
                        </div>
                    </div>)}

                {activeTab === "vacancies" && (<div className="vacancies-info">
                        <div className="vacancies-header">
                            <h3>Мои вакансии</h3>
                            <Link to="/create-vacancy" className="button button_blue_m">
                                Создать вакансию
                            </Link>
                        </div>

                        {vacancies.length === 0 ? (<div className="no-data-message">
                                <p>У вас пока нет опубликованных вакансий.</p>
                                <Link to="/create-vacancy" className="button button_blue_m">
                                    Создать вакансию
                                </Link>
                            </div>) : (<div className="vacancies-list">
                                {vacancies.map((vacancy) => (<div key={vacancy.id} className="vacancy-card">
                                        <div className="vacancy-header">
                                            <h4 className="vacancy-title">{vacancy.title}</h4>
                                            <div className="vacancy-salary">
                                                {vacancy.salary ? `${vacancy.salary} ₽` : "Зарплата не указана"}
                                            </div>
                                        </div>
                                        <div className="vacancy-company">
                                            <div>{vacancy.company}</div>
                                            <div className="vacancy-location">
                                                {vacancy.location}
                                                {vacancy.remote &&
                                                    <span className="remote-badge">Удаленная работа</span>}
                                            </div>
                                        </div>
                                        <div className="vacancy-description">
                                            <p>
                                                {vacancy.description.length > 150 ? `${vacancy.description.substring(0, 150)}...` : vacancy.description}
                                            </p>
                                        </div>
                                        <div className="vacancy-footer">
                      <span className="vacancy-date">
                        Опубликовано: {new Date(vacancy.date).toLocaleDateString("ru-RU")}
                      </span>
                                            <div className="card_buttons">
                                                <Link to={`/vacancy/${vacancy.id}`} className="button button_gray_m">
                                                    Просмотреть
                                                </Link>
                                                <Link to={`/vacancies/edit/${vacancy.id}`}
                                                      className="button button_blue_m">
                                                    Редактировать
                                                </Link>
                                            </div>
                                        </div>
                                    </div>))}
                            </div>)}
                    </div>)}

                {activeTab === "applications" && (<div className="applications-info">
                        <h3>Отклики на мои вакансии</h3>
                        {applications.length === 0 ? (<div className="no-data-message">
                                <p>На ваши вакансии пока нет откликов.</p>
                                {vacancies.length === 0 ? (<Link to="/create-vacancy" className="button button_blue_m">
                                        Создать вакансию
                                    </Link>) : (<p>Ожидайте откликов от соискателей.</p>)}
                            </div>) : (<div className="applications-grid">
                                {applications.map((application) => (
                                    <div key={application.id} className="application-card">
                                        <div className="application-header">
                                            <h4 className="application-title">Отклик от {application.userName}</h4>
                                            <span className={`application-status status-${application.status}`}>
                        {application.status === "pending" ? "На рассмотрении" : application.status === "viewed" ? "Просмотрено" : application.status === "approved" ? "Одобрено" : "Отклонено"}
                      </span>
                                        </div>
                                        <div className="application-details">
                                            <p>
                                                <strong>Вакансия:</strong> {application.vacancyTitle}
                                            </p>
                                            <p>
                                                <strong>Email:</strong> {application.userEmail}
                                            </p>
                                            <p>
                                                <strong>Телефон:</strong> {application.contactPhone || "Не указан"}
                                            </p>
                                            <p>
                                                <strong>Дата
                                                    отклика:</strong> {new Date(application.date).toLocaleDateString("ru-RU")}
                                            </p>
                                        </div>
                                        <div className="application-message">
                                            <h5>Сопроводительное письмо:</h5>
                                            <p>{application.coverLetter}</p>
                                        </div>
                                        <div className="application-actions">
                                            <Link to={`/vacancy/${application.vacancyId}`}
                                                  className="button button_gray_m">
                                                Просмотреть вакансию
                                            </Link>
                                            <Link to="/applications" className="button button_blue_m">
                                                Управление откликами
                                            </Link>
                                        </div>
                                    </div>))}
                            </div>)}
                    </div>)}
            </div>
        </div>)
}

// Основной компонент UserProfile, который выбирает нужный тип профиля
function UserProfile({profileType}) {
    const {currentUser} = useAuth()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Проверяем, что текущий пользователь загружен
        if (currentUser) {
            setLoading(false)
        }
    }, [currentUser])

    if (loading) {
        return (<div className="container">
                <div className="loading-indicator">Загрузка профиля...</div>
            </div>)
    }

    return (<div className="container">
            {profileType === PROFILE_TYPES.APPLICANT ? <ApplicantProfile/> : <EmployerProfile/>}
        </div>)
}

export default UserProfile