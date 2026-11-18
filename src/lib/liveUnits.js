/*
Estado en vivo de las unidades.

El inventario base está en src/data/units.js; el vendedor cambia los estados
desde el panel (/vendedor) y el showroom los consulta en /api/units cada
15 s y al volver a la pestaña. Los cambios se aplican sobre UNITS para que
todo lo que ya usa el inventario (niveles, plantas, fichas) se actualice.
Si el servidor no responde, el showroom sigue con los estados del archivo.
*/
import { UNITS } from "../data/units";

const STATUSES = new Set(["disponible", "reservado", "vendido"]);
const listeners = new Set();
let version = 0;
let started = false;

export const subscribeUnits = (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
};
export const unitsVersion = () => version;

async function refresh() {
    try {
        const res = await fetch("/api/units", { cache: "no-store" });
        if (!res.ok) return;
        const { statuses } = await res.json();
        let changed = false;
        for (const unit of UNITS) {
            const status = statuses?.[unit.id];
            if (STATUSES.has(status) && status !== unit.status) {
                unit.status = status;
                changed = true;
            }
        }
        if (changed) {
            version++;
            listeners.forEach((fn) => fn());
        }
    } catch {
        // sin conexión: se mantiene el último estado conocido
    }
}

export function startLiveUnits() {
    if (started || typeof window === "undefined") return;
    started = true;
    refresh();
    setInterval(() => { if (document.visibilityState === "visible") refresh(); }, 15000);
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") refresh(); });
}
