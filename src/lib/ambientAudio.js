/*
=====================================================
SONIDO AMBIENTE POR ZONAS

Cada escena puede tener una pista (scenes.js → sound).
Al cambiar de zona hay fundido cruzado; si la escena no
tiene pista, el sonido se apaga suave. Dentro de la misma
zona el audio NO se reinicia (vive fuera de React).

- Arranca con el primer toque, clic o tecla (los
  navegadores bloquean el sonido automático).
- Entra con fundido de 2 s hasta VOLUME.
- Se pausa al salir de la pestaña o bloquear el celular y
  se reanuda al volver.
- Recuerda si se silenció (localStorage).
- Si el archivo de una pista no existe, esa zona queda en
  silencio y el botón se oculta.

El volumen va por Web Audio (GainNode): en iPhone la
propiedad audio.volume no tiene efecto.
=====================================================
*/

export const TRACKS = {
    exterior: "/audio/ambiente1.mp3",
    disponible: "/audio/disponible.mp3",
    tour: "/audio/tour360.mp3",
};

const VOLUME = 0.35;
const FADE_IN = 2;
const FADE_OUT = 1.2;
const STORAGE_KEY = "mystral-sound-muted";

// Elementos que no cuentan como "primer gesto" (el botón de
// sonido decide por sí mismo)
const IGNORE_SELECTOR = "[data-sound-toggle]";

function readMuted() {
    try {
        return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
        return false;
    }
}

function saveMuted(muted) {
    try {
        localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
    } catch {
        // Sin almacenamiento (modo privado): sólo dura esta visita
    }
}

// =====================================================
// ESTADO (objeto nuevo en cada cambio: useSyncExternalStore
// compara por referencia)
// =====================================================

let state = {
    muted: readMuted(),
    playing: false,
    track: null,       // pista de la escena actual
    available: false,  // ¿existe el archivo de esa pista?
};

const listeners = new Set();

function setState(patch) {
    state = { ...state, ...patch };
    listeners.forEach((listener) => listener());
}

