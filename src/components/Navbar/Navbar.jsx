import "./Navbar.css";
import { useState } from "react";

export default function Navbar({ scene, setScene }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const items = [
        { id: "home", label: "INICIO" },
        { id: "project", label: "TERRAZA" },
        { id: "gallery", label: "VER DISPONIBLE" },
        { id: "apartments", label: "APARTAMENTOS" },
        { id: "levels", label: "NIVELES" },
        { id: "projects", label: "PROYECTOS" },
        { id: "brochure", label: "BROCHURE" },
    ];

    const changeScene = (id) => {
        setScene(id);
        setMenuOpen(false);
    };

    return (
        <>
            <button
                className="mobile-menu-button"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? "✕" : "☰"}
            </button>

            <div className={`scene-menu ${menuOpen ? "open" : ""}`}>
                <div className="scene-menu-items">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => changeScene(item.id)}
                            className={`scene-item ${
                                scene === item.id ? "active" : ""
                            }`}
                        >
                            <span className="scene-text">
                                {item.label}
                            </span>

                            <span className="scene-line"></span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}