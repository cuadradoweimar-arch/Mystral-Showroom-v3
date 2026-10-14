import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useState } from "react";

import { loadPanoramaTexture, prefetchPanoramas } from "./panoramaLoader";


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

                    <span className="tour-hotspot-arrow">

                        <svg width="90" height="55" viewBox="0 0 90 55" fill="none">
                            <path
                                d="M12 38 L45 10 L78 38"
                                stroke="#FFFFFF"
                                strokeWidth="10"
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

function Panorama({ texture }) {

    return (
        <mesh scale={[-1, 1, 1]}>
            <sphereGeometry args={[500, 64, 32]} />
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </mesh>
    );
}


// =========================================================
// ZOOM DE CÁMARA (RUEDA DEL MOUSE / DOBLE CLIC)
// =========================================================

function CameraZoom() {

    const { camera, gl, invalidate } = useThree();

    useEffect(() => {

        const setFov = (fov) => {
            camera.fov = THREE.MathUtils.clamp(fov, 35, 75);
            camera.updateProjectionMatrix();
            invalidate();
        };

        const handleWheel = (e) => {
            e.preventDefault();
            setFov(camera.fov + e.deltaY * 0.03);
        };

        const handleDoubleClick = () => setFov(75);

        const canvas = gl.domElement;

        canvas.addEventListener("wheel", handleWheel, { passive: false });
        canvas.addEventListener("dblclick", handleDoubleClick);

        return () => {
            canvas.removeEventListener("wheel", handleWheel);
            canvas.removeEventListener("dblclick", handleDoubleClick);
        };

    }, [camera, gl, invalidate]);

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

    const { texture, ready, progress, error, retry } = usePanoramaTexture(image);

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
                dpr={[1, 1.5]}
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

                <CameraZoom />

                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    rotateSpeed={0.45}
                    enableDamping
                    dampingFactor={0.08}
                />

            </Canvas>

            {!ready && (

                <div className={`viewer360-loader ${texture ? "is-overlay" : ""}`}>

                    {error ? (
                        <>
                            <span>No se pudo cargar el panorama</span>
                            <button onClick={retry}>REINTENTAR</button>
                        </>
                    ) : (
                        <>
                            <span className="viewer360-spinner" />
                            <span>CARGANDO {Math.round(progress * 100)}%</span>
                        </>
                    )}

                </div>

            )}

        </div>

    );
}
