// src/components/SkillsInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../../css/inputs/SkillsInput.css';

// Ключ для хранения в localStorage
const SKILLS_STORAGE_KEY = 'app_skills_list';

// Начальный список навыков
const defaultSkills = [
    'React', 'JavaScript', 'TypeScript', 'Node.js', 'Express',
    'HTML', 'CSS', 'SCSS', 'Sass', 'Redux', 'Redux Toolkit',
    'Vue.js', 'Angular', 'MongoDB', 'SQL', 'PostgreSQL',
    'MySQL', 'Firebase', 'AWS', 'Docker', 'Git', 'GitHub'
];

// Получаем сохраненные навыки или используем дефолтные
const getStoredSkills = () => {
    try {
        const storedSkills = localStorage.getItem(SKILLS_STORAGE_KEY);
        if (storedSkills) {
            return JSON.parse(storedSkills);
        }
        // Сохраняем начальный список, если в localStorage ничего нет
        localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(defaultSkills));
    } catch (error) {
        console.error('Ошибка при получении навыков:', error);
    }
    return defaultSkills;
};

// Сохраняем навыки в localStorage
const saveSkills = (skills) => {
    try {
        localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(skills));
    } catch (error) {
        console.error('Ошибка при сохранении навыков:', error);
    }
};

