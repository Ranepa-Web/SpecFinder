"use client"

// src/components/Search.js
import { useState, useEffect, useMemo } from "react"
import { LOCAL_STORAGE_KEYS } from "../constants"

// Пример данных по умолчанию
const defaultItems = [
  { id: 1, name: "Иван Петров", price: 1500, rating: 4.8, isVerify: true, category: "Веб-разработка" },
  { id: 2, name: "Анна Сидорова", price: 1200, rating: 4.5, isVerify: false, category: "Дизайн" },
  { id: 3, name: "Сергей Кузнецов", price: 2000, rating: 4.9, isVerify: true, category: "Веб-разработка" },
  { id: 4, name: "Мария Иванова", price: 1800, rating: 4.7, isVerify: true, category: "Копирайтинг" },
  { id: 5, name: "Алексей Смирнов", price: null, rating: 4.2, isVerify: false, category: "Маркетинг" },
  { id: 6, name: "Елена Волкова", price: 1650, rating: 5.0, isVerify: true, category: "Дизайн" },
]

// Инициализация localStorage при первом запуске
const initializeItemsStorage = () => {
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.SEARCH_ITEMS)) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SEARCH_ITEMS, JSON.stringify(defaultItems))
      console.log("LocalStorage для поиска инициализирован.")
    } catch (error) {
      console.error("Ошибка инициализации items в localStorage:", error)
    }
  }
}

// Добавляем проверку на существование массива appliedJobs в профиле пользователя
const hasApplied = (vacancyId) => {
  // Mock currentUser for demonstration. Replace with actual user data.
  const currentUser = {
    userType: "jobseeker",
    profile: {
      appliedJobs: [],
    },
  }
  return (
    currentUser &&
    currentUser.userType === "jobseeker" &&
    currentUser.profile &&
    currentUser.profile.appliedJobs &&
    currentUser.profile.appliedJobs.includes(vacancyId)
  )
}

const Search = () => {
  const [items, setItems] = useState([]) // Все загруженные элементы
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    initializeItemsStorage()
    console.log("Search.js: Загрузка из localStorage...")
    setLoading(true)
    setError(null)

    try {
      const itemsJson = localStorage.getItem(LOCAL_STORAGE_KEYS.SEARCH_ITEMS)
      const loadedItems = itemsJson ? JSON.parse(itemsJson) : []
      setItems(loadedItems)
      console.log(`Загружено ${loadedItems.length} элементов.`)
    } catch (err) {
      console.error("Ошибка загрузки items из localStorage:", err)
      setError("Не удалось загрузить список исполнителей.")
    } finally {
      setLoading(false) // Завершаем загрузку в любом случае
    }
  }, [])

  // Обработчик изменения поля поиска
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  // Обработчик изменения фильтра категории
  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value)
  }

  // Обработчик изменения фильтра верификации
  const handleVerifiedChange = (event) => {
    setVerifiedOnly(event.target.checked)
  }

  // Сброс всех фильтров
  const resetFilters = () => {
    setSearchQuery("")
    setCategoryFilter("")
    setVerifiedOnly(false)
  }

  // Получение уникальных категорий для фильтра
  const categories = useMemo(() => {
    const uniqueCategories = new Set()
    items.forEach((item) => {
      if (item.category) {
        uniqueCategories.add(item.category)
      }
    })
    return Array.from(uniqueCategories)
  }, [items])

  // Фильтрация списка исполнителей
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const category = categoryFilter.trim()

    return items.filter((item) => {
      // Фильтр по поисковому запросу
      const nameMatch = !query || (item.name && item.name.toLowerCase().includes(query))

      // Фильтр по категории
      const categoryMatch = !category || (item.category && item.category === category)

      // Фильтр по верификации
      const verifyMatch = !verifiedOnly || item.isVerify

      return nameMatch && categoryMatch && verifyMatch
    })
  }, [items, searchQuery, categoryFilter, verifiedOnly])

  // Рендеринг Карточки Исполнителя
  const renderItemCard = (item) => (
    <div key={item.id} className="item_card">
      <h3>{item.name || "Имя не указано"}</h3>
      {item.price != null && <h3 className="blue">{item.price} руб.</h3>}

      <div className="card_tags">
        {item.rating != null && (
          <div className="card_tag">
            <h4>Рейтинг: {item.rating.toFixed(1)}</h4>
          </div>
        )}
        <div className={`card_tag ${item.isVerify ? "verified" : "not-verified"}`}>
          <h4>{item.isVerify ? "Проверенный" : "Не проверен"}</h4>
        </div>
      </div>

      {item.category && (
        <>
          <h4>Категория</h4>
          <p className="card_p">{item.category}</p>
        </>
      )}

      <div className="card_buttons">
        <button type="button" className="button button_blue_m">
          Смотреть резюме
        </button>
        <button type="button" className="button button_gray_m">
          Контакты
        </button>
      </div>
    </div>
  )

  return (
    <div className="container">
      <h1 className="search-title">Поиск специалистов</h1>
      <div className="row">
        {/* Блок Фильтров */}
        <div className="col-lg-3">
          <div className="base">
            <h4>Фильтры</h4>

            {/* Фильтр по категории */}
            <div className="filter-group">
              <label htmlFor="category-filter">Категория</label>
              <select
                id="category-filter"
                className="form-control"
                value={categoryFilter}
                onChange={handleCategoryChange}
              >
                <option value="">Все категории</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Фильтр по верификации */}
            <div className="filter-group checkbox-filter">
              <label>
                <input type="checkbox" checked={verifiedOnly} onChange={handleVerifiedChange} />
                Только проверенные
              </label>
            </div>

            <button type="button" className="button button_blue_m w-100" onClick={resetFilters}>
              Сбросить фильтры
            </button>
          </div>
        </div>

        {/* Блок Поиска и Результатов */}
        <div className="col-lg-9">
          {/* Поле ввода поиска */}
          <div className="search_line">
            <input
              className="search_input"
              type="search"
              placeholder="Поиск по имени..."
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Поиск исполнителей"
            />
          </div>

          {/* Отображение состояния загрузки */}
          {loading && <div className="loading-indicator">Загрузка исполнителей</div>}

          {/* Отображение ошибки */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Отображение результатов или сообщения "не найдено" */}
          {!loading &&
            !error &&
            (filteredItems.length > 0 ? (
              <div className="specialists-grid">{filteredItems.map(renderItemCard)}</div>
            ) : (
              <div className="base" style={{ marginTop: "20px", textAlign: "center", color: "#555" }}>
                <p>По вашему запросу ничего не найдено.</p>
                <p style={{ fontSize: "0.9em", marginTop: "10px" }}>Попробуйте изменить запрос или сбросить фильтры.</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Search
