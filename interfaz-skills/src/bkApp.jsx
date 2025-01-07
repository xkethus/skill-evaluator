import React, { useState } from "react";
import "./index.css";

function App() {
    const [habilidades, setHabilidades] = useState([]);
    const [nuevaHabilidad, setNuevaHabilidad] = useState("");
    const [habilidadSeleccionada, setHabilidadSeleccionada] = useState("");
    const [nuevaSubhabilidad, setNuevaSubhabilidad] = useState("");
    const [mostrarPopup, setMostrarPopup] = useState(false);

    const agregarHabilidad = () => {
        if (nuevaHabilidad.trim() && !habilidades.find(h => h.nombre === nuevaHabilidad)) {
            setHabilidades([...habilidades, { nombre: nuevaHabilidad, subhabilidades: [] }]);
            setNuevaHabilidad("");
        }
    };

    const manejarSeleccion = (e) => {
        setHabilidadSeleccionada(e.target.value);
    };

    const agregarSubhabilidad = () => {
        if (habilidadSeleccionada && nuevaSubhabilidad.trim()) {
            setHabilidades(habilidades.map(habilidad => {
                if (habilidad.nombre === habilidadSeleccionada) {
                    return {
                        ...habilidad,
                        subhabilidades: [...habilidad.subhabilidades, nuevaSubhabilidad],
                    };
                }
                return habilidad;
            }));
            setNuevaSubhabilidad("");
        }
    };

    const eliminarHabilidad = (nombre) => {
        setHabilidades(habilidades.filter(h => h.nombre !== nombre));
        if (habilidadSeleccionada === nombre) {
            setHabilidadSeleccionada("");
        }
    };

    const eliminarSubhabilidad = (nombreHabilidad, subhabilidad) => {
        setHabilidades(habilidades.map(habilidad => {
            if (habilidad.nombre === nombreHabilidad) {
                return {
                    ...habilidad,
                    subhabilidades: habilidad.subhabilidades.filter(sub => sub !== subhabilidad),
                };
            }
            return habilidad;
        }));
    };

    const editarHabilidad = (nombre) => {
        const nuevoNombre = prompt("Editar nombre de la habilidad:", nombre);
        if (nuevoNombre && nuevoNombre.trim()) {
            setHabilidades(habilidades.map(habilidad => {
                if (habilidad.nombre === nombre) {
                    return { ...habilidad, nombre: nuevoNombre };
                }
                return habilidad;
            }));
            if (habilidadSeleccionada === nombre) {
                setHabilidadSeleccionada(nuevoNombre);
            }
        }
    };

    const editarSubhabilidad = (nombreHabilidad, subhabilidad) => {
        const nuevoNombre = prompt("Editar subhabilidad:", subhabilidad);
        if (nuevoNombre && nuevoNombre.trim()) {
            setHabilidades(habilidades.map(habilidad => {
                if (habilidad.nombre === nombreHabilidad) {
                    return {
                        ...habilidad,
                        subhabilidades: habilidad.subhabilidades.map(sub =>
                            sub === subhabilidad ? nuevoNombre : sub
                        ),
                    };
                }
                return habilidad;
            }));
        }
    };

    const togglePopup = () => {
        setMostrarPopup(!mostrarPopup);
    };

    return (
        <div className="container">
            <h1>Gestor de habilidades</h1>
            <div className="field-wrapper">
                <input
                    type="text"
                    className="field"
                    placeholder="Escriba una habilidad"
                    value={nuevaHabilidad}
                    onChange={(e) => setNuevaHabilidad(e.target.value)}
                />
                <button className="sign" onClick={agregarHabilidad}>+</button>
            </div>
            <div className="field-wrapper">
                <select
                    value={habilidadSeleccionada}
                    onChange={manejarSeleccion}
                    className="field round"
                >
                    <option value="">Seleccione una habilidad</option>
                    {habilidades.map((habilidad, index) => (
                        <option key={index} value={habilidad.nombre}>
                            {habilidad.nombre}
                        </option>
                    ))}
                </select>
            </div>
            {habilidadSeleccionada && (
                <>
                    <h2>Subhabilidades para: {habilidadSeleccionada}</h2>
                    <div className="field-wrapper">
                        <input
                            type="text"
                            className="field"
                            placeholder="Escriba una subhabilidad"
                            value={nuevaSubhabilidad}
                            onChange={(e) => setNuevaSubhabilidad(e.target.value)}
                        />
                        <button className="sign" onClick={agregarSubhabilidad}>+</button>
                    </div>
                    <ul>
                        {habilidades.find(h => h.nombre === habilidadSeleccionada)?.subhabilidades.map((sub, index) => (
                            <li key={index} style={{ position: "relative" }}>
                            {sub}
                            <button
                                className="action-btn edit"
                                onClick={() => editarSubhabilidad(habilidadSeleccionada, sub)}
                            >
                                  <img src="/edit.svg" alt="Editar" style={{ width: "16px", height: "16px" }} />
                                
                            </button>
                            <button
                                className="action-btn delete"
                                onClick={() => eliminarSubhabilidad(habilidadSeleccionada, sub)}
                            >
                                -
                            </button>
                        </li>
                        ))}
                    </ul>
                </>
            )}
            <button className="show-popup" onClick={togglePopup}>
                Mostrar habilidades
            </button>
            {mostrarPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Todas las habilidades</h2>
                        <ul>
                            {habilidades.map((habilidad, index) => (
                                <li key={index} style={{ position: "relative" }}>
                                <strong>{habilidad.nombre}</strong>
                                <button
                                    className="action-btn edit"
                                    onClick={() => editarHabilidad(habilidad.nombre)}
                                >
                                     <img src="/edit.svg" alt="Editar" style={{ width: "16px", height: "16px" }} />
                                </button>
                                <button
                                    className="action-btn delete"
                                    onClick={() => eliminarHabilidad(habilidad.nombre)}
                                >
                                    -
                                </button>
                                <ul>
                                    {habilidad.subhabilidades.map((sub, subIndex) => (
                                        <li key={subIndex}>{sub}</li>
                                    ))}
                                </ul>
                            </li>
                            
                            ))}
                        </ul>
                        <button className="close-popup" onClick={togglePopup}>
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
