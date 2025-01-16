import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo_qz.svg";

const FloatingLogo = () => {
    const location = useLocation();
    const [position, setPosition] = useState("center");

    useEffect(() => {
        // Cambia la posición del logo según la ruta
        if (location.pathname === "/") {
            setPosition("center");
        } else {
            setPosition("top-right");
        }
    }, [location]);

    return (
        <img
            src={logo}
            alt="Logo"
            className={`floating-logo ${position}`}
        />
    );
};

export default FloatingLogo;
