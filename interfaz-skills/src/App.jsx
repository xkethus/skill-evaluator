import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const API_BASE_URL = "https://skill-evaluator.onrender.com/api/skills-with-microskills";

function App() {
    const [habilidades, setHabilidades] = useState([]);
    const [nuevaHabilidad, setNuevaHabilidad] = useState("");
    const [habilidadSeleccionada, setHabilidadSeleccionada] = useState("");
    const [nuevaSubhabilidad, setNuevaSubhabilidad] = useState("");

    // Cargar habilidades al montar el componente
    useEffect(() => {
        cargarHabilidades();
    }, []);

    const cargarHabilidades = () => {
        axios
            .get(`${API_BASE_URL}/skills-with-microskills`)
            .then((response) => {
                setHabilidades(response.data.skills);
            })
            .catch((error) => {
                console.error("Error al cargar las habilidades:", error);
            });
    };

    const agregarHabilidad = () => {
        if (!nuevaHabilidad.trim()) return;

        axios
            .post(`${API_BASE_URL}/skills`, { skill: nuevaHabilidad })
            .then((response) => {
                setHabilidades([...habilidades, { id: response.data.id, name: nuevaHabilidad, microskills: [] }]);
                setNuevaHabilidad("");
            })
            .catch((error) => {
                console.error("Error al agregar la habilidad:", error);
            });
    };

    const editarHabilidad = (id, nombreActual) => {
        const nuevoNombre = prompt("Editar habilidad:", nombreActual);
        if (nuevoNombre && nuevoNombre.trim()) {
            axios
                .put(`${API_BASE_URL}/skills/${id}`, { name: nuevoNombre })
                .then(() => {
                    setHabilidades(habilidades.map((habilidad) =>
                        habilidad.id === id ? { ...habilidad, name: nuevoNombre } : habilidad
                    ));
                })
                .catch((error) => {
                    console.error("Error al editar la habilidad:", error);
                });
        }
    };

    const eliminarHabilidad = (id) => {
        axios
            .delete(`${API_BASE_URL}/skills/${id}`)
            .then(() => {
                setHabilidades(habilidades.filter((habilidad) => habilidad.id !== id));
                if (habilidadSeleccionada === id.toString()) {
                    setHabilidadSeleccionada("");
                }
            })
            .catch((error) => {
                console.error("Error al eliminar la habilidad:", error);
            });
    };

    const agregarSubhabilidad = () => {
        if (!habilidadSeleccionada || !nuevaSubhabilidad.trim()) return;

        axios
            .post(`${API_BASE_URL}/skills/${habilidadSeleccionada}/microskills`, {
                name: nuevaSubhabilidad,
                level: 1, // Nivel predeterminado
            })
            .then((response) => {
                setHabilidades(habilidades.map((habilidad) => {
                    if (habilidad.id === parseInt(habilidadSeleccionada)) {
                        return {
                            ...habilidad,
                            microskills: [...habilidad.microskills, { id: response.data.id, name: nuevaSubhabilidad, level: 1 }],
                        };
                    }
                    return habilidad;
                }));
                setNuevaSubhabilidad("");
            })
            .catch((error) => {
                console.error("Error al agregar la sub-habilidad:", error);
            });
    };

    const editarSubhabilidad = (idHabilidad, idSubhabilidad, nombreActual) => {
        const nuevoNombre = prompt("Editar sub-habilidad:", nombreActual);
        if (nuevoNombre && nuevoNombre.trim()) {
            axios
                .put(`${API_BASE_URL}/skills/${idHabilidad}/microskills/${idSubhabilidad}`, { name: nuevoNombre })
                .then(() => {
                    setHabilidades(habilidades.map((habilidad) => {
                        if (habilidad.id === idHabilidad) {
                            return {
                                ...habilidad,
                                microskills: habilidad.microskills.map((sub) =>
                                    sub.id === idSubhabilidad ? { ...sub, name: nuevoNombre } : sub
                                ),
                            };
                        }
                        return habilidad;
                    }));
                })
                .catch((error) => {
                    console.error("Error al editar la sub-habilidad:", error);
                });
        }
    };

    const eliminarSubhabilidad = (idHabilidad, idSubhabilidad) => {
        axios
            .delete(`${API_BASE_URL}/skills/${idHabilidad}/microskills/${idSubhabilidad}`)
            .then(() => {
                setHabilidades(habilidades.map((habilidad) => {
                    if (habilidad.id === idHabilidad) {
                        return {
                            ...habilidad,
                            microskills: habilidad.microskills.filter((sub) => sub.id !== idSubhabilidad),
                        };
                    }
                    return habilidad;
                }));
            })
            .catch((error) => {
                console.error("Error al eliminar la sub-habilidad:", error);
            });
    };

    return (
        <div className="container">
            <h1>Gestor de habilidades</h1>
            <div className="field-wrapper">
                <input
                    type="text"
                    className="field"
                    placeholder="Escriba una nueva habilidad"
                    value={nuevaHabilidad}
                    onChange={(e) => setNuevaHabilidad(e.target.value)}
                />
                <button className="sign" onClick={agregarHabilidad}>+</button>
            </div>
            <div className="field-wrapper">
                <select
                    className="field select-arrow"
                    value={habilidadSeleccionada}
                    onChange={(e) => setHabilidadSeleccionada(e.target.value)}
                >
                    <option value="">Seleccione una habilidad</option>
                    {habilidades.map((habilidad) => (
                        <option key={habilidad.id} value={habilidad.id}>
                            {habilidad.name}
                        </option>
                    ))}
                </select>
            </div>
            {habilidadSeleccionada && (
                <>
                    <h2>Sub-habilidades</h2>
                    <div className="field-wrapper">
                        <input
                            type="text"
                            className="field"
                            placeholder="Escriba una nueva sub-habilidad"
                            value={nuevaSubhabilidad}
                            onChange={(e) => setNuevaSubhabilidad(e.target.value)}
                        />
                        <button className="sign" onClick={agregarSubhabilidad}>+</button>
                    </div>
                    <ul>
                        {habilidades.find((h) => h.id === parseInt(habilidadSeleccionada))?.microskills.map((sub) => (
                            <li key={sub.id} style={{ position: "relative" }}>
                                {sub.name}
                                <button
                                    className="action-btn edit"
                                    onClick={() => editarSubhabilidad(parseInt(habilidadSeleccionada), sub.id, sub.name)}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="action-btn delete"
                                    onClick={() => eliminarSubhabilidad(parseInt(habilidadSeleccionada), sub.id)}
                                >
                                    🗑️
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default App;
