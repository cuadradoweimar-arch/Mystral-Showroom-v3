import { useEffect, useState } from "react";

import LogoLoader from "./LogoLoader";

/*
=====================================================
CARGA INICIAL DE LA APLICACIÓN

Se muestra al abrir el showroom y se desvanece cuando:
  - la página terminó de cargar (window "load"),
  - el video de la escena inicial puede reproducirse
    (con un límite de espera), y
  - pasó un tiempo mínimo, para que el giro no sea un
    parpadeo en conexiones rápidas.
=====================================================
*/

const MIN_VISIBLE_MS = 1800;
const MAX_VIDEO_WAIT_MS = 6000;
const FADE_MS = 800; // igual que .logo-loader.is-leaving

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pageLoaded = () => new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
});

function firstVideoReady() {

    const video = document.querySelector("video");

    if (!video || video.readyState >= 3) return Promise.resolve();

    return Promise.race([
        new Promise((resolve) => {
            video.addEventListener("canplay", resolve, { once: true });
            video.addEventListener("error", resolve, { once: true });
        }),
        delay(MAX_VIDEO_WAIT_MS),
    ]);
}

export default function AppLoader() {

    // loading → leaving (fundido) → done (se desmonta)
    const [phase, setPhase] = useState("loading");

    useEffect(() => {

        let cancelled = false;

        Promise.all([
            pageLoaded().then(firstVideoReady),
            delay(MIN_VISIBLE_MS),
        ]).then(() => {
            if (cancelled) return;
            setPhase("leaving");
            setTimeout(() => !cancelled && setPhase("done"), FADE_MS);
        });

        return () => {
            cancelled = true;
        };

    }, []);

    if (phase === "done") return null;

    return <LogoLoader leaving={phase === "leaving"} />;
}
