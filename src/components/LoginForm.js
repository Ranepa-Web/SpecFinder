import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ReactComponent as PasswordIcon } from '../images/password.svg';
import { ReactComponent as EmailIcon } from '../images/mail.svg';

export const LoginForm = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-left mb-4">Вход в аккаунт</h2>
                            <form onSubmit={handleSubmit}>
                                {/* Поле Email */}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label font-extrabold text-dark">
                                        E-mail <span className="text-primary">*</span>
                                    </label>
                                    <div className="input-group mb-3">
                                        <div className="input-group-text">
                                            <EmailIcon/>
                                        </div>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="Введите e-mail..."
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Поле Пароль */}
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                    Пароль <span className="text-primary">*</span>
                                    </label>
                                    <div className="input-group mb-3">
                                        <div className="input-group-text">
                                            <PasswordIcon/>
                                        </div>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="Введите пароль..."
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Чекбокс "Сохранить вход" */}
                                <div className="form-check mb-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="rememberMe"
                                    />
                                    <label className="form-check-label" htmlFor="rememberMe">
                                        Сохранить вход
                                    </label>
                                </div>

                                {/* Кнопка входа */}
                                <button type="submit" className="btn btn-primary">
                                    Войти в аккаунт
                                </button>

                                {/* Ссылка на регистрацию */}
                                <div className="auth-link mt-3">
                                    Нет аккаунта? <a href="/register">Регистрация</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};