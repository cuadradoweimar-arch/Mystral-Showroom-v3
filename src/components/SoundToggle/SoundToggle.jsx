import "./SoundToggle.css";

import { useEffect, useSyncExternalStore } from "react";

import {
    getSoundState,
    initAmbientSound,
    setTrack,
    subscribeSound,
    toggleSound,
} from "../../lib/ambientAudio";

/*
=====================================================
BOTÓN DE SONIDO AMBIENTE (arriba, junto al menú)

placement: "menu"   → a la izquierda del botón de menú
           "map"    → a la izquierda de los controles del mapa
           "corner" → en la esquina (escenas sin menú)
track:     pista de la escena (scenes.js → sound); null = silencio
Se oculta si la escena no tiene pista o su archivo no existe.
=====================================================
*/

function SpeakerIcon({ muted }) {

    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
            {muted ? (
                <path d="M16 9.5l5 5M21 9.5l-5 5" />
            ) : (
                <>
                    <path d="M15.5 9a4 4 0 0 1 0 6" />
                    <path d="M18 6.5a7.5 7.5 0 0 1 0 11" />
                </>
            )}
        </svg>
    );
}

export default function SoundToggle({ placement = "corner", track = null }) {

    const { muted, playing, available } = useSyncExternalStore(subscribeSound, getSoundState);

    useEffect(() => {
        initAmbientSound();
    }, []);

    useEffect(() => {
        setTrack(track);
    }, [track]);

    if (!available) return null;

    // Sin silenciar pero aún bloqueado (sin gesto): se muestra
    // como apagado hasta que empiece a sonar
    const on = !muted && playing;
    const label = muted ? "Activar sonido" : "Silenciar sonido";

    return (

        <button
            data-sound-toggle
            className={`sound-toggle is-${placement} ${on ? "is-on" : ""}`}
            aria-label={label}
            aria-pressed={!muted}
            title={label}
            onClick={toggleSound}
        >
            <SpeakerIcon muted={!on} />
        </button>

    );
}
