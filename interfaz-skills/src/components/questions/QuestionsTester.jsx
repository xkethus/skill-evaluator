import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomModal from "../CustomModal"; // Asegúrate de usar la ruta correcta

const QuestionTester = ({ questions, onFinish }) => {
    const [answers, setAnswers] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const navigate = useNavigate();

    if (!questions || questions.length === 0) {
        return <div className="container">No hay preguntas disponibles.</div>;
    }

    const handleAnswerChange = (questionIndex, optionIndex) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionIndex]: optionIndex,
        }));
    };

    const handleFinish = () => {
        const result = questions.map((q, questionIndex) => {
            const selectedOptionIndex = answers[questionIndex];
            const selectedOption = q.options[selectedOptionIndex];
            return `Pregunta: ${q.question}\nRespuesta: ${selectedOption?.text || "Sin respuesta"}\nHabilidad: ${q.skillName}\nSubhabilidad: ${q.subSkillName}\nNivel: ${selectedOption?.level || "N/A"}`;
        });

        setModalContent(result.join("\n\n")); // Mostrar las respuestas en el modal
        setIsModalOpen(true); // Abrir el modal
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        const finalResults = questions.map((q, questionIndex) => {
            const selectedOptionIndex = answers[questionIndex];
            const selectedOption = q.options[selectedOptionIndex];
            return {
                question: q.question,
                answer: selectedOption?.text || "Sin respuesta",
                skill: q.skillName,
                subSkill: q.subSkillName,
                level: selectedOption?.level || "N/A",
            };
        });

        onFinish(finalResults); // Pasar respuestas al estado global
        navigate("/results");
    };

    return (
        <div className="container">
            <h1>Responde el Cuestionario</h1>
            {questions.map((q, questionIndex) => (
                <div key={questionIndex} className="question">
                    <h2>{q.question}</h2>
                    <ul>
                        {q.options.map((option, optionIndex) => (
                            <li key={optionIndex} className="option">
                                <label>
                                    <input
                                        type="radio"
                                        name={`question-${questionIndex}`}
                                        value={optionIndex}
                                        checked={answers[questionIndex] === optionIndex}
                                        onChange={() =>
                                            handleAnswerChange(questionIndex, optionIndex)
                                        }
                                    />
                                    {option.text}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
            <button className="finish-btn" onClick={handleFinish}>
                Finalizar
            </button>

            {/* Modal para mostrar respuestas */}
            <CustomModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                content={modalContent}
            />
        </div>
    );
};

export default QuestionTester;
