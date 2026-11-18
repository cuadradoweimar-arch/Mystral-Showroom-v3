import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Edges, OrbitControls } from "@react-three/drei";
import { PANEL_FLOORS, UNIT_STATUS } from "./util";

/*
Edificio esquemático pintado por estado: un volumen por unidad.
Pisos 3–9: Tipo B a la izquierda y Tipo A a la derecha; dúplex arriba.
Arrastrar gira el edificio · pasar por encima resalta · clic selecciona.
*/
const FLOOR_H = 3.2;
const W = 10, D = 12, GAP = 0.6;

function layout(unit) {
    const index = PANEL_FLOORS.indexOf(unit.floor);
    const h = unit.floor === "10-11" ? FLOOR_H * 2 - 0.3 : FLOOR_H - 0.3;
    const left = unit.type === "B" || unit.id === "D01";
    return {
        position: [left ? -(W + GAP) / 2 : (W + GAP) / 2, 2 * FLOOR_H + index * FLOOR_H + h / 2, 0],
        size: [W, h, D],
    };
}

function UnitBox({ unit, dim, selected, onSelect, onHover }) {
    const { position, size } = layout(unit);
    const color = UNIT_STATUS[unit.status]?.color || "#888";
    return (
        <mesh
            position={position}
            onClick={(e) => { e.stopPropagation(); onSelect(unit.id); }}
            onPointerOver={(e) => { e.stopPropagation(); onHover(unit.id); document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { onHover(null); document.body.style.cursor = ""; }}
        >
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} transparent opacity={dim ? 0.16 : 0.92} emissive={color} emissiveIntensity={selected ? 0.55 : 0.12} />
            <Edges color={selected ? "#ffffff" : "#0b0c10"} />
        </mesh>
    );
}

export default function Building3D({ units, focusFloor, selectedId, onSelect }) {

    const [hover, setHover] = useState(null);
    const top = 2 * FLOOR_H + (PANEL_FLOORS.length + 1) * FLOOR_H;

    return (
        <div className="p-building">
            <Canvas camera={{ position: [44, 30, 52], fov: 32 }} dpr={[1, 2]} onPointerMissed={() => onSelect(null)}>
                <ambientLight intensity={0.55} />
                <directionalLight position={[20, 40, 25]} intensity={1.1} />
                <directionalLight position={[-25, 10, -20]} intensity={0.35} />
                <group position={[0, -top / 2, 0]}>
                    {/* plataforma (pisos 1–2: acceso y parqueadero) */}
                    <mesh position={[0, FLOOR_H, 0]}>
                        <boxGeometry args={[W * 2 + GAP + 2, FLOOR_H * 2 - 0.3, D + 2]} />
                        <meshStandardMaterial color="#2a2d36" />
                    </mesh>
                    {units.map((unit) => (
                        <UnitBox
                            key={unit.id}
                            unit={unit}
                            dim={Boolean(focusFloor) && unit.floor !== focusFloor}
                            selected={selectedId === unit.id || hover === unit.id}
                            onSelect={onSelect}
                            onHover={setHover}
                        />
                    ))}
                </group>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate={!selectedId && !hover} autoRotateSpeed={0.7} minPolarAngle={0.6} maxPolarAngle={1.45} />
            </Canvas>
        </div>
    );
}
