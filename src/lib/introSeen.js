/*
=====================================================
¿YA VIO LA INTRO EN ESTA VISITA?

sessionStorage: dura mientras la pestaña esté abierta.
Si el navegador no lo permite (modo privado estricto),
la intro simplemente vuelve a mostrarse.
=====================================================
*/

const KEY = "mystralIntroVisto";

export function hasSeenIntro() {
    try {
        return sessionStorage.getItem(KEY) === "1";
    } catch {
        return false;
    }
}

export function markIntroSeen() {
    try {
        sessionStorage.setItem(KEY, "1");
    } catch {
        // Sin almacenamiento: no pasa nada
    }
}
