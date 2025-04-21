import React from 'react';
import {useNavigate} from "react-router-dom";

export const Header = ({ isAuthenticated, onLogout }) => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <header>
                <h4>SpecFinder</h4>
                {isAuthenticated ? (
                    <button
                        type="button"
                        onClick={onLogout}
                        className="btn button_h4"
                    >
                        Выйти
                    </button>
                ) : (
                    <button type="button"
                            onClick={() => navigate('/login')}
                            className="btn button_h4">
                        Вход / Регистрация
                    </button>
                )}
            </header>
        </div>
    )
}

export default Header