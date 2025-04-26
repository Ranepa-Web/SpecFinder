// src/components/ApplicantProfile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Путь к вашему AuthContext

// --- Ключ для localStorage (отличается от профиля исполнителя) ---
const PROFILE_STORAGE_KEY = 'applicantProfile_'; // Префикс ключа для соискателя

// --- Вспомогательная функция для получения начальных данных профиля ---
const getInitialProfileData = (currentUser) => {
    if (!currentUser || !currentUser.id) {
        // Значения по умолчанию, если нет пользователя
        return {
            name: '',
            email: '',
            desiredRole: '', // Вместо 'profession'
            location: '',
            summary: '',     // Вместо 'about'
            skills: [],
            avatar: 'https://i.pravatar.cc/150?u=default-applicant' // Можно другой дефолтный аватар
        };
    }
    // Ключ для конкретного пользователя
    const userProfileKey = `${PROFILE_STORAGE_KEY}${currentUser.id}`;
    const savedProfile = localStorage.getItem(userProfileKey);

    if (savedProfile) {
        try {
            // Пытаемся загрузить сохраненный профиль
            return JSON.parse(savedProfile);
        } catch (e) {
            console.error("Ошибка парсинга профиля соискателя:", e);
            // Если ошибка, удаляем некорректные данные
            localStorage.removeItem(userProfileKey);
        }
    }

    // Если нет сохраненного профиля, создаем базовый на основе currentUser
    return {
        name: currentUser.name || '',
        email: currentUser.email || '',
        desiredRole: '', // Поле пустое по умолчанию
        location: '',    // Поле пустое по умолчанию
        summary: '',     // Поле пустое по умолчанию
        skills: [],
        // Генерируем аватар на основе email или id
        avatar: `https://i.pravatar.cc/150?u=applicant-${currentUser.email || currentUser.id}`
    };
};
// --- Конец вспомогательной функции ---

