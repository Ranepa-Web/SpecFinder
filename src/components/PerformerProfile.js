import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const PROFILE_STORAGE_KEY = 'performerProfile_'; // Префикс ключа

// --- Вспомогательная функция ---
const getInitialProfileData = (currentUser) => {
    if (!currentUser || !currentUser.id) {
        return { name: '', email: '', profession: '', location: '', about: '', skills: [], avatar: 'https://i.pravatar.cc/150?u=default' };
    }
    const userProfileKey = `${PROFILE_STORAGE_KEY}${currentUser.id}`;
    const savedProfile = localStorage.getItem(userProfileKey);
    if (savedProfile) {
        try { return JSON.parse(savedProfile); }
        catch (e) { console.error("Ошибка парсинга профиля:", e); }
    }
    return {
        name: currentUser.name || '', email: currentUser.email || '', profession: '', location: '',
        about: '', skills: [], avatar: `https://i.pravatar.cc/150?u=${currentUser.email || currentUser.id}`
    };
};
// --- Конец вспомогательной функции ---

function PerformerProfile() {
    const { currentUser, loading: authLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState(null);

    // Эффект №1: Загрузка профиля
    useEffect(() => {
        if (!authLoading && currentUser) {
            const initialProfile = getInitialProfileData(currentUser);
            setProfile(initialProfile);
            setFormData(initialProfile);
        } else if (!authLoading && !currentUser) {
             setProfile(null); setFormData(null);
        }
    }, [currentUser, authLoading]);

    // Эффект №2: Синхронизация формы при отмене
     useEffect(() => {
        if (!isEditing && profile) { setFormData({ ...profile }); }
    }, [isEditing, profile]);

    // --- Обработчики ---
    const handleEdit = () => { if (profile) { setFormData({ ...profile }); setIsEditing(true); } };
    const handleCancel = () => { setIsEditing(false); };
    const handleSave = () => {
        if (!currentUser || !formData) return;
        const userProfileKey = `${PROFILE_STORAGE_KEY}${currentUser.id}`;
        const updatedProfile = { ...formData };
        setProfile(updatedProfile);
        try { localStorage.setItem(userProfileKey, JSON.stringify(updatedProfile)); }
        catch (e) { console.error("Ошибка сохранения профиля:", e); }
        setIsEditing(false);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (prev ? { ...prev, [name]: value } : null));
    };
    const handleSkillsChange = (e) => {
        const value = e.target.value;
        setFormData(prev => (prev ? { ...prev, skills: value.split(',').map(s => s.trim()).filter(s => s !== '') } : null));
    };

    // --- Рендеринг ---
    if (authLoading) { return <div className="performer-profile-container base"><p>Проверка аутентификации...</p></div>; }
    if (!currentUser) { return <div className="performer-profile-container base"><p>Пожалуйста, войдите...</p></div>; }
    if (!profile || !formData) { return <div className="performer-profile-container base"><p>Загрузка данных профиля...</p></div>; }

    return (
        <div className="performer-profile-container base">
            <img src={profile.avatar} alt="avatar" className="profile-avatar" />
            {isEditing ? (
                <form className="profile-edit-form" onSubmit={(e)=>{ e.preventDefault(); handleSave(); }}>
                    <div className="mb-3">
                        <label htmlFor="profile-name" className="form-label">Имя</label>
                        <input type="text" id="profile-name" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="profile-email" className="form-label">Email</label>
                        <input type="email" id="profile-email" className="form-control" name="email" value={formData.email} readOnly disabled style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }} />
                    </div>
                     <div className="mb-3">
                        <label htmlFor="profile-profession" className="form-label">Профессия</label>
                        <input type="text" id="profile-profession" className="form-control" name="profession" value={formData.profession} onChange={handleChange} placeholder="Ваша профессия"/>
                    </div>
                     <div className="mb-3">
                        <label htmlFor="profile-location" className="form-label">Город</label>
                        <input type="text" id="profile-location" className="form-control" name="location" value={formData.location} onChange={handleChange} placeholder="Город, Страна" />
                    </div>
                     <div className="mb-3">
                         <label htmlFor="profile-about" className="form-label">О себе</label>
                         <textarea id="profile-about" className="form-control profile-textarea" name="about" value={formData.about} onChange={handleChange} placeholder="Расскажите о себе..." />
                    </div>
                    <div className="mb-3">
                         <label htmlFor="profile-skills" className="form-label">Навыки (через запятую)</label>
                         <input type="text" id="profile-skills" className="form-control" name="skills" value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''} onChange={handleSkillsChange} placeholder="React, JavaScript, CSS..." />
                    </div>
                    <div className="profile-actions">
                        <button type="submit" className="btn button_blue_m">Сохранить</button>
                        <button type="button" onClick={handleCancel} className="btn button_gray_m">Отмена</button>
                    </div>
                </form>
            ) : (
                 <div className="profile-view-section">
                    <h2>{profile.name}</h2>
                    <p className="profile-view-email"><strong>Email:</strong> {profile.email}</p>
                    {profile.profession && <p><strong>Профессия:</strong> {profile.profession}</p>}
                    {profile.location && <p><strong>Город:</strong> {profile.location}</p>}
                    {profile.about && <p><strong>О себе:</strong> {profile.about}</p>}
                    {Array.isArray(profile.skills) && profile.skills.length > 0 && ( <p><strong>Навыки:</strong> {profile.skills.join(', ')}</p> )}
                    <div className="profile-actions">
                         <button onClick={handleEdit} className="btn button_blue_m">Редактировать</button>
                    </div>
                </div>
            )}
        </div>
    );
}
export default PerformerProfile;