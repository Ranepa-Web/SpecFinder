// src/components/Search.js
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import SkillsInput from "./forms/SkillsInput";

const Search = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояния для поиска и фильтров
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [selectedSkills, setSelectedSkills] = useState([]); // массив выбранных навыков
  const [minExperience, setMinExperience] = useState("");     // минимальный опыт (лет)
  const [maxExperience, setMaxExperience] = useState("");     // максимальный опыт (лет)
  const [noExperience, setNoExperience] = useState(false);    // чекбокс «Без опыта»

  const [selectedCity, setSelectedCity] = useState("");   // массив выбранных городов

  // Загрузка резюме из localStorage
  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const resumesJson = localStorage.getItem("db_published_resumes");
      const allResumes = resumesJson ? JSON.parse(resumesJson) : [];

      const activeResumes = allResumes
          .filter((r) => r.isActive)
          .map((r) => {
            return ({
              ...r,
              category: r.category ?? r.position ?? "Другое",
              isVerify: r.isVerify ?? false,
              // Предполагаем, что r.skills уже массив, а не строка
              skills: Array.isArray(r.skills) ? r.skills : [],
              city: r.city ?? "",
            })
          });

      setResumes(activeResumes);
    } catch (err) {
      console.error("Ошибка загрузки резюме из localStorage:", err);
      setError("Не удалось загрузить список резюме.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Обработчики инпутов
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleCategoryChange = (e) => setCategoryFilter(e.target.value);
  const handleVerifiedChange = (e) => setVerifiedOnly(e.target.checked);

  const handleSkillsChange = (e) => setSelectedSkills(e.target.value);

  const handleMinExpChange = (e) => setMinExperience(e.target.value);
  const handleMaxExpChange = (e) => setMaxExperience(e.target.value);
  const handleNoExpChange = (e) => setNoExperience(e.target.checked);
  const handleSelectedCityChange = (e) => setSelectedCity(e.target.value);

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    setVerifiedOnly(false);
    setSelectedSkills([]);
    setMinExperience("");
    setMaxExperience("");
    setNoExperience(false);
    setSelectedCity("");
  };


  // Уникальные наборы для фильтров
  const categories = useMemo(() => {
    const setCat = new Set();
    resumes.forEach((r) => {
      if (r.category) setCat.add(r.category);
    });
    return Array.from(setCat);
  }, [resumes]);

  const allCities = useMemo(() => {
    const setCities = new Set();
    resumes.forEach((r) => {
      if (r.city && r.city.trim() !== "") setCities.add(r.city.trim());
    });
    return Array.from(setCities);
  }, [resumes]);

  // Основная фильтрация
  const filteredResumes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const cat = categoryFilter.trim();

    // Преобразуем min/max опыта в числа или null
    const minExpVal = minExperience === "" ? null : Number(minExperience);
    const maxExpVal = maxExperience === "" ? null : Number(maxExperience);

    return resumes.filter((r) => {
      // Поиск по имени или должности
      const nameMatch =
          !query || (r.name && r.name.toLowerCase().includes(query));
      const positionMatch =
          !query || (r.position && r.position.toLowerCase().includes(query));
      if (!nameMatch && !positionMatch) return false;

      // Фильтр по категории
      if (cat && r.category !== cat) return false;

      // Фильтр по верификации
      if (verifiedOnly && !r.isVerify) return false;

      // Фильтр по навыкам (тэгам)
      if (selectedSkills.length > 0) {
        // каждое выбранное skill должно содержаться в r.skills
        const hasAllSkills = selectedSkills.every((skill) =>
            r.skills.includes(skill)
        );
        if (!hasAllSkills) return false;
      }

      // Фильтр по опыту
      if (noExperience) {
        // показываем тех, у кого опыт null или 0
        if (r.experience && r.experience > 0) return false;
      } else {
        if (minExpVal != null || maxExpVal != null) {
          const expVal = r.experience == null ? 0 : r.experience;
          console.log(expVal)
          if (minExpVal != null && expVal < minExpVal) return false;
          if (maxExpVal != null && expVal > maxExpVal) return false;
        }
      }

      // Фильтр по городу
      if (selectedCity.length > 0) {
        if (!r.city?.toLowerCase().startsWith(selectedCity.toLowerCase())) return false;
      }

      return true;
    });
  }, [
    resumes,
    searchQuery,
    categoryFilter,
    verifiedOnly,
    selectedSkills,
    minExperience,
    maxExperience,
    noExperience,
    selectedCity,
  ]);

  // Рендер карточки резюме
  const renderResumeCard = (r) => (
      <div key={r.id} className="card mb-4 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h4 className="card-title mb-0">
                {r.name || "Имя не указано"}
              </h4>
              <h6 className="card-subtitle text-muted">
                {r.position || "Должность не указана"}
              </h6>
            </div>
            <div>
              {r.isVerify ? (
                  <span className="badge bg-success">Проверенный</span>
              ) : (
                  <span className="badge bg-secondary">Не проверен</span>
              )}
            </div>
          </div>

          <p className="mb-2">
            <strong>Город:</strong> {r.city || "Не указан"}
          </p>
          <p className="mb-2">
            <strong>Опыт:</strong>{" "}
            {r.experience != null ? `${Math.floor(r.experience) } лет` : "Не указан"}
          </p>

          <div className="mb-2">
            <strong>Навыки:</strong>
            <div className="mt-1">
              {r.skills.map((skill, idx) => (
                  <span key={idx} className="badge bg-primary me-1 mb-1">
                {skill}
              </span>
              ))}
            </div>
          </div>

          <p className="mb-2">
            <strong>О себе:</strong> {r.about || "Не указано"}
          </p>

          <div className="d-flex justify-content-between mt-3">
            <Link to={`/resume/${r.id}`} className="btn btn-primary">
              Смотреть резюме
            </Link>
            <button type="button" className="btn btn-secondary">
              Контакты
            </button>
          </div>
        </div>
      </div>
  );

  return (
      <div className="container mt-4">
        <h1 className="mb-4">Поиск открытых резюме</h1>

        <div className="row">
          {/* Блок Фильтров */}
          <div className="col-lg-3 mb-4">
            <div className="card p-3">
              <h4 className="mb-3">Фильтры</h4>

              {/* Фильтр по категории */}
              <div className="mb-3">
                <label htmlFor="category-filter" className="form-label">
                  Категория
                </label>
                <select
                    id="category-filter"
                    className="form-select"
                    value={categoryFilter}
                    onChange={handleCategoryChange}
                >
                  <option value="">Все категории</option>
                  {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                  ))}
                </select>
              </div>

              {/* Фильтр по верификации */}
              <div className="form-check mb-3">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="verified-only"
                    checked={verifiedOnly}
                    onChange={handleVerifiedChange}
                />
                <label className="form-check-label" htmlFor="verified-only">
                  Только проверенные
                </label>
              </div>

              <hr />

              {/* Фильтр по навыкам (тэгам) */}
              <div className="mb-3">
                <strong>Навыки</strong>
                <SkillsInput
                    id="skills"
                    name="skills"
                    value={selectedSkills}
                    onChange={handleSkillsChange}
                    placeholder="React, Node.js, Figma..."
                    autoAddNewSkills={true}
                />
              </div>

              <hr />

              {/* Фильтр по опыту */}
              <div className="mb-3">
                <strong>Опыт (лет)</strong>
                <div className="mb-2">
                  <label htmlFor="min-exp" className="form-label small">
                    Мин
                  </label>
                  <input
                      type="number"
                      id="min-exp"
                      className="form-control"
                      placeholder="0"
                      value={minExperience}
                      onChange={handleMinExpChange}
                      disabled={noExperience}
                      min="0"
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="max-exp" className="form-label small">
                    Макс
                  </label>
                  <input
                      type="number"
                      id="max-exp"
                      className="form-control"
                      placeholder="∞"
                      value={maxExperience}
                      onChange={handleMaxExpChange}
                      disabled={noExperience}
                      min="0"
                  />
                </div>
                <div className="form-check">
                  <input
                      className="form-check-input"
                      type="checkbox"
                      id="no-exp"
                      checked={noExperience}
                      onChange={handleNoExpChange}
                  />
                  <label className="form-check-label" htmlFor="no-exp">
                    Без опыта
                  </label>
                </div>
              </div>

              <hr />

              {/* Фильтр по городу */}
              <div className="mb-3">
                <strong>Город</strong>
                <input
                    type="text"
                    name="city"
                    value={selectedCity}
                    onChange={handleSelectedCityChange}
                    className="form-control"
                    placeholder="Введите город"
                />
              </div>

              <button
                  type="button"
                  className="btn btn-outline-primary w-100 mt-2"
                  onClick={resetFilters}
              >
                Сбросить фильтры
              </button>
            </div>
          </div>

          {/* Блок Поиска + Результатов */}
          <div className="col-lg-9">
            {/* Поле поиска */}
            <div className="mb-4">
              <input
                  type="search"
                  className="form-control"
                  placeholder="Поиск по имени или должности..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Поиск резюме"
              />
            </div>

            {/* Loading/Error */}
            {loading && <div className="alert alert-info">Загрузка резюме...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Результаты */}
            {!loading && !error && (
                <>
                  {filteredResumes.length > 0 ? (
                      <div>{filteredResumes.map(renderResumeCard)}</div>
                  ) : (
                      <div className="alert alert-warning text-center">
                        По вашему запросу ничего не найдено.
                        <br />
                        Попробуйте изменить запрос или сбросить фильтры.
                      </div>
                  )}
                </>
            )}
          </div>
        </div>
      </div>
  );
};

export default Search;
