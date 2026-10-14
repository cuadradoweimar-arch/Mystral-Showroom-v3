/*
=====================================================
PANTALLA COMPLETA

Incluye el prefijo webkit (Safari en iPad).
En iPhone no existe la API: el botón se oculta.
=====================================================
*/

export const FULLSCREEN_EVENTS = ["fullscreenchange", "webkitfullscreenchange"];

export function isFullscreenSupported() {
    return Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled);
}

export function isFullscreen() {
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement);
}

export async function toggleFullscreen() {

    const root = document.documentElement;

    try {
        if (isFullscreen()) {
            await (document.exitFullscreen?.() ?? document.webkitExitFullscreen?.());
        } else {
            await (root.requestFullscreen?.() ?? root.webkitRequestFullscreen?.());
        }
    } catch (error) {
        console.warn("No se pudo cambiar la pantalla completa:", error);
    }
}
