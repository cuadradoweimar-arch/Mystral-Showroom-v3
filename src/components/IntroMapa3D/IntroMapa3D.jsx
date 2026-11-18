import { useEffect } from "react";

import { markIntroSeen } from "../../lib/introSeen";

/*
=====================================================
INTRO 3D (#/mapa)

Muestra la escena 3D de public/intro/mystral-intro-3d.html
tal cual, en un iframe a pantalla completa. Cuando la
escena avisa con postMessage { type: "mystral:enter" } o
{ type: "mystral:skip" }, se pasa a la portada.
=====================================================
*/

const EXIT_MESSAGES = ["mystral:enter", "mystral:skip"];

export default function IntroMapa3D({ goTo }) {

    useEffect(() => {

        const onMessage = (event) => {

            // Sólo mensajes del propio sitio (el iframe es del mismo origen)
            if (event.origin !== window.location.origin) return;
            if (!EXIT_MESSAGES.includes(event.data?.type)) return;

            markIntroSeen();
            goTo("home", { replace: true });
        };

        window.addEventListener("message", onMessage);

        return () => window.removeEventListener("message", onMessage);

    }, [goTo]);

    return (
        <iframe
            title="Mystral · Intro 3D"
            src="/intro/mystral-intro-3d.html"
            allow="fullscreen"
            style={{
                position: "fixed",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
                background: "#000",
            }}
        />
    );
}
