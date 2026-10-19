import "./Viewer.css";

import { useEffect, useRef, useState } from "react";

import Transition from "../Transition/Transition";
import LevelsOverlay from "./LevelsOverlay";
import BuildingOverlay from "./BuildingOverlay";
import FloorsPanel from "./FloorsPanel";
import FloorCard from "./FloorCard";
import PlanPins from "./PlanPins";
import ApartmentSelector from "./ApartmentSelector";
import UnitCard from "./UnitCard";
import ZoomControls from "./ZoomControls";
import usePanZoom, { MAX_SCALE, MIN_SCALE } from "./usePanZoom";

import { SCENES } from "../../data/scenes";
import { UNIT_TYPES } from "../../data/units";
import { DEFAULT_FLOOR, findFloor, floorPlan, floorSummary } from "../../data/floors";
import { BUILDING_TRANSITION } from "../../data/building";
import { videoSources } from "../../lib/media";

/*
Videos de transición: se reproducen sobre la escena actual
y al terminar navegan a la siguiente.
*/
const GALLERY_TRANSITION = { video: "fachada-a-ingreso", scene: "ingreso" };

// Duración del zoom antes de abrir un tour
// (igual que .viewer.is-leaving en Viewer.css).
const LEAVE_TO_TOUR_MS = 650;

// Sin punto tocado (ej. desde la lista de un piso): zoom al centro.
const SCREEN_CENTER = { x: 0.5, y: 0.5 };

