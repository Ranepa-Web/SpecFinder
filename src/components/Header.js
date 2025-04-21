import React from 'react';
import { Link } from "react-router-dom"; // Используем Link

export const Header = ({ isAuthenticated, onLogout }) => {
    return (
        <div className="container">
            <header>
                {/* Логотип */}
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h4>SpecFinder</h4>
                </Link>
                {/* Навигация */}
                <div className="header-nav">
                    {isAuthenticated ? (
                        <> {/* Вошел */}
                            <Link to="/profile" className="btn button_h4">
                                Профиль
                            </Link>
                            <button type="button" onClick={onLogout} className="btn button_h4">
                                Выйти
                            </button>
                        </>
                    ) : (
                        <> {/* Не вошел */}
                            <Link to="/login" className="btn button_h4">
                                Вход
                            </Link>
                            <Link to="/register" className="btn button_h4">
                                Регистрация
                            </Link>
                        </>
                    )}
                </div>
            </header>
        </div>
    );
}
export default Header;