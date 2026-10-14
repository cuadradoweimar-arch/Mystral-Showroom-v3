import "./Fullscreen.css";

import { useEffect, useState } from "react";

import {
    FULLSCREEN_EVENTS,
    isFullscreen,
    isFullscreenSupported,
    toggleFullscreen,
} from "../../lib/fullscreen";

export default function Fullscreen({ raised = false }) {

    const [active, setActive] = useState(isFullscreen);

    useEffect(() => {

        const change = () => setActive(isFullscreen());

        FULLSCREEN_EVENTS.forEach((name) => document.addEventListener(name, change));

        return () => {
            FULLSCREEN_EVENTS.forEach((name) => document.removeEventListener(name, change));
        };

    }, []);

    // iPhone no permite pantalla completa en páginas web.
    if (!isFullscreenSupported()) return null;

    const label = active ? "Salir de pantalla completa" : "Pantalla completa";

    return (

        <button
            className={`fullscreen-button ${raised ? "raised" : ""}`}
            onClick={toggleFullscreen}
            title={label}
            aria-label={label}
        >
            {active ? "🗗" : "⛶"}
        </button>

    );

}