export default function Viewer({ scene, room, goTo, setRoom, back }) {

    const config = SCENES[scene];

    // Video de transición en curso ({ video, scene, room } o null).
    const [transition, setTransition] = useState(null);

    // { unit, origin } de la unidad elegida (franja o lista del piso)
    const [selected, setSelected] = useState(null);

    // Proporción ancho/alto del video o imagen de fondo: el
    // escenario mide igual, así en un celular vertical se puede
    // recorrer arrastrando de lado a lado.
    const [mediaRatio, setMediaRatio] = useState(16 / 9);

    const isGallery = scene === "gallery";
    const showGalleryUi = isGallery && !transition;
    const showIngresoUi = scene === "ingreso" && !transition;

    // Arrastre en todas las escenas; zoom (botones y rueda)
    // sólo en VER DISPONIBLE
    const zoom = usePanZoom({ zoomable: showGalleryUi, mediaRatio });

    // Al cambiar de escena se limpia el estado de la anterior.
    const [previousScene, setPreviousScene] = useState(scene);

    if (previousScene !== scene) {
        setPreviousScene(scene);
        setTransition(null);
        setSelected(null);
        zoom.reset();
    }

    // =====================================================
    // FRANJAS DE UNIDADES → FICHA → TOUR 360
    // El Viewer se desmonta al abrir el tour, así que el zoom
    // hacia la franja tocada se anima aquí antes de navegar.
    // =====================================================

    const [leavingTo, setLeavingTo] = useState(null);

    const leaveTimer = useRef(null);

    useEffect(() => () => clearTimeout(leaveTimer.current), []);

    const handleUnitSelect = (unit, origin) => {
        if (leavingTo) return;
        setSelected({ unit, origin });
    };

    const leaveTo = (target, origin = SCREEN_CENTER) => {

        if (leavingTo) return;

        setLeavingTo(origin);
        leaveTimer.current = setTimeout(() => goTo(target), LEAVE_TO_TOUR_MS);
    };

    const handleUnitTour = () => {
        if (!selected) return;
        leaveTo(UNIT_TYPES[selected.unit.type].tour, selected.origin);
    };

    // =====================================================
    // SECCIÓN NIVELES: piso elegido (va en la URL: #/niveles/8)
    // =====================================================

    const isLevels = scene === "levels";
    const floor = isLevels ? findFloor(room) ?? DEFAULT_FLOOR : null;

    const handleFloorSelect = (id) => {
        setSelected(null);
        setRoom(id === DEFAULT_FLOOR.id ? null : id);
    };

    const background = floor ? floorPlan(floor) : config.image;

    // =====================================================
    // VIDEO DE LA ESCENA
    // =====================================================

    const videoName = transition ? transition.video : config.video;

    const video = videoName ? videoSources(videoName) : null;

    // Proporción de la imagen de fondo (la del video llega
    // con onLoadedMetadata)
    useEffect(() => {

        if (videoName || !background) return;

        let cancelled = false;
        const img = new Image();

        img.onload = () => {
            if (!cancelled) setMediaRatio(img.naturalWidth / img.naturalHeight);
        };
        img.src = background;

        return () => {
            cancelled = true;
        };

    }, [background, videoName]);

    const handleVideoEnded = () => {

        if (config.next) {
            // La intro de ubicación no queda en el historial.
            goTo(config.next, { replace: true });
            return;
        }

        if (transition) {
            goTo(transition.scene, { room: transition.room ?? null });
        }
    };

    const playTransition = (next) => {
        setSelected(null);
        zoom.reset();
        setTransition(next);
    };

    return (

        <div
            className={`viewer ${leavingTo ? "is-leaving" : ""}`}
            style={leavingTo ? { transformOrigin: `${leavingTo.x * 100}% ${leavingTo.y * 100}%` } : undefined}
        >

            {/* =====================================
                    TRANSICIÓN CINEMATOGRÁFICA
                ====================================== */}

            {/* En NIVELES, al cambiar de planta también hay fundido */}
            <Transition scene={floor ? `${scene}:${background}` : scene}>

                <div className="layer">

                <div {...zoom.stageProps}>

                    {video ? (

                        <video
                            key={videoName}
                            className="layer-video"
                            src={video.src}
                            poster={video.poster}
                            autoPlay
                            muted
                            playsInline
                            loop={config.loop && !transition}
                            preload="auto"
                            onEnded={handleVideoEnded}
                            onLoadedMetadata={(event) => {
                                const { videoWidth, videoHeight } = event.currentTarget;
                                if (videoWidth && videoHeight) setMediaRatio(videoWidth / videoHeight);
                            }}
                        />

                    ) : (

                        <div
                            className="background-image"
                            style={{ backgroundImage: `url(${background})` }}
                        />

                    )}

                    {/* Máscara del edificio en INGRESO → video "frente arriba" → NIVELES */}
                    {showIngresoUi && (
                        <BuildingOverlay onSelect={() => playTransition(BUILDING_TRANSITION)} />
                    )}

                    {/* Punto del INGRESO → panorama 360 (dentro del
                        escenario: se mueve junto con el video) */}
                    {showIngresoUi && (
                        <button
                            className="ingreso-hotspot"
                            aria-label="Explorar ingreso en 360°"
                            onClick={() => goTo("ingresoPanorama")}
                        >
                            <span className="ingreso-hotspot-dot"></span>
                        </button>
                    )}

                    {/* Franjas de unidades: abren la ficha de la unidad */}
                    {showGalleryUi && (
                        <LevelsOverlay
                            selectedId={selected?.unit.id}
                            onSelect={handleUnitSelect}
                        />
                    )}

                    {/* NIVELES: etiquetas de las unidades sobre la planta */}
                    {floor?.pins && (
                        <PlanPins
                            floor={floor}
                            selectedId={selected?.unit.id}
                            onSelect={handleUnitSelect}
                        />
                    )}

                </div>

                </div>

            </Transition>

            {/* =====================================
                    FLECHA DE VER DISPONIBLE
                    atras a frente.mp4 → INGRESO
                    (se oculta mientras la ficha está abierta)
                ====================================== */}

            {showGalleryUi && !selected && (

                <button
                    className="facade-arrow"
                    aria-label="Continuar hacia ingreso"
                    onClick={() => playTransition(GALLERY_TRANSITION)}
                >
                    ‹
                </button>

            )}

            {/* Zoom de la fachada (se oculta con la ficha abierta) */}
            {showGalleryUi && !selected && (
                <ZoomControls
                    canZoomIn={zoom.scale < MAX_SCALE}
                    canZoomOut={zoom.scale > MIN_SCALE}
                    onZoomIn={zoom.zoomIn}
                    onZoomOut={zoom.zoomOut}
                />
            )}

            {/* =====================================
                    FICHA DE LA UNIDAD SELECCIONADA
                ====================================== */}

            {(showGalleryUi || isLevels) && selected && (
                <UnitCard
                    key={selected.unit.id}
                    unit={selected.unit}
                    onTour={handleUnitTour}
                    onClose={() => setSelected(null)}
                />
            )}

            {/* Leyenda de estados */}
            {showGalleryUi && (
                <div className="units-legend" aria-hidden="true">
                    <span className="is-disponible">Disponible</span>
                    <span className="is-vendido">Vendido</span>
                </div>
            )}

            {/* =====================================
                    NIVELES: SELECTOR DE PISOS + TARJETA
                ====================================== */}

            {isLevels && (
                <FloorsPanel
                    selectedId={floor.id}
                    onSelect={handleFloorSelect}
                />
            )}

            {/* Pisos con etiquetas en la planta: solo nombre y resumen */}
            {isLevels && !selected && floor.pins && (
                <div className="floor-badge" aria-live="polite">
                    <strong>{floor.label}</strong>
                    <span>{floorSummary(floor)}</span>
                </div>
            )}

            {isLevels && !selected && !floor.pins && (
                <FloorCard
                    key={floor.id}
                    floor={floor}
                    onSelectUnit={(unit) => handleUnitSelect(unit, SCREEN_CENTER)}
                    onTour={() => leaveTo(floor.tour)}
                />
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
