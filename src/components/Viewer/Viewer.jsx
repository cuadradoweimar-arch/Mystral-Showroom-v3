import "./Viewer.css";

import { useEffect, useRef, useState } from "react";

import Transition from "../Transition/Transition";
import LevelsOverlay from "./LevelsOverlay";
import ExplorerPanel from "./ExplorerPanel";
import ApartmentSelector from "./ApartmentSelector";

import { SCENES } from "../../data/scenes";
import { videoSources } from "../../lib/media";

const GALLERY_TRANSITION_VIDEO = "fachada-a-ingreso";

// Duración del zoom hacia la franja antes de abrir un tour
// (igual que .viewer.is-leaving en Viewer.css).
const LEAVE_TO_TOUR_MS = 650;

// Tiempo que se muestra el aviso de "en mantenimiento".
const NOTICE_MS = 3500;

export default function Viewer({ scene, goTo, back }) {

    const config = SCENES[scene];

    // Video "fachada → ingreso" en curso (sólo en VER DISPONIBLE).
    const [galleryTransition, setGalleryTransition] = useState(false);

    // Al cambiar de escena se limpia el estado de la anterior.
    const [previousScene, setPreviousScene] = useState(scene);

    if (previousScene !== scene) {
        setPreviousScene(scene);
        setGalleryTransition(false);
    }

    const isGallery = scene === "gallery";
    const showGalleryUi = isGallery && !galleryTransition;

    // =====================================================
    // FRANJAS DE NIVELES → TOUR 360
    // El Viewer se desmonta al abrir el tour, así que el zoom
    // hacia la franja tocada se anima aquí antes de navegar.
    // =====================================================

    const [leavingTo, setLeavingTo] = useState(null);
    const [notice, setNotice] = useState(null);

    const leaveTimer = useRef(null);
    const noticeTimer = useRef(null);

    useEffect(() => () => {
        clearTimeout(leaveTimer.current);
        clearTimeout(noticeTimer.current);
    }, []);

    const handleLevelSelect = (level, origin) => {

        if (leavingTo) return;

        if (level.status === "maintenance") {
            setNotice(level);
            clearTimeout(noticeTimer.current);
            noticeTimer.current = setTimeout(() => setNotice(null), NOTICE_MS);
            return;
        }

        setNotice(null);
        setLeavingTo(origin);
        leaveTimer.current = setTimeout(() => goTo(level.target), LEAVE_TO_TOUR_MS);
    };

    // =====================================================
    // VIDEO DE LA ESCENA
    // =====================================================

    const videoName = isGallery && galleryTransition
        ? GALLERY_TRANSITION_VIDEO
        : config.video;

    const video = videoName ? videoSources(videoName) : null;

    const handleVideoEnded = () => {

        if (config.next) {
            // La intro de ubicación no queda en el historial.
            goTo(config.next, { replace: true });
            return;
        }

        if (isGallery && galleryTransition) {
            goTo("ingreso");
        }
    };

    const handleGalleryArrow = () => {
        setNotice(null);
        setGalleryTransition(true);
    };

    return (

        <div
            className={`viewer ${leavingTo ? "is-leaving" : ""}`}
            style={leavingTo ? { transformOrigin: `${leavingTo.x * 100}% ${leavingTo.y * 100}%` } : undefined}
        >

            {/* =====================================
                    TRANSICIÓN CINEMATOGRÁFICA
                ====================================== */}

            <Transition scene={scene}>

                <div className="layer">

                    {video ? (

                        <video
                            key={videoName}
                            className="layer-video"
                            src={video.src}
                            poster={video.poster}
                            autoPlay
                            muted
                            playsInline
                            loop={config.loop && !galleryTransition}
                            preload="auto"
                            onEnded={handleVideoEnded}
                        />

                    ) : (

                        <div
                            className="background-image"
                            style={{ backgroundImage: `url(${config.image})` }}
                        />

                    )}

                    {/* Franjas de niveles: abren el tour de su apartamento */}
                    {showGalleryUi && (
                        <LevelsOverlay onSelect={handleLevelSelect} />
                    )}

                </div>

            </Transition>

            {/* =====================================
                    HOTSPOT DEL INGRESO → PANORAMA 360
                ====================================== */}

            {scene === "ingreso" && (

                <button
                    className="ingreso-hotspot"
                    aria-label="Explorar ingreso en 360°"
                    onClick={() => goTo("ingresoPanorama")}
                >
                    <span className="ingreso-hotspot-dot"></span>
                </button>

            )}

            {/* =====================================
                    FLECHA DE VER DISPONIBLE
                    atras a frente.mp4 → INGRESO
                ====================================== */}

            {showGalleryUi && (

                <button
                    className="facade-arrow"
                    aria-label="Continuar hacia ingreso"
                    onClick={handleGalleryArrow}
                >
                    ‹
                </button>

            )}

            {/* =====================================
                    AVISO: RECORRIDO EN MANTENIMIENTO
                ====================================== */}

            {showGalleryUi && notice && (

                <div className="level-card" role="status" key={notice.id}>

                    <button
                        className="level-card-close"
                        aria-label="Cerrar aviso"
                        onClick={() => setNotice(null)}
                    >
                        ×
                    </button>

                    <span className="level-card-label">
                        {notice.name}
                    </span>

                    <h2>
                        {notice.floors}
                    </h2>

                    <p>
                        Recorrido en mantenimiento
                    </p>

                    <strong>
                        Disponible próximamente
                    </strong>

                </div>

            )}

            {/* =====================================
                    PANEL EXPLORAR
                ====================================== */}

            {(scene === "levels" || scene === "apartmentsOverview") && (
                <ExplorerPanel scene={scene} goTo={goTo} />
            )}

            {/* =====================================
                    TARJETAS APARTAMENTOS
                ====================================== */}

            {scene === "apartments" && (
                <ApartmentSelector goTo={goTo} />
            )}

            {/* =====================================
                    BOTÓN VOLVER
                ====================================== */}

            {scene !== "home" && (

                <button
                    className="back-button"
                    onClick={back}
                >
                    ← VOLVER
                </button>

            )}

        </div>

    );

}
