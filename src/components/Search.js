import React from 'react';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loading: true, 
            error: null,
            searchQuery: '', // Запрос
        };
    }

    componentDidMount() {
        fetch('http://localhost:3001/items')
        .then((response) => {
            if (!response.ok) {
            throw new Error('Ошибка при загрузке данных');
            }
            return response.json();
        })
        .then((data) => {
            this.setState({ items: data, loading: false });
        })
        .catch((error) => {
            this.setState({ error: error.message, loading: false });
        });
    }

    // Обработчик поля ввода
    handleSearchChange = (event) => {
        this.setState({ searchQuery: event.target.value });
    }

    render() {
        const { items, loading, error, searchQuery } = this.state;

        if (loading) {
            return <div className="base container">Загрузка...</div>;
        }

        if (error) {
            return  <div className="base container">Ошибка: {error}</div>;
        }

        // Фильтрация элементов
        const filteredItems = items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="container">
                <div className="row">

                    {/* Фильтры */}
                    <div className="col-lg-3">
                        <div className="base">
                            <h4>Фильтры</h4>
                            <p>ㅤ<br/>In Progress<br/>ㅤ</p>
                            <button type="button" className="button_blue_max">Применить фильтры</button>
                        </div>
                    </div>

                    {/* Поиск */}
                    <div className="col-lg-9">
                        <div className="search_line">
                            <input 
                                className="search_input" 
                                type="text" 
                                placeholder="Введите текст для поиска..."
                                value={searchQuery}
                                onChange={this.handleSearchChange} // Добавляем обработчик изменения
                            />
                        </div>

                        {/* Карточки */}
                        {filteredItems.map((item) => (
                            <div key={item.id} className="item_card">
                                <h3>{item.name}</h3>
                                <h3 className="blue">{item.price} руб.</h3>
                                <div className="card_tags">
                                    <div className="card_tag"><h4>Рейтинг: {item.rating}</h4></div>
                                    <div className="card_tag"><h4>{item.isVerify ? 'Проверенный профиль' : 'Не проверен'}</h4></div>
                                </div>
                                <h4>Категория:</h4>
                                <p className="card_p">{item.category}</p>
                                <div className="card_buttons">
                                    <button type="button" className="button_blue_m">Смотреть резюме</button>
                                    <button type="button" className="button_gray_m">Контакты</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Search;