import { useCallback, useEffect, useState } from "react";

import { SCENES, sceneFromPath } from "../data/scenes";

/*
=====================================================
NAVEGACIÓN ENTRE ESCENAS

La escena vive en la URL (#/tipo-a/cocina), así:
- el botón "atrás" del navegador/celular funciona,
- se puede compartir el enlace de una escena.

history.state.depth cuenta cuántas escenas hay detrás
dentro del showroom; si es 0, "VOLVER" usa SCENES[x].back.
=====================================================
*/

function readLocation() {

    const [path = "", room] = window.location.hash
        .replace(/^#\/?/, "")
        .split("/");

    return {
        scene: sceneFromPath(decodeURIComponent(path)) ?? "home",
        room: room ? decodeURIComponent(room) : null,
    };
}

function urlFor(scene, room) {

    const { path } = SCENES[scene];

    if (!path) {
        return window.location.pathname + window.location.search;
    }

    return `#/${path}${room ? `/${room}` : ""}`;
}

const currentDepth = () => window.history.state?.depth ?? 0;

export default function useSceneRouter() {

    const [location, setLocation] = useState(readLocation);

    useEffect(() => {

        if (window.history.state?.depth === undefined) {
            window.history.replaceState({ depth: 0 }, "");
        }

        const handlePopState = () => setLocation(readLocation());

        window.addEventListener("popstate", handlePopState);

        return () => window.removeEventListener("popstate", handlePopState);

    }, []);

    const goTo = useCallback((scene, { replace = false, room = null } = {}) => {

        const depth = replace ? currentDepth() : currentDepth() + 1;
        const method = replace ? "replaceState" : "pushState";

        window.history[method]({ depth }, "", urlFor(scene, room));

        setLocation({ scene, room });

    }, []);

    const { scene } = location;

    // Cambiar de habitación no crea entrada en el historial:
    // "atrás" sale del recorrido en vez de recorrer cada habitación.
    const setRoom = useCallback((room) => {

        window.history.replaceState({ depth: currentDepth() }, "", urlFor(scene, room));

        setLocation({ scene, room });

    }, [scene]);

    const back = useCallback(() => {

        if (currentDepth() > 0) {
            window.history.back();
            return;
        }

        goTo(SCENES[scene].back ?? "home", { replace: true });

    }, [goTo, scene]);

    return { scene, room: location.room, goTo, setRoom, back };
}
