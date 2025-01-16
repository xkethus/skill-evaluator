import React from "react";
import "./CustomModal.css"; // Agrega los estilos que veremos más abajo

const CustomModal = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>SkillEv</h2>
                <pre>{content}</pre>
                <button className="modal-close-btn" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default CustomModal;