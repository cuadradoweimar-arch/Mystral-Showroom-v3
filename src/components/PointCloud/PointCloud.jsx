import "./PointCloud.css";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import { useEffect, useState } from "react";

import LogoLoader from "../LogoLoader/LogoLoader";

/*
=====================================================
MODELO 3D — NUBE DE PUNTOS (sólo visualización)

Nube de puntos de la captura D5 XR de Mystral
(public/nube/mystral.ply: 312.843 puntos con color).
Se gira arrastrando, se acerca con la rueda o pellizcando
y gira sola despacio mientras nadie la toca.

La nube viene con Z hacia arriba (D5 / Open3D); three.js
usa Y hacia arriba, así que se rota -90° en X. El edificio
está en (10, 12, 18) de la nube: se lleva al centro.
=====================================================
*/

const PLY_URL = "/nube/mystral.ply";

const BUILDING_CENTER = [10, 12, 18];

// Aclarado de los colores (1 = colores originales)
const BRIGHTNESS = 2.4;

// Tamaño de cada punto (más grande = superficies más llenas)
const POINT_SIZE = 0.7;

function usePointCloud(url) {

    const [state, setState] = useState({ geometry: null, error: null });

    useEffect(() => {

        let cancelled = false;
        let loaded = null;

        new PLYLoader().load(
            url,
            (geometry) => {

                // Colores del render (sRGB) → espacio lineal de three,
                // aclarados: la captura es de atardecer y se ve oscura
                const colors = geometry.getAttribute("color");
                if (colors) {
                    const c = new THREE.Color();
                    for (let i = 0; i < colors.count; i++) {
                        c.setRGB(colors.getX(i), colors.getY(i), colors.getZ(i), THREE.SRGBColorSpace);
                        colors.setXYZ(
                            i,
                            Math.min(1, c.r * BRIGHTNESS),
                            Math.min(1, c.g * BRIGHTNESS),
                            Math.min(1, c.b * BRIGHTNESS),
                        );
                    }
                }

                geometry.translate(...BUILDING_CENTER.map((v) => -v));
                geometry.rotateX(-Math.PI / 2);

                loaded = geometry;

                if (cancelled) geometry.dispose();
                else setState({ geometry, error: null });
            },
            undefined,
            (error) => !cancelled && setState({ geometry: null, error }),
        );

        return () => {
            cancelled = true;
            loaded?.dispose();
        };

    }, [url]);

    return state;
}

export default function PointCloud({ onBack }) {

    const { geometry, error } = usePointCloud(PLY_URL);

    return (

        <div className="point-cloud">

            <Canvas
                camera={{ position: [70, 45, 90], fov: 50, near: 0.5, far: 3000 }}
                dpr={[1, 2]}
                gl={{ antialias: true }}
            >

                <color attach="background" args={["#05070b"]} />

                {geometry && (
                    <points geometry={geometry}>
                        <pointsMaterial
                            size={POINT_SIZE}
                            sizeAttenuation
                            vertexColors
                            toneMapped={false}
                        />
                    </points>
                )}

                <OrbitControls
                    target={[0, 0, 0]}
                    enableDamping
                    dampingFactor={0.08}
                    autoRotate
                    autoRotateSpeed={0.4}
                    minDistance={12}
                    maxDistance={450}
                    // No pasar por debajo del suelo
                    maxPolarAngle={Math.PI / 2.05}
                />

            </Canvas>

            <div className="point-cloud-info">
                <span>MYSTRAL</span>
                <h1>MODELO 3D</h1>
            </div>

            <p className="point-cloud-hint">
                Arrastra para girar · Rueda o pellizca para acercar
            </p>

            <button className="point-cloud-back" onClick={onBack}>
                ← VOLVER
            </button>

            {!geometry && !error && <LogoLoader className="is-embedded" />}

            {error && (
                <div className="point-cloud-error">
                    No se pudo cargar el modelo 3D
                </div>
            )}

        </div>

    );
}
