import React, { useState } from "react";
import infoIcon from "./assets/info-icon.png";

const QuestionViewer = ({ questions, onDelete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!questions || questions.length === 0) {
        return <div className="container">No hay preguntas creadas aún.</div>;
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
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
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
        </div>
    );
};

export default QuestionViewer;
