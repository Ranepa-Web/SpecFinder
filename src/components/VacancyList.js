"use client"

import { useState, useEffect, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { fetchData } from "../server/api"

const VacancyList = ({ limit }) => {
  const [vacancies, setVacancies] = useState([])
  const [filteredVacancies, setFilteredVacancies] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  // Обновляем состояние фильтров, добавляя новые параметры
  const [filters, setFilters] = useState({
    remote: false,
    minSalary: "",
    maxSalary: "",
    location: "",
    experience: "", // Новый фильтр по опыту работы
    employmentType: "", // Новый фильтр по типу занятости
    datePosted: "", // Новый фильтр по дате публикации
    keywords: [], // Новый фильтр по ключевым словам/навыкам
  })
  const [sortBy, setSortBy] = useState("newest") // newest, oldest, salary-high, salary-low
  const { currentUser, applyForJob } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    // Загружаем вакансии из сервера
    const loadVacancies = async () => {
      try {
        setLoading(true)
        const data = await fetchData("vacancies")
        setVacancies(data)
        setFilteredVacancies(limit ? data.slice(0, limit) : data)
        setLoading(false)
      } catch (err) {
        setError("Ошибка при загрузке вакансий")
        setLoading(false)
      }
    }

    loadVacancies()
  }, [limit])

  // Обновляем функцию обработки изменений фильтров
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === "keywords") {
      // Обрабатываем ключевые слова как массив
      const keywordsArray = value
        .split(",")
        .map((word) => word.trim())
        .filter((word) => word !== "")
      setFilters({
        ...filters,
        [name]: keywordsArray,
      })
    } else {
      setFilters({
        ...filters,
        [name]: type === "checkbox" ? checked : value,
      })
    }
  }

  // Обновляем функцию сброса фильтров
  const resetFilters = () => {
    setFilters({
      remote: false,
      minSalary: "",
      maxSalary: "",
      location: "",
      experience: "",
      employmentType: "",
      datePosted: "",
      keywords: [],
    })
    setSearchTerm("")
    setSortBy("newest")
  }

  // Обновляем функцию фильтрации и сортировки вакансий
  useEffect(() => {
    // Фильтрация и сортировка вакансий при изменении поискового запроса или фильтров
    const filterAndSortVacancies = () => {
      let result = vacancies

      // Фильтрация по поисковому запросу
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        result = result.filter(
          (vacancy) =>
            vacancy.title.toLowerCase().includes(term) ||
            vacancy.company.toLowerCase().includes(term) ||
            vacancy.description.toLowerCase().includes(term),
        )
      }

      // Фильтрация по удаленной работе
      if (filters.remote) {
        result = result.filter((vacancy) => vacancy.remote)
      }

      // Фильтрация по минимальной зарплате
      if (filters.minSalary) {
        result = result.filter((vacancy) => {
          if (!vacancy.salary) return false
          // Извлекаем числа из строки зарплаты (например, "120000 - 150000")
          const salaryNumbers = vacancy.salary.match(/\d+/g)
          if (!salaryNumbers || salaryNumbers.length === 0) return false

          // Берем минимальное значение из диапазона зарплат
          const minVacancySalary = Math.min(...salaryNumbers.map((num) => Number.parseInt(num)))
          return minVacancySalary >= Number.parseInt(filters.minSalary)
        })
      }

      // Фильтрация по максимальной зарплате
      if (filters.maxSalary) {
        result = result.filter((vacancy) => {
          if (!vacancy.salary) return false
          // Извлекаем числа из строки зарплаты
          const salaryNumbers = vacancy.salary.match(/\d+/g)
          if (!salaryNumbers || salaryNumbers.length === 0) return false

          // Берем максимальное значение из диапазона зарплат
          const maxVacancySalary = Math.max(...salaryNumbers.map((num) => Number.parseInt(num)))
          return maxVacancySalary <= Number.parseInt(filters.maxSalary)
        })
      }

      // Фильтрация по местоположению
      if (filters.location) {
        const location = filters.location.toLowerCase()
        result = result.filter((vacancy) => vacancy.location && vacancy.location.toLowerCase().includes(location))
      }

      // Фильтрация по опыту работы
      if (filters.experience) {
        result = result.filter((vacancy) => {
          // Проверяем, содержит ли описание или требования упоминание выбранного опыта
          const experienceRegex = new RegExp(`опыт.{0,30}${filters.experience}`, "i")
          return (
            experienceRegex.test(vacancy.description) ||
            (vacancy.requirements && vacancy.requirements.some((req) => experienceRegex.test(req)))
          )
        })
      }

      // Фильтрация по типу занятости
      if (filters.employmentType) {
        result = result.filter((vacancy) => {
          const employmentTypeRegex = new RegExp(filters.employmentType, "i")
          return employmentTypeRegex.test(vacancy.description)
        })
      }

      // Фильтрация по дате публикации
      if (filters.datePosted) {
        const currentDate = new Date("2025-04-22") // Используем фиксированную текущую дату
        let dateLimit

        switch (filters.datePosted) {
          case "today":
            dateLimit = new Date(currentDate)
            dateLimit.setDate(currentDate.getDate() - 1)
            break
          case "week":
            dateLimit = new Date(currentDate)
            dateLimit.setDate(currentDate.getDate() - 7)
            break
          case "month":
            dateLimit = new Date(currentDate)
            dateLimit.setMonth(currentDate.getMonth() - 1)
            break
          default:
            dateLimit = null
        }

        if (dateLimit) {
          result = result.filter((vacancy) => new Date(vacancy.date) >= dateLimit)
        }
      }

      // Фильтрация по ключевым словам/навыкам
      if (filters.keywords && filters.keywords.length > 0) {
        result = result.filter((vacancy) => {
          // Проверяем наличие ключевых слов в заголовке, описании или требованиях
          return filters.keywords.some((keyword) => {
            const keywordRegex = new RegExp(keyword, "i")
            return (
              keywordRegex.test(vacancy.title) ||
              keywordRegex.test(vacancy.description) ||
              (vacancy.requirements && vacancy.requirements.some((req) => keywordRegex.test(req)))
            )
          })
        })
      }

      // Сортировка вакансий
      switch (sortBy) {
        case "newest":
          result = [...result].sort((a, b) => new Date(b.date) - new Date(a.date))
          break
        case "oldest":
          result = [...result].sort((a, b) => new Date(a.date) - new Date(b.date))
          break
        case "salary-high":
          result = [...result].sort((a, b) => {
            // Извлекаем максимальные значения зарплат для сравнения
            const getSalaryValue = (salary) => {
              if (!salary) return 0
              const salaryNumbers = salary.match(/\d+/g)
              if (!salaryNumbers || salaryNumbers.length === 0) return 0
              return Math.max(...salaryNumbers.map((num) => Number.parseInt(num)))
            }

            const salaryA = getSalaryValue(a.salary)
            const salaryB = getSalaryValue(b.salary)
            return salaryB - salaryA
          })
          break
        case "salary-low":
          result = [...result].sort((a, b) => {
            // Извлекаем минимальные значения зарплат для сравнения
            const getSalaryValue = (salary) => {
              if (!salary) return Number.POSITIVE_INFINITY
              const salaryNumbers = salary.match(/\d+/g)
              if (!salaryNumbers || salaryNumbers.length === 0) return Number.POSITIVE_INFINITY
              return Math.min(...salaryNumbers.map((num) => Number.parseInt(num)))
            }

            const salaryA = getSalaryValue(a.salary)
            const salaryB = getSalaryValue(b.salary)

            // Если у обоих нет зарплаты, сортируем по дате
            if (salaryA === Number.POSITIVE_INFINITY && salaryB === Number.POSITIVE_INFINITY) {
              return new Date(b.date) - new Date(a.date)
            }

            // Вакансии без зарплаты в конце списка
            if (salaryA === Number.POSITIVE_INFINITY) return 1
            if (salaryB === Number.POSITIVE_INFINITY) return -1

            return salaryA - salaryB
          })
          break
        case "relevance":
          // Сортировка по релевантности (если есть поисковый запрос или ключевые слова)
          if (searchTerm || (filters.keywords && filters.keywords.length > 0)) {
            result = [...result].sort((a, b) => {
              const searchTerms = searchTerm ? [searchTerm.toLowerCase()] : []
              const allTerms = [...searchTerms, ...(filters.keywords || []).map((k) => k.toLowerCase())]

              // Функция для подсчета совпадений
              const countMatches = (vacancy) => {
                let count = 0
                allTerms.forEach((term) => {
                  if (vacancy.title.toLowerCase().includes(term)) count += 3 // Заголовок важнее
                  if (vacancy.description.toLowerCase().includes(term)) count += 1
                  if (vacancy.requirements) {
                    vacancy.requirements.forEach((req) => {
                      if (req.toLowerCase().includes(term)) count += 2 // Требования важнее описания
                    })
                  }
                })
                return count
              }

              const matchesA = countMatches(a)
              const matchesB = countMatches(b)

              return matchesB - matchesA
            })
          }
          break
        default:
          break
      }

      // Ограничиваем количество вакансий, если указан лимит
      if (limit) {
        result = result.slice(0, limit)
      }

      setFilteredVacancies(result)
    }

    filterAndSortVacancies()
  }, [searchTerm, filters, sortBy, vacancies, limit])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const handleApply = async (vacancyId) => {
    if (!currentUser) {
      navigate("/login")
      return
    }

    if (currentUser.userType !== "jobseeker") {
      setError("Только соискатели могут откликаться на вакансии")
      return
    }

    try {
      await applyForJob(vacancyId)
      // Обновляем список вакансий, чтобы отразить отклик
      const updatedVacancies = await fetchData("vacancies")
      setVacancies(updatedVacancies)
      setFilteredVacancies(
        filteredVacancies.map((vacancy) =>
          vacancy.id === vacancyId ? updatedVacancies.find((v) => v.id === vacancyId) : vacancy,
        ),
      )
      alert("Вы успешно откликнулись на вакансию!")
    } catch (err) {
      setError(err.message || "Ошибка при отклике на вакансию")
    }
  }

  // Исправляем функцию проверки отклика на вакансию
  const hasApplied = (vacancyId) => {
    return (
      currentUser &&
      currentUser.userType === "jobseeker" &&
      currentUser.profile &&
      currentUser.profile.appliedJobs &&
      currentUser.profile.appliedJobs.includes(vacancyId)
    )
  }

  const isEmployer = currentUser && currentUser.userType === "employer"

  // Если это компонент на главной странице, показываем упрощенный вид
  if (limit) {
    return (
      <div className="vacancies-list">
        {loading ? (
          <div className="loading-indicator">Загрузка вакансий...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : filteredVacancies.length === 0 ? (
          <div className="no-vacancies">Вакансии не найдены</div>
        ) : (
          <>
            {filteredVacancies.map((vacancy) => (
              <div key={vacancy.id} className="vacancy-card">
                <div className="vacancy-header">
                  <h2 className="vacancy-title">{vacancy.title}</h2>
                  <div className="vacancy-salary">{vacancy.salary ? `${vacancy.salary} ₽` : "Зарплата не указана"}</div>
                </div>
                <div className="vacancy-company">{vacancy.company}</div>
                <div className="vacancy-description">
                  {vacancy.description.length > 150
                    ? `${vacancy.description.substring(0, 150)}...`
                    : vacancy.description}
                </div>
                <div className="vacancy-footer">
                  <Link to={`/vacancy/${vacancy.id}`} className="button button_blue_m">
                    Подробнее
                  </Link>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="vacancies-container">
      <div className="vacancies-header">
        <h1 className="vacancies-title">Вакансии</h1>
        {isEmployer && (
          <Link to="/create-vacancy" className="button button_blue_m">
            Создать вакансию
          </Link>
        )}
      </div>

      <div className="row">
        {/* Заменяем блок фильтров на более расширенный */}
        <div className="col-lg-3">
          <div className="base">
            <h4>Фильтры</h4>

            <div className="search-container">
              <input
                type="text"
                placeholder="Поиск вакансий..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="form-control mb-3"
              />
            </div>

            <div className="filter-group">
              <label className="checkbox-filter">
                <input type="checkbox" name="remote" checked={filters.remote} onChange={handleFilterChange} />
                Удаленная работа
              </label>
            </div>

            <div className="filter-group">
              <label>Зарплата</label>
              <div className="salary-filter">
                <input
                  type="number"
                  name="minSalary"
                  value={filters.minSalary}
                  onChange={handleFilterChange}
                  className="salary-input"
                  placeholder="От"
                />
                <span className="salary-separator">—</span>
                <input
                  type="number"
                  name="maxSalary"
                  value={filters.maxSalary}
                  onChange={handleFilterChange}
                  className="salary-input"
                  placeholder="До"
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Город</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="form-control"
                placeholder="Введите город"
              />
            </div>

            {/* Новый фильтр по опыту работы */}
            <div className="filter-group">
              <label>Опыт работы</label>
              <select
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">Любой опыт</option>
                <option value="без опыта">Без опыта</option>
                <option value="1-3 года">1-3 года</option>
                <option value="3-5 лет">3-5 лет</option>
                <option value="более 5 лет">Более 5 лет</option>
              </select>
            </div>

            {/* Новый фильтр по типу занятости */}
            <div className="filter-group">
              <label>Тип занятости</label>
              <select
                name="employmentType"
                value={filters.employmentType}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">Любой тип</option>
                <option value="полная">Полная занятость</option>
                <option value="частичная">Частичная занятость</option>
                <option value="проектная">Проектная работа</option>
                <option value="стажировка">Стажировка</option>
              </select>
            </div>

            {/* Новый фильтр по дате публикации */}
            <div className="filter-group">
              <label>Дата публикации</label>
              <select
                name="datePosted"
                value={filters.datePosted}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">За все время</option>
                <option value="today">За сегодня</option>
                <option value="week">За неделю</option>
                <option value="month">За месяц</option>
              </select>
            </div>

            {/* Новый фильтр по ключевым словам/навыкам */}
            <div className="filter-group">
              <label>Ключевые навыки</label>
              <input
                type="text"
                name="keywords"
                value={filters.keywords.join(", ")}
                onChange={handleFilterChange}
                className="form-control"
                placeholder="Например: React, JavaScript"
              />
              <small className="filter-hint">Введите навыки через запятую</small>
            </div>

            <div className="filter-group">
              <label>Сортировка</label>
              <select className="form-control" value={sortBy} onChange={handleSortChange}>
                <option value="newest">Сначала новые</option>
                <option value="oldest">Сначала старые</option>
                <option value="salary-high">По убыванию зарплаты</option>
                <option value="salary-low">По возрастанию зарплаты</option>
                <option value="relevance">По релевантности</option>
              </select>
            </div>

            <button className="button button_blue_m apply-filters-btn" onClick={() => {}}>
              Применить фильтры
            </button>
            <button className="button reset-filters-btn" onClick={resetFilters}>
              Сбросить фильтры
            </button>
          </div>

          {/* Добавляем блок с активными фильтрами */}
          {(filters.remote ||
            filters.minSalary ||
            filters.maxSalary ||
            filters.location ||
            filters.experience ||
            filters.employmentType ||
            filters.datePosted ||
            (filters.keywords && filters.keywords.length > 0)) && (
            <div className="base active-filters">
              <h4>Активные фильтры</h4>
              <div className="active-filters-list">
                {filters.remote && (
                  <div className="active-filter-tag">
                    Удаленная работа
                    <button className="remove-filter" onClick={() => setFilters({ ...filters, remote: false })}>
                      ×
                    </button>
                  </div>
                )}

                {(filters.minSalary || filters.maxSalary) && (
                  <div className="active-filter-tag">
                    Зарплата: {filters.minSalary ? `от ${filters.minSalary}` : ""}
                    {filters.minSalary && filters.maxSalary ? " до " : ""}
                    {filters.maxSalary ? `до ${filters.maxSalary}` : ""}
                    <button
                      className="remove-filter"
                      onClick={() => setFilters({ ...filters, minSalary: "", maxSalary: "" })}
                    >
                      ×
                    </button>
                  </div>
                )}

                {filters.location && (
                  <div className="active-filter-tag">
                    Город: {filters.location}
                    <button className="remove-filter" onClick={() => setFilters({ ...filters, location: "" })}>
                      ×
                    </button>
                  </div>
                )}

                {filters.experience && (
                  <div className="active-filter-tag">
                    Опыт: {filters.experience}
                    <button className="remove-filter" onClick={() => setFilters({ ...filters, experience: "" })}>
                      ×
                    </button>
                  </div>
                )}

                {filters.employmentType && (
                  <div className="active-filter-tag">
                    Занятость: {filters.employmentType}
                    <button className="remove-filter" onClick={() => setFilters({ ...filters, employmentType: "" })}>
                      ×
                    </button>
                  </div>
                )}

                {filters.datePosted && (
                  <div className="active-filter-tag">
                    Дата:{" "}
                    {filters.datePosted === "today"
                      ? "За сегодня"
                      : filters.datePosted === "week"
                        ? "За неделю"
                        : "За месяц"}
                    <button className="remove-filter" onClick={() => setFilters({ ...filters, datePosted: "" })}>
                      ×
                    </button>
                  </div>
                )}

                {filters.keywords &&
                  filters.keywords.map((keyword, index) => (
                    <div key={index} className="active-filter-tag">
                      {keyword}
                      <button
                        className="remove-filter"
                        onClick={() => {
                          const newKeywords = [...filters.keywords]
                          newKeywords.splice(index, 1)
                          setFilters({ ...filters, keywords: newKeywords })
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Блок результатов */}
        <div className="col-lg-9">
          {loading ? (
            <div className="loading-indicator">Загрузка вакансий...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : filteredVacancies.length === 0 ? (
            <div className="no-results">
              <h3>Вакансии не найдены</h3>
              <p>Попробуйте изменить параметры поиска или сбросить фильтры.</p>
            </div>
          ) : (
            <div className="vacancies-list">
              {filteredVacancies.map((vacancy) => (
                <div key={vacancy.id} className="vacancy-card">
                  <div className="vacancy-header">
                    <h2 className="vacancy-title">{vacancy.title}</h2>
                    <div className="vacancy-salary">
                      {vacancy.salary ? `${vacancy.salary} ₽` : "Зарплата не указана"}
                    </div>
                  </div>

                  <div className="vacancy-company">
                    <div>{vacancy.company}</div>
                    <div className="vacancy-location">
                      {vacancy.location}
                      {vacancy.remote && <span className="remote-badge">Удаленная работа</span>}
                    </div>
                  </div>

                  <div className="vacancy-description">
                    <p>
                      {vacancy.description.length > 200
                        ? `${vacancy.description.substring(0, 200)}...`
                        : vacancy.description}
                    </p>
                  </div>

                  {vacancy.requirements && vacancy.requirements.length > 0 && (
                    <div className="vacancy-requirements">
                      <h4>Требования:</h4>
                      <div className="requirements-tags">
                        {vacancy.requirements.map((req, index) => (
                          <span key={index} className="requirement-tag">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="vacancy-footer">
                    <span className="vacancy-date">
                      Опубликовано: {new Date(vacancy.date).toLocaleDateString("ru-RU")}
                    </span>

                    <div className="card_buttons">
                      <Link to={`/vacancy/${vacancy.id}`} className="button button_gray_m">
                        Подробнее
                      </Link>

                      {currentUser &&
                        currentUser.userType === "jobseeker" &&
                        (hasApplied(vacancy.id) ? (
                          <button className="button button_white_m" disabled>
                            Вы откликнулись
                          </button>
                        ) : (
                          <button className="button button_blue_m" onClick={() => handleApply(vacancy.id)}>
                            Откликнуться
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VacancyList
