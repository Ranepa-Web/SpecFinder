import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WorkExperienceSection from "./sections/WorkExperienceSection";

const ResumePage = () => {
    const { id } = useParams(); // id из URL, например "/resume/1651234567890"
    const navigate = useNavigate();

    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        try {
            const resumesJson = localStorage.getItem("db_published_resumes");
            const allResumes = resumesJson ? JSON.parse(resumesJson) : [];
            const found = allResumes.find((r) => String(r.id) === String(id));

            if (!found) {
                setError("Резюме с таким ID не найдено.");
            } else {
                setResume(found);
            }
        } catch (err) {
            console.error("Ошибка при чтении localStorage:", err);
            setError("Не удалось загрузить резюме.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="alert alert-info">Загрузка резюме...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">{error}</div>
                <button
                    className="btn btn-outline-secondary mt-2"
                    onClick={() => navigate(-1)}
                >
                    Назад
                </button>
            </div>
        );
    }

    // Если резюме найдено — рендерим полное представление
    return (
        <div className="container mt-4">
            <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
                ← Вернуться к поиску
            </button>

            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="card-title mb-1">{resume.name || "Имя не указано"}</h2>
                    <h5 className="card-subtitle text-muted mb-3">
                        {resume.position || "Должность не указана"}
                    </h5>

                    {/* Верификация */}
                    {resume.isVerify !== undefined && (
                        <p className="mb-3">
                            {resume.isVerify ? (
                                <span className="badge bg-success">Проверенный</span>
                            ) : (
                                <span className="badge bg-secondary">Не проверен</span>
                            )}
                        </p>
                    )}

                    <hr />

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <p>
                                <strong>Город:</strong> {resume.city || "Не указан"}
                            </p>
                        </div>
                    </div>

                    {/* Навыки-«тэги» */}
                    <div className="mb-3">
                        <strong>Навыки:</strong>
                        <div className="mt-2">
                            {(resume.skills || "")
                                .map((skill, idx) => {
                                    const trimmed = skill.trim();
                                    return trimmed ? (
                                        <span key={idx} className="badge bg-primary me-1 mb-1">
                      {trimmed}
                    </span>
                                    ) : null;
                                })}
                        </div>
                    </div>

                    {/* О себе */}
                    <div className="mb-3">
                        <strong>О себе:</strong>
                        <p className="mt-1">{resume.about || "Не указано"}</p>
                    </div>

                    <WorkExperienceSection workExperiences={resume.workExperiences} readOnly={true}></WorkExperienceSection>

                    {/* Контакты */}
                    <div className="mb-4">
                        <h5>Контакты:</h5>
                        {resume.email && (
                            <p>
                                <strong>Email:</strong>{" "}
                                <a href={`mailto:${resume.email}`}>{resume.email}</a>
                            </p>
                        )}
                        {resume.phone && (
                            <p>
                                <strong>Телефон:</strong> <a href={`tel:${resume.phone}`}>{resume.phone}</a>
                            </p>
                        )}
                    </div>

                    <div className="d-flex justify-content-between">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert("Ссылка на резюме скопирована в буфер обмена");
                            }}
                        >
                            Поделиться
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumePage;
