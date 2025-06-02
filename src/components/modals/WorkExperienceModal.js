"use client"

import React, {useState, useCallback, useEffect} from "react"
import "../../css/modal/modal.css"

function WorkExperienceModal({key = null, experience = null, showModal = false, onCancel, onSave}) {
    const currentYear = new Date().getFullYear()
    const years = Array.from({length: 50}, (_, i) => currentYear - i)
    const months = [
        {value: 1, label: "Январь"},
        {value: 2, label: "Февраль"},
        {value: 3, label: "Март"},
        {value: 4, label: "Апрель"},
        {value: 5, label: "Май"},
        {value: 6, label: "Июнь"},
        {value: 7, label: "Июль"},
        {value: 8, label: "Август"},
        {value: 9, label: "Сентябрь"},
        {value: 10, label: "Октябрь"},
        {value: 11, label: "Ноябрь"},
        {value: 12, label: "Декабрь"}
    ]

    // Инициализация formData с учетом experience
    const getInitialFormData = useCallback(() => ({
        companyName: experience?.companyName || "",
        location: experience?.location || "",
        website: experience?.website || "",
        industry: experience?.industry || "",
        position: experience?.position || "",
        startMonth: experience?.startMonth || 1,
        startYear: experience?.startYear || currentYear,
        endMonth: experience?.endMonth || 1,
        endYear: experience?.endYear || currentYear,
        currentlyWorking: experience?.currentlyWorking || false,
        responsibilities: experience?.responsibilities || ""
    }),[experience, currentYear]);

    const [formData, setFormData] = useState(getInitialFormData())
    const [errors, setErrors] = useState({})

    // Обработка нажатия клавиши Esc
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && showModal) {
                onCancel()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [showModal])

    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))

        // Clear error when field is changed
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: null}))
        }
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.companyName.trim()) {
            newErrors.companyName = "Укажите название компании"
        }

        if (!formData.position.trim()) {
            newErrors.position = "Укажите должность"
        }

        if (Number(formData.startYear) > Number(formData.endYear) ||
            (Number(formData.startYear) === Number(formData.endYear) &&
                Number(formData.startMonth) > Number(formData.endMonth)) &&
            !formData.currentlyWorking) {
            newErrors.endDate = "Дата окончания не может быть раньше даты начала"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!validate()) {
            return
        }

        onSave({
            companyName: formData.companyName,
            location: formData.location,
            website: formData.website,
            industry: formData.industry,
            position: formData.position,
            startMonth: Number(formData.startMonth),
            startYear: Number(formData.startYear),
            endMonth: formData.currentlyWorking ? null : Number(formData.endMonth),
            endYear: formData.currentlyWorking ? null : Number(formData.endYear),
            currentlyWorking: formData.currentlyWorking,
            responsibilities: formData.responsibilities
        })

        onCancel()
    }

    return (
        <>
            {showModal && (<div className="modal-overlay">
            <div className="modal-container work-experience-modal" key={`${showModal}-${key || 'new'}`}>
                <div className="modal-header">
                    <h2>Место работы</h2>
                    <button className="close-button" onClick={onCancel}>×</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Название компании"
                            className={`form-control ${errors.companyName ? 'error' : ''}`}
                        />
                        {errors.companyName && <div className="error-message">{errors.companyName}</div>}
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Город или регион"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="Сайт"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="industry"
                            value={formData.industry}
                            onChange={handleInputChange}
                            placeholder="Сфера деятельности компании"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            placeholder="Должность"
                            className={`form-control ${errors.position ? 'error' : ''}`}
                        />
                        {errors.position && <div className="error-message">{errors.position}</div>}
                    </div>

                    <div className="date-section">
                        <h3>Начало работы</h3>
                        <div className="date-inputs">
                            <select
                                name="startMonth"
                                value={formData.startMonth}
                                onChange={handleInputChange}
                                className="form-control month-select"
                            >
                                {months.map(month => (
                                    <option key={`start-${month.value}`} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="startYear"
                                value={formData.startYear}
                                onChange={handleInputChange}
                                className="form-control year-select"
                            >
                                {years.map(year => (
                                    <option key={`start-${year}`} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="date-section">
                        <h3>Окончание</h3>

                        <div className="currently-working-checkbox">
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    name="currentlyWorking"
                                    checked={formData.currentlyWorking}
                                    onChange={handleInputChange}
                                />
                                <span className="checkbox-label">Работаю сейчас</span>
                            </label>
                        </div>

                        {!formData.currentlyWorking && (
                            <div className="date-inputs">
                                <select
                                    name="endMonth"
                                    value={formData.endMonth}
                                    onChange={handleInputChange}
                                    className="form-control month-select"
                                    disabled={formData.currentlyWorking}
                                >
                                    {months.map(month => (
                                        <option key={`end-${month.value}`} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    name="endYear"
                                    value={formData.endYear}
                                    onChange={handleInputChange}
                                    className="form-control year-select"
                                    disabled={formData.currentlyWorking}
                                >
                                    {years.map(year => (
                                        <option key={`end-${year}`} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {errors.endDate && <div className="error-message">{errors.endDate}</div>}
                    </div>

                    <div className="form-group responsibilities-group">
                        <label>Расскажите о ваших обязанностях</label>
                        <textarea
                            name="responsibilities"
                            value={formData.responsibilities}
                            onChange={handleInputChange}
                            className="form-control"
                            rows="5"
                        ></textarea>
                        <div className="field-description">
                            Например, занимались бухгалтерским учётом и внедрили инструмент, который помог делать это быстрее
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="button button_blue_m save-button">
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>)}
        </>
    )
}

export default WorkExperienceModal