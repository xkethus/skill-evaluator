import React, { useState, useEffect } from "react";
import "../../index.css"; // Importa estilos globales
import uploadIcon from "../../assets/upload.png";

const QuestionsManager = ({ onSave }) => {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState([
        { text: "", level: "" },
        { text: "", level: "" },
        { text: "", level: "" },
        { text: "", level: "" }
    ]);
    const [skills, setSkills] = useState([]);
    const [skill, setSkill] = useState("");
    const [subSkill, setSubSkill] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/api/skills-with-subskills")
            .then((res) => res.json())
            .then((data) => setSkills(data.skills))
            .catch((error) => console.error("Error al cargar habilidades:", error));
    }, []);

    const handleOptionChange = (index, field, value) => {
        const updatedOptions = [...options];
        updatedOptions[index][field] = value;
        setOptions(updatedOptions);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert("No se seleccionó ningún archivo.");
            return;
        }

        const validExtensions = [".json", ".quizapp"];
        const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
        if (!validExtensions.includes(fileExtension)) {
            alert("El archivo debe ser un .json o .quizapp.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedQuestions = JSON.parse(e.target.result);

                if (!Array.isArray(importedQuestions)) {
                    alert("El archivo no tiene el formato esperado.");
                    return;
                }

                const validQuestions = importedQuestions.map((q) => {
                    const matchedSkill = skills.find((s) => s.name === q.skillName);
                    const matchedSubSkill = matchedSkill?.subskills.find(
                        (sub) => sub.name === q.subSkillName
                    );

                    if (!matchedSkill || !matchedSubSkill) {
                        console.warn(
                            `Pregunta con habilidad/subhabilidad no válida: "${q.skillName}" / "${q.subSkillName}".`
                        );
                        return null;
                    }

                    return {
                        ...q,
                        skillId: matchedSkill.id,
                        subSkillId: matchedSubSkill.id,
                        skillName: matchedSkill.name,
                        subSkillName: matchedSubSkill.name,
                    };
                }).filter(Boolean);

                if (validQuestions.length === 0) {
                    alert("No se pudieron importar preguntas válidas.");
                    return;
                }

                onSave(validQuestions);
                alert(`Se importaron ${validQuestions.length} preguntas correctamente.`);
            } catch (error) {
                console.error("Error al importar preguntas:", error);
                alert("El archivo no es válido.");
            }
        };

        reader.readAsText(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!question.trim()) {
            alert("La pregunta principal no puede estar vacía.");
            return;
        }

        if (!skill || !subSkill) {
            alert("Por favor selecciona una habilidad y subhabilidad.");
            return;
        }

        if (options.some((option) => !option.text.trim() || !option.level)) {
            alert("Todas las opciones deben tener texto y un nivel seleccionado.");
            return;
        }

        const levels = options.map((option) => option.level);
        const uniqueLevels = new Set(levels);
        if (levels.length !== uniqueLevels.size) {
            alert("Cada opción debe tener un nivel único.");
            return;
        }

        const newQuestion = {
            question,
            options,
            skill,
            subSkill,
            skillName: skills.find((s) => s.id === parseInt(skill))?.name,
            subSkillName: skills
                .find((s) => s.id === parseInt(skill))
                ?.subskills.find((sub) => sub.id === parseInt(subSkill))?.name
        };

        onSave(newQuestion);

        setQuestion("");
        setOptions([
            { text: "", level: "" },
            { text: "", level: "" },
            { text: "", level: "" },
            { text: "", level: "" }
        ]);
        setSkill("");
        setSubSkill("");
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="field-wrapper" style={{ position: "relative" }}>
                    <textarea
                        className="field"
                        placeholder="Escribe la pregunta principal..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        rows="3"
                        required
                    />
                    <button
                        type="button"
                        className="upload-btn"
                        onClick={() => setShowPopup(true)}
                    >
                        <img
                            src={uploadIcon}
                            alt="Seleccionar archivo"
                            className="icon"
                        />
                    </button>
                </div>

                <div className="field-wrapper">
                    <select
                        className="field"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        required
                    >
                        <option value="">Selecciona una habilidad</option>
                        {skills.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>

                {skill && (
                    <div className="field-wrapper">
                        <select
                            className="field"
                            value={subSkill}
                            onChange={(e) => setSubSkill(e.target.value)}
                            required
                        >
                            <option value="">Selecciona una subhabilidad</option>
                            {skills
                                .find((s) => s.id === parseInt(skill))
                                ?.subskills.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                )}

                <h3>Respuestas</h3>
                {options.map((option, index) => (
                    <div key={index} className="field-wrapper">
                        <input
                            type="text"
                            className="field"
                            placeholder={`Reactivo ${index + 1}`}
                            value={option.text}
                            onChange={(e) =>
                                handleOptionChange(index, "text", e.target.value)
                            }
                            required
                        />
                        <select
                            className="select-level"
                            value={option.level || ""}
                            onChange={(e) =>
                                handleOptionChange(index, "level", parseInt(e.target.value))
                            }
                            required
                            style={{ width: "100px", marginLeft: "10px" }}
                        >
                            <option value="" disabled>
                                Nivel
                            </option>
                            <option value="1">Nivel 1</option>
                            <option value="2">Nivel 2</option>
                            <option value="3">Nivel 3</option>
                            <option value="4">Nivel 4</option>
                        </select>
                    </div>
                ))}

                <button className="add-question-btn" type="submit">
                    +
                </button>
            </form>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Cargar preguntas</h3>

                        <label htmlFor="file-input" className="file-select-btn">
                            <img
                                src={uploadIcon}
                                alt="Seleccionar archivo"
                                className="icon"
                            />
                        </label>
                        <input
                            id="file-input"
                            type="file"
                            accept=".json"
                            onChange={(e) => handleFileUpload(e)}
                            style={{ display: "none" }}
                        />

                        <button
                            className="close-btn"
                            onClick={() => setShowPopup(false)}
                        >
                            ✖
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuestionsManager;