const SkillsInput = ({ value = [], onChange, placeholder, name = "skills", autoAddNewSkills = true }) => {
    // Загружаем навыки из localStorage
    const [allSkills, setAllSkills] = useState(getStoredSkills());

    // Проверяем value на валидность и преобразуем в массив, если это не массив
    const initialValue = Array.isArray(value) ? value : [];

    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState(initialValue);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [hasExactMatch, setHasExactMatch] = useState(false);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Обновляем выбранные навыки при изменении value извне
    useEffect(() => {
        const newValue = Array.isArray(value) ? value : [];
        setSelectedSkills(newValue);
    }, [value]);

    // Закрываем выпадающий список при клике вне компонента
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target) &&
                !inputRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Эффект для управления показом подсказок
    useEffect(() => {
        // Если ввод пустой, не показываем подсказки
        if (!inputValue.trim()) {
            setShowSuggestions(false);
        }
    }, [inputValue]);

    // Добавляем навык в общий список
    const addSkill = (skill) => {
        if (!skill || typeof skill !== 'string') return false;

        const trimmedSkill = skill.trim();
        if (trimmedSkill === '') return false;

        // Проверяем, есть ли уже такой навык (без учета регистра)
        const exists = allSkills.some(s => s.toLowerCase() === trimmedSkill.toLowerCase());

        if (!exists) {
            const updatedSkills = [...allSkills, trimmedSkill];
            setAllSkills(updatedSkills);
            saveSkills(updatedSkills);
            return true;
        }

        return false;
    };

    // Ищем навыки по запросу
    const searchSkills = (query) => {
        if (!query || query.trim() === '') return [];

        const trimmedQuery = query.trim().toLowerCase();

        return allSkills.filter(skill =>
            skill.toLowerCase().includes(trimmedQuery)
        );
    };

    // Проверяем наличие точного совпадения (без учета регистра)
    const checkExactMatch = (input) => {
        if (!input || !input.trim()) return false;

        const trimmedInput = input.trim().toLowerCase();
        return allSkills.some(skill => skill.toLowerCase() === trimmedInput);
    };

    // Фильтруем подсказки на основе ввода
    const filterSuggestions = (input) => {
        if (!input.trim()) {
            return [];
        }

        // Проверяем наличие точного совпадения
        const exactMatch = checkExactMatch(input);
        setHasExactMatch(exactMatch);

        return searchSkills(input).filter(skill => !selectedSkills.includes(skill));
    };

    // Вызываем внешний обработчик onChange с правильным форматом для вашего handleInputChange
    const callOnChangeHandler = (newSkills) => {
        // Создаем синтетическое событие, чтобы оно соответствовало ожидаемому формату
        const syntheticEvent = {
            target: {
                name: name,
                value: newSkills
            }
        };

        // Вызываем внешний обработчик с синтетическим событием
        onChange(syntheticEvent);
    };

    // Обрабатываем изменение ввода
    const handleInputChange = (e) => {
        const value = e.target.value;

        if (value.includes(',')) {
            // Если ввели запятую, добавляем навык как тег
            const parts = value.split(',');
            const newSkill = parts[0].trim();

            if (newSkill && !selectedSkills.includes(newSkill)) {
                // Если разрешено автоматически добавлять новые навыки в общий список
                if (autoAddNewSkills) {
                    addSkill(newSkill);
                }

                const newSelectedSkills = [...selectedSkills, newSkill];
                setSelectedSkills(newSelectedSkills);
                callOnChangeHandler(newSelectedSkills);
            }

            // Очищаем поле ввода после запятой и скрываем подсказки
            setInputValue('');
            setSuggestions([]);
            setShowSuggestions(false);
        } else {
            // Обновляем значение
            setInputValue(value);

            // Обновляем подсказки и показываем их, если есть текст (даже если нет совпадений)
            if (value.trim()) {
                const filteredSuggestions = filterSuggestions(value);
                setSuggestions(filteredSuggestions);
                // Показываем список подсказок всегда, когда есть текст
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }
    };

    // Обрабатываем нажатие клавиш
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            addSkillToSelected(inputValue.trim());
        } else if (e.key === 'Backspace' && inputValue === '' && selectedSkills.length > 0) {
            // Удаляем последний тег при нажатии backspace в пустом поле
            const newSelectedSkills = selectedSkills.slice(0, -1);
            setSelectedSkills(newSelectedSkills);
            callOnChangeHandler(newSelectedSkills);
        }
    };

    // Добавляем навык в список выбранных
    const addSkillToSelected = (skill) => {
        if (skill && !selectedSkills.includes(skill)) {
            // Если разрешено автоматически добавлять новые навыки в общий список
            if (autoAddNewSkills) {
                addSkill(skill);
            }

            const newSelectedSkills = [...selectedSkills, skill];
            setSelectedSkills(newSelectedSkills);

            // Очищаем поле ввода и скрываем подсказки
            setInputValue('');
            setSuggestions([]);
            setShowSuggestions(false);

            // Вызываем внешний обработчик с синтетическим событием
            callOnChangeHandler(newSelectedSkills);
        }
    };

    // Удаляем навык из списка выбранных
    const removeSkill = (skill) => {
        const newSelectedSkills = selectedSkills.filter(s => s !== skill);
        setSelectedSkills(newSelectedSkills);
        callOnChangeHandler(newSelectedSkills);
    };

    // Обрабатываем клик по подсказке
    const handleSuggestionClick = (suggestion) => {
        addSkillToSelected(suggestion);
        // После добавления навыка фокус остается на поле ввода
        inputRef.current.focus();
    };

    // Обработчик для добавления своего навыка
    const handleAddCustomSkill = () => {
        if (inputValue.trim()) {
            addSkillToSelected(inputValue.trim());
        }
    };

    // Обработчик фокуса
    const handleFocus = () => {
        // Показываем подсказки если есть текст в поле ввода (даже если нет совпадений)
        if (inputValue.trim()) {
            const filteredSuggestions = filterSuggestions(inputValue);
            setSuggestions(filteredSuggestions);
            // Показываем список подсказок всегда, когда есть текст
            setShowSuggestions(true);
        }
    };

    // Определяем, нужно ли показывать кнопку "Добавить"
    const shouldShowAddButton = () => {
        // Показываем кнопку, если есть текст и нет точного совпадения
        return inputValue.trim() && !hasExactMatch && !selectedSkills.includes(inputValue.trim());
    };

    return (
        <div className="skills-input-container">
            <div className="skills-input-tags form-control">
                {selectedSkills.map((skill, index) => (
                    <div key={index} className="skill-tag">
                        {skill}
                        <button
                            type="button"
                            className="skill-tag-remove"
                            onClick={() => removeSkill(skill)}
                        >
                            ×
                        </button>
                    </div>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    placeholder={selectedSkills.length === 0 ? (placeholder || "Введите навык и нажмите запятую...") : ''}
                    className="skills-input"
                    name={name}
                    title="Введите свой навык и нажмите запятую или Enter"
                />
            </div>

            {/* Подсказки */}
            {showSuggestions && (
                <ul ref={suggestionsRef} className="skills-suggestions">
                    {/* Существующие навыки */}
                    {suggestions.length > 0 && suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="suggestion-item"
                        >
                            {suggestion}
                        </li>
                    ))}

                    {/* Показываем кнопку "Добавить", если нет точного совпадения */}
                    {shouldShowAddButton() && (
                        <li
                            onClick={handleAddCustomSkill}
                            className="suggestion-item suggestion-item-add"
                        >
                            <strong>Добавить:</strong> {inputValue}
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default SkillsInput;