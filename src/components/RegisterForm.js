import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Подключаем SVG иконки как React компоненты
import { ReactComponent as PasswordIcon } from '../images/password.svg';
import { ReactComponent as EmailIcon } from '../images/mail.svg';
// import { ReactComponent as UserIcon } from '../images/user.svg'; // Если есть иконка пользователя

export const RegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!name || !email || !password || !confirmPassword) {
             setError('Пожалуйста, заполните все обязательные поля.'); return;
        }
        if (password !== confirmPassword) {
            setError('Пароли не совпадают.'); return;
        }
        if (password.length < 6) { // Добавим проверку длины и здесь
            setError('Пароль должен быть не менее 6 символов.'); return;
        }

        try {
            const result = await register(name, email, password);
            setSuccessMessage(result.message + ' Теперь вы можете войти.');
            // Очистка формы
            setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
            // Редирект на логин через 2 сек
            setTimeout(() => { navigate('/login'); }, 2000);
        } catch (err) {
            setError(err.message || 'Ошибка при регистрации.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-left mb-4">Регистрация</h2>

                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}

                            <form onSubmit={handleSubmit}>
                                {/* Имя */}
                                <div className="mb-3">
                                     <label htmlFor="register-name" className="form-label">Имя <span className="text-primary">*</span></label>
                                     <div className="input-group">
                                         <div className="input-group-text"><span>👤</span></div> {/* Используем символ, если нет UserIcon */}
                                         <input type="text" id="register-name" className="form-control" placeholder="Ваше имя..." value={name} onChange={(e) => setName(e.target.value)} required />
                                     </div>
                                 </div>
                                 {/* Email */}
                                 <div className="mb-3">
                                     <label htmlFor="register-email" className="form-label">E-mail <span className="text-primary">*</span></label>
                                     <div className="input-group">
                                         <div className="input-group-text"><EmailIcon/></div> {/* Используем SVG иконку */}
                                         <input type="email" id="register-email" className="form-control" placeholder="Ваш e-mail..." value={email} onChange={(e) => setEmail(e.target.value)} required />
                                     </div>
                                 </div>
                                 {/* Пароль */}
                                 <div className="mb-3">
                                     <label htmlFor="register-password" className="form-label">Пароль <span className="text-primary">*</span></label>
                                     <div className="input-group">
                                         <div className="input-group-text"><PasswordIcon/></div> {/* Используем SVG иконку */}
                                         <input type="password" id="register-password" className="form-control" placeholder="Придумайте пароль (мин. 6 симв)..." value={password} onChange={(e) => setPassword(e.target.value)} required />
                                     </div>
                                 </div>
                                 {/* Подтверждение Пароля */}
                                 <div className="mb-3">
                                     <label htmlFor="register-confirmPassword" className="form-label">Подтвердите пароль <span className="text-primary">*</span></label>
                                     <div className="input-group">
                                          <div className="input-group-text"><PasswordIcon/></div> {/* Используем SVG иконку */}
                                         <input type="password" id="register-confirmPassword" className="form-control" placeholder="Повторите пароль..." value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                     </div>
                                 </div>
                                {/* Кнопка */}
                                <button type="submit" className="btn btn-primary w-100">
                                    Зарегистрироваться
                                </button>
                                {/* Ссылка на вход */}
                                <div className="auth-link text-center mt-3">
                                    Уже есть аккаунт?{' '}
                                    <Link to="/login">Войти</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};