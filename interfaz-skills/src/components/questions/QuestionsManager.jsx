import React, { useState, useEffect } from "react";
import "../../index.css"; // Importa estilos globales

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

    // Cargar habilidades y subhabilidades desde el backend
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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones
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

        // Crear la pregunta
        const newQuestion = {
            question,
            options,
            skill: skill, // ID de habilidad
            subSkill: subSkill, // ID de subhabilidad
            skillName: skills.find((s) => s.id === parseInt(skill))?.name, // Nombre de habilidad
            subSkillName: skills
                .find((s) => s.id === parseInt(skill))
                ?.subskills.find((sub) => sub.id === parseInt(subSkill))?.name // Nombre de subhabilidad
        };

        // Guardar la pregunta en el estado global usando onSave
        onSave(newQuestion);

        // Reiniciar los campos
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
                {/* Pregunta principal */}
                <div className="field-wrapper">
                    <textarea
                        className="field"
                        placeholder="Escribe la pregunta principal..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        rows="3"
                        required
                    />
                </div>

                {/* Habilidad */}
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

                {/* Subhabilidad */}
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

                {/* Opciones */}
                <h2>Opciones</h2>
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

                {/* Botón para guardar */}
                <button className="add-question-btn" type="submit">
                    +
                </button>
            </form>
        </div>
    );
};

export default QuestionsManager;
