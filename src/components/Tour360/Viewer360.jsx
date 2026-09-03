import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useEffect } from "react";

// =========================================================
// PRECARGA DE PANORAMAS
// =========================================================

export function preloadPanoramas(images) {
    images.forEach((image) => {
        const img = new Image();

        img.src = image;
    });
}

// =========================================================
// PANORAMA
// =========================================================

function Panorama({ image }) {

    const texture = useTexture(image);

    texture.colorSpace = THREE.SRGBColorSpace;

    return (

        <mesh scale={[-1, 1, 1]}>

            <sphereGeometry args={[500, 64, 64]} />

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

export default function Viewer360({ image }) {

    return (

        <Canvas

            camera={{
                position: [0, 0, 0.1],
                fov: 75
            }}

            style={{
                width: "100%",
                height: "100%"
            }}

        >

            <Panorama image={image} />

            <CameraZoom />

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