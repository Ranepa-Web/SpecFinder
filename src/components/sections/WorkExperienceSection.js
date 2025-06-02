"use client"

import React, {useEffect, useState} from "react"
import WorkExperienceModal from "../modals/WorkExperienceModal"
import "../../css/work_experience.css"

function WorkExperienceSection({ workExperiences = [], onChange }) {
    const [showModal, setShowModal] = useState(false)
    const [editingExperience, setEditingExperience] = useState(null)

    const handleAddExperience = () => {
        setEditingExperience(null)
        setShowModal(true)
    }

    const handleEditExperience = (experience, index) => {
        setEditingExperience({ ...experience, index })
        setShowModal(true)
    }

    const handleSaveExperience = (experience) => {
        let updatedExperiences

        if (editingExperience !== null) {
            // Edit existing experience
            updatedExperiences = [...workExperiences]
            updatedExperiences[editingExperience.index] = experience
        } else {
            // Add new experience
            updatedExperiences = [...workExperiences, experience]
        }

        // Sort experiences by start date (newest first)
        updatedExperiences.sort((a, b) => {
            const dateA = a.currentlyWorking ? new Date() : new Date(a.endYear, a.endMonth || 0, 1)
            const dateB = b.currentlyWorking ? new Date() : new Date(b.endYear, b.endMonth || 0, 1)
            return dateB - dateA
        })

        onChange(updatedExperiences)
        setShowModal(false)
    }

    const formatDate = (month, year, isCurrentlyWorking) => {
        const months = [
            "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ]

        if (isCurrentlyWorking) {
            return `${months[month - 1]} ${year} — сейчас`
        }

        return `${months[month - 1]} ${year}`
    }

    const calculateDuration = (startMonth, startYear, endMonth, endYear, isCurrentlyWorking) => {
        const start = new Date(startYear, startMonth - 1, 1)
        const end = isCurrentlyWorking ? new Date() : new Date(endYear, endMonth - 1, 1)

        const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
        const years = Math.floor(diffMonths / 12)
        const months = diffMonths % 12

        let result = ""
        if (years > 0) {
            result += `${years} ${years === 1 ? "год" : years < 5 ? "года" : "лет"}`
        }

        if (months > 0) {
            if (result.length > 0) result += " "
            result += `${months} ${months === 1 ? "месяц" : months < 5 ? "месяца" : "месяцев"}`
        }

        return result
    }

    const getCompanyInitial = (companyName) => {
        return companyName ? companyName.charAt(0).toUpperCase() : ""
    }
    const handleCloseModal = (modal) => {
        console.log("HANDLE CANCEL")
        setShowModal(false)
    }

    return (
        <div className="profile-section work-experience-section">
            <div className="section-header">
                <h4 className="profile-section-title">Опыт работы: {calculateTotalExperience(workExperiences)}</h4>
                <button
                    className="button button_blue_m add-experience-btn"
                    onClick={handleAddExperience}
                >
                    + Добавить
                </button>
            </div>

            {workExperiences.length === 0 ? (
                <div className="no-experience-message">
                    <p>Добавьте информацию о вашем опыте работы</p>
                </div>
            ) : (
                <div className="work-experience-list">
                    {workExperiences.map((experience, index) => {
                        console.log("item index:" + index)
                        return (
                        <div key={`item-${index}`} className="work-experience-item">
                            <div className="company-logo">
                                {experience.companyLogo ? (
                                    <img src={experience.companyLogo} alt={experience.companyName} />
                                ) : (
                                    <div className="company-initial">{getCompanyInitial(experience.companyName)}</div>
                                )}
                            </div>
                            <div className="experience-details">
                                <h4 className="position-title">{experience.position}</h4>
                                <p className="company-name">{experience.companyName}</p>
                                <p className="experience-date">
                                    {formatDate(experience.startMonth, experience.startYear, false)} — {" "}
                                    {experience.currentlyWorking
                                        ? "сейчас"
                                        : formatDate(experience.endMonth, experience.endYear, false)}
                                    {" "}
                                    ({calculateDuration(
                                    experience.startMonth,
                                    experience.startYear,
                                    experience.endMonth,
                                    experience.endYear,
                                    experience.currentlyWorking
                                )})
                                </p>
                            </div>
                            <button
                                className="edit-experience-btn"
                                onClick={() => handleEditExperience(experience, index)}
                            >
                                <span className="edit-icon">✎</span>
                            </button>
                        </div>
                    )})}
                </div>
            )}
            <WorkExperienceModal
                key={editingExperience?.index}
                experience={editingExperience}
                showModal={showModal}
                onCancel={handleCloseModal}
                onSave={handleSaveExperience}
            />
        </div>
    )
}

function calculateTotalExperience(experiences) {
    if (!experiences || experiences.length === 0) return '0 месяцев'

    let totalMonths = 0

    experiences.forEach(exp => {
        const startDate = new Date(exp.startYear, exp.startMonth - 1, 1)
        const endDate = exp.currentlyWorking
            ? new Date()
            : new Date(exp.endYear, exp.endMonth - 1, 1)

        const diffMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth())

        totalMonths += diffMonths
    })

    const years = Math.floor(totalMonths / 12)
    const months = totalMonths % 12

    if (years === 0) return `${months} ${pluralizeMonths(months)}`
    if (months === 0) return `${years} ${pluralizeYears(years)}`
    return `${years} ${pluralizeYears(years)} ${months} ${pluralizeMonths(months)}`
}

function pluralizeYears(years) {
    if (years === 1) return 'год'
    if (years >= 2 && years <= 4) return 'года'
    return 'лет'
}

function pluralizeMonths(months) {
    if (months === 1) return 'месяц'
    if (months >= 2 && months <= 4) return 'месяца'
    return 'месяцев'
}

export default WorkExperienceSection