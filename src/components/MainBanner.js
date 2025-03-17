import React from 'react';
import sms from "../images/sms_1.png"

class MainBanner extends React.Component {
    render () {
        return (
            <div class="main_banner_background">
                <div class="container">
                    <div class="banner_content">
                        <div class="banner_text">
                            <h1>Найдите<br/>специалиста<br/><span class="text_fifty">для любой задачи</span></h1>
                            <p class="banner_p">Быстрый и бесплатный поиск дистанционных специалистов. Обращайтесь к профи · 900 видов услуг. На рынке с 2014 года. Работают очно и онлайн. Более 8 млн отзывов. 3 млн специалистов. Уже 15 млн клиентов</p>
                            <button type="button" class="button_blue_m">К поиску</button>
                            <button type="button" class="button_white_m">Узнать подробнее</button>
                        </div>
                        <img class="fit-picture" src={sms} alt="Переписка"></img>
                    </div>
                </div>
            </div>
        )
    }
}

export default MainBanner