export function subscribeSound(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function getSoundState() {
    return state;
}

// =====================================================
// PISTAS
// =====================================================

let context = null;
let unlocked = false;
let resumeOnReturn = false;

// name → { audio, gain, pauseTimer }
const players = {};

// name → true | false (null = aún no se sabe)
const exists = {};

// ¿Existe el archivo? Si no, el servidor devuelve la página
// principal con 200: por eso se revisa que sea audio.
function checkTrack(name) {

    if (name in exists) return;

    exists[name] = null;

    fetch(TRACKS[name], { method: "HEAD" })
        .then((response) => {
            const type = response.headers.get("content-type") ?? "";
            exists[name] = response.ok && type.startsWith("audio");
        })
        .catch(() => {
            exists[name] = false;
        })
        .finally(() => {
            if (name === state.track) {
                setState({ available: Boolean(exists[name]) });
                if (exists[name]) play();
            }
        });
}

function getContext() {

    if (context !== null) return context;

    const AudioContext = window.AudioContext || window.webkitAudioContext;

    try {
        context = AudioContext ? new AudioContext() : false;
    } catch {
        context = false;
    }

    return context;
}

function getPlayer(name) {

    if (players[name]) return players[name];

    const audio = new Audio(TRACKS[name]);
    audio.loop = true;
    audio.preload = "auto";
    audio.setAttribute("playsinline", "");

    let gain = null;
    const ctx = getContext();

    if (ctx) {
        try {
            gain = ctx.createGain();
            gain.gain.value = 0;
            ctx.createMediaElementSource(audio).connect(gain).connect(ctx.destination);
        } catch {
            gain = null;
        }
    }

    if (!gain) audio.volume = 0;

    audio.addEventListener("error", () => {
        exists[name] = false;
        if (name === state.track) setState({ available: false, playing: false });
    });

    players[name] = { audio, gain, pauseTimer: null };

    return players[name];
}

// Fundido del volumen de una pista hasta "target" en "seconds"
function fadeTo(player, target, seconds) {

    const { audio, gain } = player;

    if (gain && context) {
        const now = context.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(target, now + seconds);
        return;
    }

    // Sin Web Audio: fundido manual del volumen del elemento
    const from = audio.volume;
    const start = performance.now();

    const step = (time) => {
        const t = Math.min(1, (time - start) / (seconds * 1000));
        audio.volume = from + (target - from) * t;
        if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
}

function stopPlayer(name, { fade = true } = {}) {

    const player = players[name];

    if (!player || player.audio.paused) return;

    clearTimeout(player.pauseTimer);

    if (fade) {
        fadeTo(player, 0, FADE_OUT);
        player.pauseTimer = setTimeout(() => player.audio.pause(), FADE_OUT * 1000);
    } else {
        if (player.gain) player.gain.gain.value = 0;
        else player.audio.volume = 0;
        player.audio.pause();
    }
}

function stopOthers(keep, options) {
    Object.keys(players).forEach((name) => {
        if (name !== keep) stopPlayer(name, options);
    });
}

async function play() {

    const name = state.track;

    if (!name || state.muted || !unlocked || document.hidden) return;
    if (exists[name] !== true) return;

    stopOthers(name);

    const player = getPlayer(name);

    clearTimeout(player.pauseTimer);

    try {
        if (context && context.state === "suspended") await context.resume();
        if (player.audio.paused) await player.audio.play();
        fadeTo(player, VOLUME, FADE_IN);
        setState({ playing: true });
    } catch {
        // Bloqueado por el navegador: se intenta en el próximo gesto
    }
}

// =====================================================
// API PÚBLICA
// =====================================================

// Pista de la escena actual (null = silencio)
export function setTrack(name) {

    const track = name && TRACKS[name] ? name : null;

    if (track === state.track) return;

    if (track) checkTrack(track);

    setState({
        track,
        available: track ? Boolean(exists[track]) : false,
        playing: false,
    });

    // La pista anterior se apaga siempre (aunque la nueva no
    // exista todavía); la nueva entra con su fundido
    stopOthers(track);

    if (track) play();
}

export function toggleSound() {

    // Activado pero aún bloqueado por el navegador: el toque
    // en el botón es el gesto que faltaba → que suene
    if (!state.muted && !state.playing) {
        unlock();
        return;
    }

    const muted = !state.muted;

    saveMuted(muted);
    setState({ muted, playing: muted ? false : state.playing });

    if (muted) stopOthers(null);
    else unlock();
}

// Primer gesto: habilita el audio. En iPhone cada elemento
// <audio> tiene que reproducirse una vez dentro de un gesto
// para poder sonar después (al cambiar de zona): se crean y
// "desbloquean" todas las pistas que existen.
function unlock() {

    const ctx = getContext();
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});

    if (!unlocked) {

        unlocked = true;

        Object.keys(TRACKS).forEach((name) => {

            if (exists[name] !== true || name === state.track) return;

            const { audio } = getPlayer(name);

            audio.play()
                .then(() => {
                    if (name !== state.track) audio.pause();
                })
                .catch(() => {});
        });
    }

    play();
}

let started = false;

export function initAmbientSound() {

    if (started || typeof window === "undefined") return;
    started = true;

    // Se averigua de una vez qué pistas existen
    Object.keys(TRACKS).forEach(checkTrack);

    const events = ["pointerdown", "touchend", "keydown"];

    const onGesture = (event) => {

        if (event.target?.closest?.(IGNORE_SELECTOR)) return;

        unlock();

        if (unlocked) {
            events.forEach((name) => window.removeEventListener(name, onGesture, true));
        }
    };

    // touchend: en iPhone algunos toques no disparan pointerdown
    // como gesto válido para reproducir audio
    events.forEach((name) => window.addEventListener(name, onGesture, true));

    const pauseForBackground = () => {
        if (!state.playing) return;
        stopOthers(null, { fade: false });
        setState({ playing: false });
        resumeOnReturn = true;
    };

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            pauseForBackground();
        } else if (resumeOnReturn) {
            resumeOnReturn = false;
            play();
        }
    });

    window.addEventListener("pagehide", pauseForBackground);

    // Sólo en desarrollo: inspeccionar el audio desde la consola
    if (import.meta.env?.DEV) {
        window.__ambient = () => ({
            ...state,
            unlocked,
            exists: { ...exists },
            context: context ? context.state : null,
            players: Object.fromEntries(Object.entries(players).map(([name, p]) => [
                name,
                { paused: p.audio.paused, gain: p.gain?.gain.value ?? p.audio.volume },
            ])),
        });
    }
}
