import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Подключаем SVG иконки как React компоненты
import { ReactComponent as PasswordIcon } from '../images/password.svg';
import { ReactComponent as EmailIcon } from '../images/mail.svg';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    // const [rememberMe, setRememberMe] = useState(false); // Чекбокс пока не используется
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
             await login(email, password);
             // Успешный вход - редирект обычно происходит из AuthContext/PrivateRoute
        } catch (err) {
            console.error("Ошибка входа:", err);
            setError(err.message || 'Произошла ошибка при входе.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-left mb-4">Вход в аккаунт</h2>
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                {/* Email */}
                                <div className="mb-3">
                                    <label htmlFor="login-email" className="form-label">E-mail <span className="text-primary">*</span></label>
                                    <div className="input-group">
                                        <div className="input-group-text"><EmailIcon/></div> {/* SVG иконка */}
                                        <input type="email" id="login-email" className="form-control" placeholder="Введите e-mail..." value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                </div>
                                {/* Пароль */}
                                <div className="mb-3">
                                    <label htmlFor="login-password" className="form-label">Пароль <span className="text-primary">*</span></label>
                                    <div className="input-group">
                                         <div className="input-group-text"><PasswordIcon/></div> {/* SVG иконка */}
                                        <input type="password" id="login-password" className="form-control" placeholder="Введите пароль..." value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                </div>
                                {/* Чекбокс пока не работает
                                <div className="form-check mb-3">
                                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                                    <label className="form-check-label" htmlFor="rememberMe">Сохранить вход</label>
                                </div>
                                */}
                                {/* Кнопка */}
                                <button type="submit" className="btn btn-primary w-100">
                                    Войти в аккаунт
                                </button>
                                {/* Ссылка на регистрацию */}
                                <div className="auth-link text-center mt-3">
                                    Нет аккаунта?{' '}
                                    <Link to="/register">Регистрация</Link> {/* Используем Link */}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
// export default LoginForm; // Если что используется именованный экспорт