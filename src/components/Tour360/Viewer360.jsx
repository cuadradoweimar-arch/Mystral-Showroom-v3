import { Canvas, useThree } from "@react-three/fiber";
import {
    OrbitControls,
    useTexture,
    Html
} from "@react-three/drei";
import * as THREE from "three";
import { useEffect } from "react";

// =========================================================
// PRECARGA DE PANORAMAS
// =========================================================

export function preloadPanoramas(images) {
    images.forEach((image) => {
        const img = new Image();

        img.decoding = "async";
        img.loading = "eager";

        img.src = image;
    });
}

// =========================================================
// HOTSPOT DE RECORRIDO
// =========================================================

function TourHotspot({
    position = [-3.0, -0.8, 4],
    label = "SIGUIENTE",
    onClick
}) {
    return (
        <group position={position}>
            <Html
                center
                distanceFactor={5}
                style={{
                    pointerEvents: "auto",
                    userSelect: "none"
                }}
            >
                <button
                    onClick={(event) => {
                        event.stopPropagation();

                        if (onClick) {
                            onClick();
                        }
                    }}
                    style={{
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        margin: 0,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    {/* =================================================
                        FLECHA
                    ================================================== */}

                    <div
                        style={{
                            width: "110px",
                            height: "80px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            animation:
                                "tourHotspotFloat 1.8s ease-in-out infinite",
                            filter:
                                "drop-shadow(0 5px 8px rgba(0,0,0,.65))"
                        }}
                    >
                        <svg
                            width="90"
                            height="55"
                            viewBox="0 0 90 55"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 38 L45 10 L78 38"
                                stroke="#FFFFFF"
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* =================================================
                        NOMBRE
                    ================================================== */}

                    <span
                        style={{
                            marginTop: "-4px",
                            color: "#FFFFFF",
                            fontFamily:
                                "Montserrat, sans-serif",
                            fontSize: "16px",
                            fontWeight: "400",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                            textShadow:
                                "0 2px 10px rgba(0,0,0,.95)"
                        }}
                    >
                        {label}
                    </span>
                </button>

                {/* =================================================
                    ANIMACIÓN
                ================================================== */}

                <style>
                    {`
                        @keyframes tourHotspotFloat {
                            0% {
                                transform: translateY(0);
                            }

                            50% {
                                transform: translateY(-6px);
                            }

                            100% {
                                transform: translateY(0);
                            }
                        }
                    `}
                </style>
            </Html>
        </group>
    );
}

// =========================================================
// PANORAMA
// =========================================================

function Panorama({ image }) {
    const texture = useTexture(image);

    texture.colorSpace = THREE.SRGBColorSpace;

    return (
        <mesh scale={[-1, 1, 1]}>
            <sphereGeometry args={[500, 32, 32]} />

            <meshBasicMaterial
                map={texture}
                side={THREE.BackSide}
            />
        </mesh>
    );
}

// =========================================================
// ZOOM DE CÁMARA
// =========================================================

function CameraZoom() {
    const { camera, gl } = useThree();

    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault();

            camera.fov += e.deltaY * 0.03;

            camera.fov = THREE.MathUtils.clamp(
                camera.fov,
                35,
                75
            );

            camera.updateProjectionMatrix();
        };

        const handleDoubleClick = () => {
            camera.fov = 75;

            camera.updateProjectionMatrix();
        };

        gl.domElement.addEventListener(
            "wheel",
            handleWheel,
            {
                passive: false
            }
        );

        gl.domElement.addEventListener(
            "dblclick",
            handleDoubleClick
        );

        return () => {
            gl.domElement.removeEventListener(
                "wheel",
                handleWheel
            );

            gl.domElement.removeEventListener(
                "dblclick",
                handleDoubleClick
            );
        };
    }, [camera, gl]);

    return null;
}

// =========================================================
// VISOR 360
// =========================================================

export default function Viewer360({
    image,
    hotspots = []
}) {
    return (
        <Canvas
            camera={{
                position: [0, 0, 0.1],
                fov: 75
            }}
            dpr={[1, 1.5]}
            gl={{
                antialias: false,
                powerPreference: "high-performance"
            }}
            style={{
                width: "100%",
                height: "100%"
            }}
        >
            {/* =================================================
                PANORAMA
            ================================================== */}

            <Panorama image={image} />

            {/* =================================================
                HOTSPOTS
            ================================================== */}

            {hotspots.map((hotspot, index) => (
                <TourHotspot
                    key={index}
                    position={hotspot.position}
                    label={hotspot.label}
                    onClick={hotspot.onClick}
                />
            ))}

            {/* =================================================
                ZOOM
            ================================================== */}

            <CameraZoom />

            {/* =================================================
                CONTROLES 360
            ================================================== */}

            <OrbitControls
                enablePan={false}
                enableZoom={false}
                rotateSpeed={0.45}
                enableDamping
                dampingFactor={0.08}
            />
        </Canvas>
    );
}