function ApplicantProfile() {
    const { currentUser, loading: authLoading } = useAuth(); // Получаем текущего пользователя и статус загрузки
    const [isEditing, setIsEditing] = useState(false);      // Состояние: редактируется ли профиль?
    const [profile, setProfile] = useState(null);           // Данные профиля для отображения
    const [formData, setFormData] = useState(null);         // Данные профиля для формы редактирования

    // Эффект №1: Загрузка данных профиля при монтировании или изменении пользователя
    useEffect(() => {
        if (!authLoading && currentUser) {
            const initialProfile = getInitialProfileData(currentUser);
            setProfile(initialProfile);
            setFormData(initialProfile); // Инициализируем и форму
        } else if (!authLoading && !currentUser) {
            // Если пользователь не аутентифицирован, сбрасываем профиль
             setProfile(null);
             setFormData(null);
        }
        // Зависимости: currentUser и authLoading
    }, [currentUser, authLoading]);

    // Эффект №2: Синхронизация данных формы при отмене редактирования
     useEffect(() => {
        // Если вышли из режима редактирования и профиль существует,
        // обновляем formData данными из profile (отменяем изменения)
        if (!isEditing && profile) {
            setFormData({ ...profile });
        }
        // Зависимости: isEditing и profile
    }, [isEditing, profile]);

    // --- Обработчики событий ---
    // Вход в режим редактирования
    const handleEdit = () => {
        if (profile) {
            // Копируем текущий профиль в formData перед редактированием
            setFormData({ ...profile });
            setIsEditing(true);
        }
    };

    // Отмена редактирования
    const handleCancel = () => {
        setIsEditing(false);
        // Данные формы автоматически сбросятся благодаря Эффекту №2
    };

    // Сохранение изменений
    const handleSave = () => {
        if (!currentUser || !formData) return; // Проверка на всякий случай

        // Ключ для localStorage
        const userProfileKey = `${PROFILE_STORAGE_KEY}${currentUser.id}`;
        const updatedProfile = { ...formData }; // Берем данные из формы

        setProfile(updatedProfile); // Обновляем отображаемый профиль

        try {
            // Сохраняем обновленный профиль в localStorage
            localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile));
        } catch (e) {
            console.error("Ошибка сохранения профиля соискателя:", e);
        }

        setIsEditing(false); // Выходим из режима редактирования
    };

    // Обработчик изменения текстовых полей
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Обновляем formData, сохраняя предыдущие значения
        setFormData(prev => (prev ? { ...prev, [name]: value } : null));
    };

    // Обработчик изменения поля навыков (строка -> массив)
    const handleSkillsChange = (e) => {
        const value = e.target.value;
        // Преобразуем строку "skill1, skill2, skill3" в массив ['skill1', 'skill2', 'skill3']
        const skillsArray = value.split(',')         // Разделяем по запятой
                              .map(s => s.trim())     // Убираем пробелы по краям
                              .filter(s => s !== ''); // Удаляем пустые строки
        setFormData(prev => (prev ? { ...prev, skills: skillsArray } : null));
    };

    // --- Рендеринг компонента ---
    // Пока идет проверка аутентификации
    if (authLoading) {
        return <div className="applicant-profile-container base"><p>Проверка аутентификации...</p></div>;
    }
    // Если пользователь не вошел
    if (!currentUser) {
        return <div className="applicant-profile-container base"><p>Пожалуйста, войдите, чтобы увидеть профиль.</p></div>;
    }
    // Если данные профиля еще не загружены (маловероятно после authLoading, но для полноты)
    if (!profile || !formData) {
        return <div className="applicant-profile-container base"><p>Загрузка данных профиля...</p></div>;
    }

    // Основной рендер: режим просмотра или редактирования
    return (
        // Используем класс applicant-profile-container для возможной стилизации
        <div className="applicant-profile-container base">
            <img src={profile.avatar} alt="avatar" className="profile-avatar" />

            {isEditing ? (
                // --- Форма Редактирования ---
                <form className="profile-edit-form" onSubmit={(e)=>{ e.preventDefault(); handleSave(); }}>
                    {/* Имя */}
                    <div className="mb-3">
                        <label htmlFor="profile-name" className="form-label">Имя</label>
                        <input type="text" id="profile-name" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    {/* Email (только для чтения) */}
                    <div className="mb-3">
                        <label htmlFor="profile-email" className="form-label">Email</label>
                        <input type="email" id="profile-email" className="form-control" name="email" value={formData.email} readOnly disabled style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }} />
                    </div>
                     {/* Желаемая должность */}
                     <div className="mb-3">
                        <label htmlFor="profile-desiredRole" className="form-label">Желаемая должность / Профессия</label>
                        <input type="text" id="profile-desiredRole" className="form-control" name="desiredRole" value={formData.desiredRole} onChange={handleChange} placeholder="Frontend-разработчик, Дизайнер..." />
                    </div>
                     {/* Город */}
                     <div className="mb-3">
                        <label htmlFor="profile-location" className="form-label">Город</label>
                        <input type="text" id="profile-location" className="form-control" name="location" value={formData.location} onChange={handleChange} placeholder="Город, Страна" />
                    </div>
                     {/* О себе / Резюме */}
                     <div className="mb-3">
                         <label htmlFor="profile-summary" className="form-label">О себе / Резюме</label>
                         <textarea id="profile-summary" className="form-control profile-textarea" name="summary" value={formData.summary} onChange={handleChange} placeholder="Кратко опишите ваш опыт и цели..." />
                    </div>
                    {/* Навыки */}
                    <div className="mb-3">
                         <label htmlFor="profile-skills" className="form-label">Ключевые навыки (через запятую)</label>
                         {/* Преобразуем массив обратно в строку для input */}
                         <input type="text" id="profile-skills" className="form-control" name="skills" value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''} onChange={handleSkillsChange} placeholder="React, Node.js, Figma..." />
                    </div>
                    {/* Кнопки Сохранить/Отмена */}
                    <div className="profile-actions">
                        <button type="submit" className="btn button_blue_m">Сохранить</button>
                        <button type="button" onClick={handleCancel} className="btn button_gray_m">Отмена</button>
                    </div>
                </form>
            ) : (
                 // --- Режим Просмотра ---
                 <div className="profile-view-section">
                    <h2>{profile.name}</h2>
                    <p className="profile-view-email"><strong>Email:</strong> {profile.email}</p>
                    {/* Отображаем поля, только если они заполнены */}
                    {profile.desiredRole && <p><strong>Желаемая должность:</strong> {profile.desiredRole}</p>}
                    {profile.location && <p><strong>Город:</strong> {profile.location}</p>}
                    {profile.summary && <p><strong>О себе:</strong> {profile.summary}</p>}
                    {/* Отображаем навыки, только если массив не пустой */}
                    {Array.isArray(profile.skills) && profile.skills.length > 0 && (
                        <p><strong>Навыки:</strong> {profile.skills.join(', ')}</p>
                    )}
                    {/* Кнопка Редактировать */}
                    <div className="profile-actions">
                         <button onClick={handleEdit} className="btn button_blue_m">Редактировать профиль</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Экспортируем компонент по умолчанию
export default ApplicantProfile;