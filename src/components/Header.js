import React from 'react';

class Header extends React.Component {
    render () {
        return (
            <div class="container">
                <header>
                        <h4>SpecFinder</h4>
                        <button type="button" class="button_h4">Вход / Регистрация</button>
                </header>
            </div>
        )
    }
}

export default Header