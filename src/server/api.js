// src/server/api.js

// Функция для получения данных из db.json
export const fetchData = async (endpoint) => {
  try {
    // В реальном приложении здесь был бы запрос к API
    // Для демонстрации используем localStorage как имитацию db.json
    const data = localStorage.getItem(`db_${endpoint}`)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Ошибка при получении данных из ${endpoint}:`, error)
    throw error
  }
}

// Функция для создания новых данных
export const createData = async (endpoint, data) => {
  try {
    // Получаем текущие данные
    const currentData = await fetchData(endpoint)

    // Добавляем новые данные
    const updatedData = [...currentData, data]

    // Сохраняем обновленные данные
    localStorage.setItem(`db_${endpoint}`, JSON.stringify(updatedData))

    return data
  } catch (error) {
    console.error(`Ошибка при создании данных в ${endpoint}:`, error)
    throw error
  }
}

// Функция для обновления данных
export const updateData = async (endpoint, id, data) => {
  try {
    // Получаем текущие данные
    const currentData = await fetchData(endpoint)

    // Находим индекс элемента для обновления
    const index = currentData.findIndex((item) => item.id === id)

    if (index === -1) {
      throw new Error(`Элемент с id ${id} не найден в ${endpoint}`)
    }

    // Обновляем данные
    const updatedData = [...currentData.slice(0, index), data, ...currentData.slice(index + 1)]

    // Сохраняем обновленные данные
    localStorage.setItem(`db_${endpoint}`, JSON.stringify(updatedData))

    return data
  } catch (error) {
    console.error(`Ошибка при обновлении данных в ${endpoint}:`, error)
    throw error
  }
}

// Функция для удаления данных
export const deleteData = async (endpoint, id) => {
  try {
    // Получаем текущие данные
    const currentData = await fetchData(endpoint)

    // Фильтруем данные, исключая элемент с указанным id
    const updatedData = currentData.filter((item) => item.id !== id)

    // Сохраняем обновленные данные
    localStorage.setItem(`db_${endpoint}`, JSON.stringify(updatedData))

    return { success: true }
  } catch (error) {
    console.error(`Ошибка при удалении данных из ${endpoint}:`, error)
    throw error
  }
}

// Функция для инициализации базы данных
export const initializeDatabase = () => {
  // Проверяем, инициализирована ли уже база данных
  if (localStorage.getItem("db_initialized")) {
    return
  }

  // Текущая дата для использования в данных
  const currentDate = new Date("2025-04-22").toISOString()
  const oneWeekAgo = new Date("2025-04-15").toISOString()
  const twoWeeksAgo = new Date("2025-04-08").toISOString()
  const oneMonthAgo = new Date("2025-03-22").toISOString()

  // Пример данных для инициализации
  const initialData = {
    users: [
      {
        id: 1,
        name: "Иван Петров",
        email: "ivan@example.com",
        password: "password123",
        userType: "jobseeker",
        profile: {
          position: "Frontend-разработчик",
          skills: ["JavaScript", "React", "CSS"],
          experience: "3-5",
          education: "Высшее техническое",
          about: "Опытный frontend-разработчик с 4-летним стажем работы.",
          contacts: {
            phone: "+7 (999) 123-45-67",
            telegram: "@ivanpetrov",
            linkedin: "linkedin.com/in/ivanpetrov",
          },
          resume: null,
          appliedJobs: [],
        },
      },
      {
        id: 2,
        name: "ООО ТехноСтарт",
        email: "hr@technostart.com",
        password: "company123",
        userType: "employer",
        profile: {
          companyName: "ООО ТехноСтарт",
          industry: "IT",
          companySize: "50-100",
          description: "Компания, специализирующаяся на разработке веб-приложений.",
          website: "technostart.com",
          contacts: {
            phone: "+7 (495) 123-45-67",
            email: "hr@technostart.com",
            address: "г. Москва, ул. Примерная, д. 1",
          },
          postedJobs: [],
        },
      },
      {
        id: 3,
        name: "Дизайн Студия",
        email: "design@example.com",
        password: "design123",
        userType: "employer",
        profile: {
          companyName: "Дизайн Студия",
          industry: "Дизайн",
          companySize: "10-50",
          description: "Креативная студия дизайна, специализирующаяся на UI/UX дизайне.",
          website: "designstudio.com",
          contacts: {
            phone: "+7 (812) 987-65-43",
            email: "design@example.com",
            address: "г. Санкт-Петербург, ул. Дизайнерская, д. 5",
          },
          postedJobs: [],
        },
      },
    ],
    vacancies: [
      {
        id: 1,
        title: "Frontend-разработчик",
        company: "ООО ТехноСтарт",
        salary: "120000 - 150000",
        location: "Москва",
        remote: true,
        description:
          "Требуется опытный frontend-разработчик для работы над крупным веб-приложением. Опыт работы с React от 2 лет. Полная занятость, возможна удаленная работа.",
        requirements: ["React", "JavaScript", "CSS", "HTML5"],
        date: oneWeekAgo,
        authorId: 2,
        applications: [],
      },
      {
        id: 2,
        title: "Backend-разработчик",
        company: "ООО ТехноСтарт",
        salary: "150000 - 180000",
        location: "Москва",
        remote: true,
        description:
          "Требуется опытный backend-разработчик для работы над API. Опыт работы с Node.js от 3 лет. Полная занятость, возможна частичная удаленная работа.",
        requirements: ["Node.js", "Express", "MongoDB", "REST API"],
        date: twoWeeksAgo,
        authorId: 2,
        applications: [],
      },
      {
        id: 3,
        title: "UI/UX дизайнер",
        company: "Дизайн Студия",
        salary: "100000 - 130000",
        location: "Санкт-Петербург",
        remote: false,
        description:
          "Требуется креативный UI/UX дизайнер для работы над мобильными приложениями. Полная занятость, офис в центре города.",
        requirements: ["Figma", "Adobe XD", "Sketch", "Прототипирование"],
        date: currentDate,
        authorId: 3,
        applications: [],
      },
      {
        id: 4,
        title: "DevOps инженер",
        company: "ООО ТехноСтарт",
        salary: "180000 - 220000",
        location: "Москва",
        remote: true,
        description:
          "Ищем опытного DevOps инженера для настройки и поддержки инфраструктуры. Опыт работы с Docker, Kubernetes от 2 лет. Полная занятость, возможна удаленная работа.",
        requirements: ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux"],
        date: oneWeekAgo,
        authorId: 2,
        applications: [],
      },
      {
        id: 5,
        title: "Графический дизайнер",
        company: "Дизайн Студия",
        salary: "80000 - 110000",
        location: "Санкт-Петербург",
        remote: true,
        description:
          "Требуется графический дизайнер для создания маркетинговых материалов. Частичная занятость, возможна удаленная работа.",
        requirements: ["Adobe Photoshop", "Adobe Illustrator", "CorelDRAW"],
        date: oneMonthAgo,
        authorId: 3,
        applications: [],
      },
      {
        id: 6,
        title: "Product Manager",
        company: "ООО ТехноСтарт",
        salary: "200000 - 250000",
        location: "Москва",
        remote: false,
        description:
          "Ищем опытного Product Manager для развития продуктовой линейки компании. Опыт работы от 3 лет. Полная занятость, офис в бизнес-центре.",
        requirements: ["Управление продуктом", "Agile", "Scrum", "Аналитика"],
        date: twoWeeksAgo,
        authorId: 2,
        applications: [],
      },
      {
        id: 7,
        title: "Junior Frontend-разработчик",
        company: "ООО ТехноСтарт",
        salary: "80000 - 100000",
        location: "Москва",
        remote: true,
        description:
          "Ищем начинающего frontend-разработчика для работы над веб-приложениями. Опыт работы не требуется, но нужно базовое знание HTML, CSS и JavaScript. Полная занятость, возможна удаленная работа.",
        requirements: ["HTML", "CSS", "JavaScript", "Базовые знания React"],
        date: currentDate,
        authorId: 2,
        applications: [],
      },
      {
        id: 8,
        title: "Стажер-дизайнер",
        company: "Дизайн Студия",
        salary: "50000 - 70000",
        location: "Санкт-Петербург",
        remote: false,
        description:
          "Приглашаем на стажировку начинающих дизайнеров. Без опыта работы, но с базовыми знаниями графических редакторов. Стажировка с возможностью дальнейшего трудоустройства.",
        requirements: ["Adobe Photoshop", "Figma", "Базовые знания дизайна"],
        date: oneWeekAgo,
        authorId: 3,
        applications: [],
      },
    ],
    applications: [],
    reviews: [
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
    ],
  }

  // Сохраняем начальные данные в localStorage
  Object.entries(initialData).forEach(([key, value]) => {
    localStorage.setItem(`db_${key}`, JSON.stringify(value))
  })

  // Отмечаем, что база данных инициализирована
  localStorage.setItem("db_initialized", "true")
}
