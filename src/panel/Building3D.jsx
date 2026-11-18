import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Edges, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { UNIT_STATUS } from "./util";

/*
Edificio Mystral real (el mismo modelo del mapa, /intro/mystral.glb) en
transparencia, con un volumen de color por apartamento según su estado.

Medidas tomadas del modelo (metros, base en el origen):
- losas cada 3,6 m; piso 3 a 10,6 m … piso 11 a 39,4 m; terraza a 43 m
- planta típica: triángulo con el bloque Tipo B a la izquierda (x < -10)
  y el ala triangular Tipo A a la derecha; el dúplex 01 sobre el bloque B
  y el dúplex 02 sobre el ala A.
*/
const MODEL_URL = "/intro/mystral.glb";
const SLAB = (floor) => 10.6 + (floor - 3) * 3.6;

const PLAN_B = [[-22.3, -10.4], [-10, -4.8], [-10, 10.2], [-22.3, 10.2]];
const PLAN_A = [[-10, -4.8], [15.2, 6.8], [15.2, 8.6], [13, 10.1], [-10, 10.2]];

function volumeOf(unit) {
    const duplex = unit.floor === "10-11";
    const left = duplex ? unit.id === "D01" : unit.type === "B";
    const y0 = duplex ? SLAB(10) : SLAB(Number(unit.floor));
    const height = duplex ? 3.6 * 2 - 0.25 : 3.6 - 0.25;
    return { plan: left ? PLAN_B : PLAN_A, y0: y0 + 0.08, height };
}

function useVolumeGeometry(plan, height) {
    return useMemo(() => {
        // la forma se dibuja en (x, -z) y se extruye hacia arriba
        const shape = new THREE.Shape(plan.map(([x, z]) => new THREE.Vector2(x, -z)));
        const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
        geometry.rotateX(-Math.PI / 2);
        return geometry;
    }, [plan, height]);
}

function UnitVolume({ unit, dim, selected, onSelect, onHover }) {
    const { plan, y0, height } = volumeOf(unit);
    const geometry = useVolumeGeometry(plan, height);
    const color = UNIT_STATUS[unit.status]?.color || "#888";
    return (
        <mesh
            geometry={geometry}
            position={[0, y0, 0]}
            onClick={(e) => { e.stopPropagation(); onSelect(unit.id); }}
            onPointerOver={(e) => { e.stopPropagation(); onHover(unit.id); document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { onHover(null); document.body.style.cursor = ""; }}
        >
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={selected ? 0.7 : 0.22}
                transparent
                opacity={dim ? 0.1 : selected ? 0.95 : 0.78}
                depthWrite={!dim}
            />
            <Edges color={selected ? "#ffffff" : "#0b0c10"} threshold={20} />
        </mesh>
    );
}

// El modelo, en vidrio blanco: se ve la arquitectura y, dentro, los colores
function GhostModel() {
    const { scene } = useGLTF(MODEL_URL);
    const ghost = useMemo(() => {
        const material = new THREE.MeshStandardMaterial({ color: "#e9e6df", transparent: true, opacity: 0.2, depthWrite: false, roughness: 0.8 });
        const copy = scene.clone(true);
        copy.traverse((o) => {
            if (o.isMesh) { o.material = material; o.raycast = () => {}; }
        });
        return copy;
    }, [scene]);
    return <primitive object={ghost} />;
}

export default function Building3D({ units, focusFloor, selectedId, onSelect }) {

    const [hover, setHover] = useState(null);

    return (
        <div className="p-building">
            <Canvas camera={{ position: [78, 50, 92], fov: 30 }} dpr={[1, 2]} onPointerMissed={() => onSelect(null)}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[40, 80, 50]} intensity={1.1} />
                <directionalLight position={[-50, 20, -40]} intensity={0.35} />
                <group rotation={[0, 0.25, 0]}>
                    {units.map((unit) => (
                        <UnitVolume
                            key={unit.id}
                            unit={unit}
                            dim={Boolean(focusFloor) && unit.floor !== focusFloor}
                            selected={selectedId === unit.id || hover === unit.id}
                            onSelect={onSelect}
                            onHover={setHover}
                        />
                    ))}
                    {/* el modelo llega después (8 MB); mientras, se ven los volúmenes */}
                    <Suspense fallback={null}>
                        <GhostModel />
                    </Suspense>
                </group>
                <OrbitControls
                    target={[0, 24, 0]}
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={!selectedId && !hover}
                    autoRotateSpeed={0.6}
                    minPolarAngle={0.5}
                    maxPolarAngle={1.5}
                />
            </Canvas>
        </div>
    );
}
