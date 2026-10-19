import "./Navbar.css";
import { useEffect, useState } from "react";

const ITEMS = [
    { id: "home", label: "INICIO" },
    { id: "ingreso", label: "INGRESO" },
    { id: "project", label: "TERRAZA" },
    { id: "gallery", label: "VER DISPONIBLE" },
    { id: "apartments", label: "APARTAMENTOS" },
    { id: "levels", label: "NIVELES" },
    { id: "projects", label: "PROYECTOS" },
    { id: "pointCloud", label: "MODELO 3D" },
    { id: "brochure", label: "BROCHURE" },
];

export default function Navbar({ scene, goTo }) {

    const [menuOpen, setMenuOpen] = useState(false);

    const changeScene = (id) => {
        setMenuOpen(false);
        if (id !== scene) goTo(id);
    };

    // Escape cierra el menú
    useEffect(() => {

        if (!menuOpen) return;

        const onKeyDown = (event) => {
            if (event.key === "Escape") setMenuOpen(false);
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [menuOpen]);

    return (
        <>
            <button
                className={`menu-button ${menuOpen ? "open" : ""}`}
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuOpen}
                aria-controls="scene-menu"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Clic fuera del panel = cerrar */}
            <div
                className={`menu-backdrop ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen(false)}
            />

            <nav
                id="scene-menu"
                className={`scene-menu ${menuOpen ? "open" : ""}`}
            >
                <div className="scene-menu-items">
                    {ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => changeScene(item.id)}
                            aria-current={scene === item.id ? "page" : undefined}
                            className={`scene-item ${
                                scene === item.id ? "active" : ""
                            }`}
                        >
                            <span className="scene-text">
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>
            </nav>
        </>
    );
}
