// src/constants.js
export const LOCAL_STORAGE_KEYS = {
  USER_DATA: "user_data",
  ALL_USERS: "all_users",
  SEARCH_ITEMS: "search_items",
  VACANCIES: "vacancies",
  APPLICATIONS: "applications",
}

export const PROFILE_TYPES = {
  APPLICANT: "jobseeker", // Соискательь
  EMPLOYER: "employer", // Работодатель
}

// Данные о команде для страницы "О нас"
export const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Ильин Никита Алексеевич",
    role: "Руководитель проекта",
    description: "Отвечает за общее управление проектом, координацию команды и стратегическое развитие платформы.",
    image: "/images/nikita.jpeg",
  },
  {
    id: 2,
    name: "Синявский Иван Владимирович",
    role: "Frontend-разработчик",
    description: "Отвечает за разработку пользовательского интерфейса и клиентской части приложения.",
    image: "/images/ivan.jpeg",
  },
  {
    id: 3,
    name: "Кондратьев Роман Михайлович",
    role: "Backend-разработчик",
    description: "Отвечает за серверную часть приложения, базы данных и API.",
    image: "/images/roma.jpeg",
  },
  {
    id: 4,
    name: "Сайдулаев Расул Джабраилович",
    role: "UI/UX дизайнер",
    description: "Отвечает за дизайн интерфейса, пользовательский опыт и визуальную составляющую проекта.",
    image: "/images/rasul.png",
  },
]

// Отзывы для страницы "Отзывы"
export const REVIEWS = [
  {
    id: 1,
    name: "Алексей Петров",
    company: "ООО 'ТехноСтарт'",
    isEmployer: true,
    rating: 5,
    text: "Отличный сервис для поиска специалистов! Нашли разработчика за 2 дня, очень довольны качеством работы.",
    date: "2025-04-22",
  },
  {
    id: 2,
    name: "Мария Иванова",
    position: "Графический дизайнер",
    isEmployer: false,
    rating: 4,
    text: "Благодаря SpecFinder я нашла работу мечты. Удобный интерфейс и много актуальных вакансий.",
    date: "2025-04-15",
  },
  {
    id: 3,
    name: "Сергей Николаев",
    company: "Студия 'Креатив'",
    isEmployer: true,
    rating: 5,
    text: "Уже второй раз находим сотрудников через этот сервис. Быстро, удобно и без лишних затрат.",
    date: "2025-04-10",
  },
  {
    id: 4,
    name: "Екатерина Смирнова",
    position: "Frontend-разработчик",
    isEmployer: false,
    rating: 5,
    text: "Нашла работу за неделю после регистрации. Очень удобная система фильтрации вакансий.",
    date: "2025-04-22",
  },
  {
    id: 5,
    name: "Дмитрий Козлов",
    company: "ИП Козлов Д.А.",
    isEmployer: true,
    rating: 4,
    text: "Хороший сервис, но хотелось бы больше функций для проверки кандидатов. В целом доволен результатом.",
    date: "2025-04-05",
  },
  {
    id: 6,
    name: "Анна Соколова",
    position: "Копирайтер",
    isEmployer: false,
    rating: 4,
    text: "Удобный сайт, много предложений. Единственный минус - иногда попадаются неактуальные вакансии.",
    date: "2025-04-20",
  },
]
