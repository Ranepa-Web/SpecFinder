import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // Можно раскомментировать для редиректов

// --- Ключи для localStorage ---
const USER_DATA_KEY = 'specfinder_currentUser'; // Для данных текущего пользователя
const ALL_USERS_KEY = 'specfinder_users';      // Для списка всех "зарегистрированных"

// --- Контекст ---
const AuthContext = createContext(null);

// --- Хук для доступа к контексту ---
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth должен использоваться внутри AuthProvider');
    }
    return context;
}

// --- Вспомогательные функции для localStorage списка пользователей ---
const getUsersFromStorage = () => {
    const usersJson = localStorage.getItem(ALL_USERS_KEY);
    try { return usersJson ? JSON.parse(usersJson) : []; }
    catch (error) { console.error("Ошибка парсинга:", error); return []; }
};
const saveUsersToStorage = (users) => {
    try { localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users)); }
    catch (error) { console.error("Ошибка сохранения:", error); }
};
// --- Конец вспомогательных функций ---

// --- Компонент Провайдер ---
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // const navigate = useNavigate();

    // Статус аутентификации вычисляется из currentUser
    const isAuthenticated = !!currentUser;

    // Восстановление состояния при загрузке
    useEffect(() => {
        setLoading(true);
        let userToSet = null;
        try {
            const userDataJson = localStorage.getItem(USER_DATA_KEY);
            if (userDataJson) { userToSet = JSON.parse(userDataJson); }
        } catch (error) {
            console.error("Ошибка восстановления currentUser:", error);
            localStorage.removeItem(USER_DATA_KEY);
        } finally {
            setCurrentUser(userToSet);
            setLoading(false);
            console.log('AuthProvider: Проверка завершена. currentUser:', userToSet);
        }
    }, []);

    // Функция ВХОДА
    const login = useCallback(async (email, password) => {
        console.log('Вход (localStorage):', email);
        await new Promise(resolve => setTimeout(resolve, 100)); // Имитация

        const users = getUsersFromStorage();
        const user = users.find(u => u.email === email);

        // НЕБЕЗОПАСНОЕ СРАВНЕНИЕ ПАРОЛЯ  Только для демо сделал если что
        if (user && user.password === password) {
            const userData = { id: user.id, name: user.name, email: user.email };
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
            setCurrentUser(userData);
            console.log('Успешный вход для:', userData);
            return userData;
        } else {
            localStorage.removeItem(USER_DATA_KEY);
            setCurrentUser(null);
            throw new Error('Неверный email или пароль.');
        }
    }, []);

    // Функция ВЫХОДА
    const logout = useCallback(() => {
        console.log('Выход (localStorage)');
        localStorage.removeItem(USER_DATA_KEY);
        setCurrentUser(null);
        // navigate('/login');
    }, []);

    // Функция РЕГИСТРАЦИИ
    const register = useCallback(async (name, email, password) => {
        console.log('Регистрация (localStorage):', name, email);
        await new Promise(resolve => setTimeout(resolve, 100));

        const users = getUsersFromStorage();
        if (users.some(user => user.email === email)) {
            throw new Error('Этот email уже зарегистрирован.');
        }
        if (!name || !email || !password) {
             throw new Error('Все поля обязательны для регистрации.');
        }
         if (password.length < 6) {
             throw new Error('Пароль должен быть не менее 6 символов.');
        }

        // НЕБЕЗОПАСНОЕ ХРАНЕНИЕ ПАРОЛЯ ЕСЛИ ЧТО
        const newUser = { id: Date.now(), name, email, password };
        const updatedUsers = [...users, newUser];
        saveUsersToStorage(updatedUsers);

        console.log('Пользователь добавлен в', ALL_USERS_KEY, ':', newUser);
        // Не логиним пользователя автоматически
        return { success: true, message: 'Регистрация успешна.' };
    }, []);

    // Значение контекста
    const value = { currentUser, isAuthenticated, loading, login, logout, register };

    // Не рендерим детей, пока идет загрузка
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}