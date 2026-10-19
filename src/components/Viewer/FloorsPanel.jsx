import { FLOORS, floorSummary } from "../../data/floors";

/*
=====================================================
SELECTOR DE PISOS (sección NIVELES)

Columna a la derecha con el número de cada piso, de
arriba hacia abajo. El piso elegido queda resaltado.
=====================================================
*/

export default function FloorsPanel({ selectedId, onSelect }) {

    return (

        <nav className="floors-strip" aria-label="Niveles">

            {FLOORS.map((floor) => {

                const active = floor.id === selectedId;

                return (

                    <button
                        key={floor.id}
                        className={`floors-strip-item ${active ? "active" : ""}`}
                        aria-current={active ? "true" : undefined}
                        aria-label={`${floor.label} · ${floorSummary(floor)}`}
                        title={`${floor.label} · ${floorSummary(floor)}`}
                        disabled={floor.soon}
                        onClick={() => onSelect(floor.id)}
                    >
                        {floor.short}
                    </button>

                );
            })}

        </nav>

    );
}
