import React from "react";
import "./CustomModal.css"; // Agrega los estilos que veremos más abajo
import logo from "../assets/logo_qz.svg";

const CustomModal = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                
                <img
                                src={logo}
                                alt="Logo"
                                className={`logo_modal`}
                            />
                <pre>{content}</pre>
                <button className="modal-close-btn" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default CustomModal;