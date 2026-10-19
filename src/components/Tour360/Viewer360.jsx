import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useState } from "react";

import { loadPanoramaTexture, prefetchPanoramas } from "./panoramaLoader";
import ZoomControls from "../Viewer/ZoomControls";
import LogoLoader from "../LogoLoader/LogoLoader";


// =========================================================
// HOTSPOT DE RECORRIDO (FLECHA)
// =========================================================

function TourHotspot({ position, label, onClick }) {

    return (
        <group position={position}>

            <Html
                center
                distanceFactor={5}
                style={{ pointerEvents: "auto", userSelect: "none" }}
            >

                <button
                    className="tour-hotspot"
                    aria-label={label}
                    onClick={(event) => {
                        event.stopPropagation();
                        onClick?.();
                    }}
                >

                    {/* Chevrón ancho y bajo, recostado sobre el piso (CSS) */}
                    <span className="tour-hotspot-arrow">

                        <svg width="120" height="44" viewBox="0 0 120 44" fill="none">
                            <path
                                d="M12 34 L60 12 L108 34"
                                stroke="#FFFFFF"
                                strokeWidth="11"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                    </span>

                    <span className="tour-hotspot-label">
                        {label}
                    </span>

                </button>

            </Html>

        </group>
    );
}


// =========================================================
// PANORAMA
// =========================================================

// - 128×64 segmentos: las líneas rectas del render no se
//   quiebran en las caras de la esfera ni se deforman en los polos.
// - toneMapped={false}: muestra los colores exactos del render
//   (si no, three aplica su curva de tono y los apaga).
function Panorama({ texture }) {

    return (
        <mesh scale={[-1, 1, 1]}>
            <sphereGeometry args={[500, 128, 64]} />
            <meshBasicMaterial map={texture} side={THREE.BackSide} toneMapped={false} />
        </mesh>
    );
}


// =========================================================
// ZOOM DE CÁMARA (BOTONES / RUEDA DEL MOUSE / DOBLE CLIC)
// El campo de visión (fov) vive fuera del Canvas para que
// los botones + / − puedan cambiarlo.
// =========================================================

const MIN_FOV = 35;
const MAX_FOV = 75;
const FOV_STEP = 10;

const clampFov = (fov) => THREE.MathUtils.clamp(fov, MIN_FOV, MAX_FOV);

function CameraZoom({ fov, setFov }) {

    const { camera, gl, invalidate } = useThree();

    useEffect(() => {
        camera.fov = fov;
        camera.updateProjectionMatrix();
        invalidate();
    }, [camera, fov, invalidate]);

    useEffect(() => {

        const handleWheel = (e) => {
            e.preventDefault();
            setFov((current) => clampFov(current + e.deltaY * 0.03));
        };

        const handleDoubleClick = () => setFov(MAX_FOV);

        const canvas = gl.domElement;

        canvas.addEventListener("wheel", handleWheel, { passive: false });
        canvas.addEventListener("dblclick", handleDoubleClick);

        return () => {
            canvas.removeEventListener("wheel", handleWheel);
            canvas.removeEventListener("dblclick", handleDoubleClick);
        };

    }, [gl, setFov]);

    return null;
}


// =========================================================
// CARGA DE LA TEXTURA
// Mantiene visible el panorama anterior hasta que el nuevo
// está listo y libera la memoria de GPU del anterior.
// =========================================================

function usePanoramaTexture(url) {

    const [loaded, setLoaded] = useState({ url: null, texture: null });
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {

        let cancelled = false;

        setProgress(0);
        setError(null);

        loadPanoramaTexture(url, (value) => !cancelled && setProgress(value))
            .then((texture) => {
                if (cancelled) {
                    texture.dispose();
                    return;
                }
                setLoaded({ url, texture });
            })
            .catch((err) => {
                if (!cancelled) setError(err);
            });

        return () => {
            cancelled = true;
        };

    }, [url, attempt]);

    // Al reemplazar (o desmontar) la textura se libera de la GPU.
    useEffect(() => {
        const { texture } = loaded;
        return () => texture?.dispose();
    }, [loaded]);

    return {
        texture: loaded.texture,
        ready: loaded.url === url,
        progress,
        error,
        retry: () => setAttempt((n) => n + 1),
    };
}


// =========================================================
// VISOR 360
// =========================================================

export default function Viewer360({ image, hotspots = [], prefetch = [] }) {

    const { texture, ready, error, retry } = usePanoramaTexture(image);

    const [fov, setFov] = useState(MAX_FOV);

    // Cada habitación empieza sin zoom
    const [previousImage, setPreviousImage] = useState(image);

    if (previousImage !== image) {
        setPreviousImage(image);
        setFov(MAX_FOV);
    }

    // Cuando el panorama visible terminó de cargar, se descargan
    // en segundo plano las habitaciones a las que llevan sus flechas.
    const prefetchKey = prefetch.join("|");

    useEffect(() => {
        if (ready && prefetchKey) prefetchPanoramas(prefetchKey.split("|"));
    }, [ready, prefetchKey]);

    return (

        <div className="viewer360">

            <Canvas
                frameloop="demand"
                camera={{ position: [0, 0, 0.1], fov: 75 }}
                // Resolución completa en pantallas retina / 2x
                dpr={[1, 2]}
                gl={{ antialias: false, powerPreference: "high-performance" }}
                style={{ width: "100%", height: "100%" }}
            >

                {texture && <Panorama texture={texture} />}

                {/* Las flechas corresponden al panorama nuevo:
                    se muestran cuando ya está cargado. */}
                {ready && hotspots.map((hotspot) => (
                    <TourHotspot
                        key={hotspot.key}
                        position={hotspot.position}
                        label={hotspot.label}
                        onClick={hotspot.onClick}
                    />
                ))}

                <CameraZoom fov={fov} setFov={setFov} />

                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    rotateSpeed={0.45}
                    enableDamping
                    dampingFactor={0.08}
                />

            </Canvas>

            {/* Menor fov = más cerca */}
            <ZoomControls
                className="is-tour"
                canZoomIn={fov > MIN_FOV}
                canZoomOut={fov < MAX_FOV}
                onZoomIn={() => setFov((current) => clampFov(current - FOV_STEP))}
                onZoomOut={() => setFov((current) => clampFov(current + FOV_STEP))}
            />

            {/* Carga del panorama: la misma placa con el logo */}
            {!ready && !error && (
                <LogoLoader className={`is-embedded ${texture ? "is-overlay" : ""}`} />
            )}

            {!ready && error && (

                <div className={`viewer360-loader ${texture ? "is-overlay" : ""}`}>
                    <span>No se pudo cargar el panorama</span>
                    <button onClick={retry}>REINTENTAR</button>
                </div>

            )}

        </div>

    );
}
