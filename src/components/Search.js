import React from 'react';

const ITEMS_STORAGE_KEY = 'specfinder_items'; // Ключ для хранения исполнителей

// --- Пример данных по умолчанию ---
const defaultItems = [
    { id: 1, name: "Иван Петров (localStorage)", price: 1500, rating: 4.8, isVerify: true, category: "Веб-разработка" },
    { id: 2, name: "Анна Сидорова (localStorage)", price: 1200, rating: 4.5, isVerify: false, category: "Дизайн" },
    { id: 3, name: "Сергей Кузнецов (localStorage)", price: 2000, rating: 4.9, isVerify: true, category: "Веб-разработка" },
    { id: 4, name: "Мария Иванова (localStorage)", price: 1800, rating: 4.7, isVerify: true, category: "Копирайтинг" },
];

// --- Инициализация localStorage ---
const initializeItemsStorage = () => {
    if (!localStorage.getItem(ITEMS_STORAGE_KEY)) {
        try { localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(defaultItems)); }
        catch (error) { console.error("Ошибка инициализации items:", error); }
    }
};
initializeItemsStorage();
// --- Конец инициализации ---

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = { items: [], loading: true, error: null, searchQuery: '' };
    }

    componentDidMount() {
        console.log("Search.js: Загрузка из localStorage...");
        this.setState({ loading: true, error: null });
        try {
            const itemsJson = localStorage.getItem(ITEMS_STORAGE_KEY);
            const loadedItems = itemsJson ? JSON.parse(itemsJson) : [];
             setTimeout(() => { // Имитация задержки
                 this.setState({ items: loadedItems, loading: false });
             }, 300);
        } catch (error) {
            console.error("Ошибка загрузки items из localStorage:", error);
            this.setState({ error: "Не удалось загрузить данные.", loading: false });
        }
    }

    handleSearchChange = (event) => { this.setState({ searchQuery: event.target.value }); }

    render() {
        const { items, loading, error, searchQuery } = this.state;

        if (loading) { return <div className="base container">Загрузка...</div>; }
        if (error) { return <div className="base container">Ошибка: {error}</div>; }

        const filteredItems = items.filter(item =>
            (item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
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
                    {/* Поиск и Карточки */}
                    <div className="col-lg-9">
                        <div className="search_line">
                            <input className="search_input" type="text" placeholder="Введите текст для поиска..." value={searchQuery} onChange={this.handleSearchChange} />
                        </div>
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <div key={item.id} className="item_card">
                                    <h3>{item.name || 'Имя не указано'}</h3>
                                    {item.price != null && <h3 className="blue">{item.price} руб.</h3>}
                                    <div className="card_tags">
                                        {item.rating != null && <div className="card_tag"><h4>Рейтинг: {item.rating}</h4></div>}
                                        {item.isVerify != null && <div className="card_tag"><h4>{item.isVerify ? 'Проверенный профиль' : 'Не проверен'}</h4></div>}
                                    </div>
                                    {item.category && (<><h4>Категория:</h4><p className="card_p">{item.category}</p></>)}
                                    <div className="card_buttons">
                                        <button type="button" className="button_blue_m">Смотреть резюме</button>
                                        <button type="button" className="button_gray_m">Контакты</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="base" style={{ marginTop: '20px' }}>
                                <p>По вашему запросу "{searchQuery}" ничего не найдено.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
export default Search;