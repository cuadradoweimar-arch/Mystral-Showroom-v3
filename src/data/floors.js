import roofPlan from "../assets/images/levels/levels.jpg";
import typicalPlan from "../assets/images/levels/planta-tipica-3-8.jpg";
import penthousePlan from "../assets/images/apartments/apartments-overview.jpg";

import { UNITS } from "./units";

/*
=====================================================
PISOS DE LA SECCIÓN "NIVELES" (de arriba hacia abajo)

id:     aparece en la URL (#/niveles/8)
label:  nombre en la etiqueta del piso
short:  número en la columna de pisos (ej. "8°")
plan:   imagen de planta que se muestra de fondo
        (sin plan se mantiene la planta anterior)
units:  "floor" del inventario (src/data/units.js)
pins:   etiquetas de las unidades sobre la planta
tour:   recorrido 360 propio del piso (ej. la terraza)
soon:   aún sin contenido → "Próximamente"
=====================================================
*/

/*
Etiquetas sobre la planta típica (pisos 3 al 9).
Una por tipología; x / y = proporción de la imagen (0-1).
ratio = ancho / alto de la imagen, para ubicarlas igual
que el fondo (background-size: cover).

Tipo A en el ala triangular y Tipo B en el bloque
izquierdo (confirmado por el cliente).
*/
const TYPICAL_PINS = {
    ratio: 2048 / 1577,
    byType: {
        A: { x: 0.56, y: 0.6 },
        B: { x: 0.22, y: 0.52 },
    },
};

export const FLOORS = [
    { id: "terraza", label: "TERRAZA", short: "Terraza", detail: "Zonas comunes", plan: roofPlan, tour: "project" },
    { id: "10-11", label: "DÚPLEX", short: "10-11°", detail: "Pisos 10-11", units: "10-11" },
    { id: "9", label: "PENTHOUSE", short: "9°", detail: "Piso 9", plan: penthousePlan, units: "9", pins: TYPICAL_PINS },
    { id: "8", label: "NIVEL 8", short: "8°", plan: typicalPlan, units: "8", pins: TYPICAL_PINS },
    { id: "7", label: "NIVEL 7", short: "7°", plan: typicalPlan, units: "7", pins: TYPICAL_PINS },
    { id: "6", label: "NIVEL 6", short: "6°", plan: typicalPlan, units: "6", pins: TYPICAL_PINS },
    { id: "5", label: "NIVEL 5", short: "5°", plan: typicalPlan, units: "5", pins: TYPICAL_PINS },
    { id: "4", label: "NIVEL 4", short: "4°", plan: typicalPlan, units: "4", pins: TYPICAL_PINS },
    { id: "3", label: "NIVEL 3", short: "3°", plan: typicalPlan, units: "3", pins: TYPICAL_PINS },
    { id: "parqueadero", label: "PARQUEADERO", short: "2°", detail: "Piso 2", soon: true },
];

export const DEFAULT_FLOOR = FLOORS[0];

export function findFloor(id) {
    return FLOORS.find((floor) => floor.id === id) ?? null;
}

export function floorUnits(floor) {
    return floor.units ? UNITS.filter((unit) => unit.floor === floor.units) : [];
}

export function availableCount(floor) {
    return floorUnits(floor).filter((unit) => unit.status === "disponible").length;
}

// Texto corto de disponibilidad del piso
export function floorSummary(floor) {

    if (floor.soon) return "Próximamente";

    const total = floorUnits(floor).length;

    if (!total) return floor.detail;

    const available = availableCount(floor);

    if (!available) return "Vendido";

    return `${available} disponible${available === 1 ? "" : "s"} de ${total}`;
}

// Planta de fondo: la del piso o, si no tiene, la del piso
// más cercano hacia arriba que sí tenga (evita fondos vacíos).
export function floorPlan(floor) {
    const index = FLOORS.indexOf(floor);
    for (let i = index; i >= 0; i--) {
        if (FLOORS[i].plan) return FLOORS[i].plan;
    }
    return DEFAULT_FLOOR.plan;
}
