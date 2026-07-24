import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

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

            <OrbitControls
                enablePan={false}
                enableZoom={true}
                rotateSpeed={0.45}
                minDistance={0.1}
                maxDistance={0.1}
            />

        </Canvas>

    );

}