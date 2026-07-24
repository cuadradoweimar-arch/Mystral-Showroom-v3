import "./Fullscreen.css";
import { useEffect, useState } from "react";

export default function Fullscreen() {

    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {

        const change = () => {
            setFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", change);

        return () => {
            document.removeEventListener("fullscreenchange", change);
        };

    }, []);

    const toggleFullscreen = async () => {

        if (!document.fullscreenElement) {

            await document.documentElement.requestFullscreen();

        } else {

            await document.exitFullscreen();

        }

    };

    return (

        <button
            className="fullscreen"
            onClick={toggleFullscreen}
            title={fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        >
            {fullscreen ? "🗗" : "⛶"}
        </button>

    );

}