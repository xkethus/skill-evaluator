import React, { useState } from "react";
import infoIcon from "./assets/info-icon.png";

const QuestionViewer = ({ questions, onDelete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!questions || questions.length === 0) {
        return (
            <div className="container">
                <h1>Visor de Preguntas</h1>
                <h2>Pregunta no disponible</h2>
                <p>No hay opciones disponibles.</p>
            </div>
        );
    }

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex < questions.length - 1 ? prevIndex + 1 : prevIndex
        );
    };

    const handleDelete = () => {
        onDelete(currentIndex);

        // Ajusta el índice si el actual queda fuera de rango tras eliminar
        setCurrentIndex((prevIndex) => {
            return prevIndex >= questions.length - 1 ? Math.max(0, prevIndex - 1) : prevIndex;
        });
    };

    const exportQuestions = () => {
        if (!questions || questions.length === 0) {
            alert("No hay preguntas para exportar.");
            return;
        }

        const dataStr = JSON.stringify(questions, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `cuestionario_${Date.now()}.quizapp`;
        link.click();

        URL.revokeObjectURL(url); // Liberar recursos
    };

    const currentQuestion = questions[currentIndex];

    return (
        <div className="container">
            <h1>Visor de Preguntas</h1>
            <div className="question">
                <h2>{currentQuestion.question}</h2>
                <ul>
                    {currentQuestion.options.map((option, index) => (
                        <li key={index} className="option">
                            <span>{option.text}</span>
                            <button
                                className="info-btn"
                                onClick={() =>
                                    alert(
                                        `Habilidad: ${currentQuestion.skillName}\nSubhabilidad: ${currentQuestion.subSkillName}\nNivel: ${option.level}`
                                    )
                                }
                            >
                                <img src={infoIcon} alt="Info" />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Navegación */}
            <div className="navigation">
                <button onClick={handlePrev} disabled={currentIndex === 0} className="nav-btn">
                    ←
                </button>
                <div className="bullets">
                    {questions.map((_, index) => (
                        <span
                            key={index}
                            className={`bullet ${index === currentIndex ? "active" : ""}`}
                        />
                    ))}
                </div>
                <button
                    onClick={handleNext}
                    disabled={currentIndex === questions.length - 1}
                    className="nav-btn"
                >
                    →
                </button>
            </div>

            {/* Botón para borrar */}
            <div className="delete-wrapper">
                <button onClick={handleDelete} className="delete-btn">
                    Borrar Pregunta
                </button>
            </div>

            {/* Botón para exportar */}
            <div className="export-wrapper">
                <button onClick={exportQuestions} className="export-btn">
                    Exportar Preguntas
                </button>
            </div>
        </div>
    );
};

export default QuestionViewer;
