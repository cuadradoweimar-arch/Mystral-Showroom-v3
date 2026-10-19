import {
    LEVELS,
    LEVELS_TRANSFORM,
    VIDEO_HEIGHT,
    VIDEO_WIDTH,
} from "../../data/levels";
import { findUnit, STATUS_LABELS, unitName } from "../../data/units";

/*
=====================================================
FRANJAS DE UNIDADES SOBRE LA FACHADA

Cada franja es una unidad del inventario y se pinta según
su estado (disponible / reservado / vendido). Al tocarla
se abre la ficha de la unidad.

viewBox = tamaño del video y "slice" = object-fit: cover,
así las zonas escalan y se recortan igual que el video.

onSelect(unit, origin) — origin es el punto tocado en
proporción de la pantalla (0-1), para la transición de zoom.
=====================================================
*/

const describe = (unit) => `${unitName(unit)} · ${STATUS_LABELS[unit.status]}`;

export default function LevelsOverlay({ selectedId, onSelect }) {

    return (

        <svg
            className="levels-overlay"
            viewBox={`0 0 ${VIDEO_WIDTH} ${VIDEO_HEIGHT}`}
            preserveAspectRatio="xMidYMid slice"
        >

            <g transform={LEVELS_TRANSFORM}>

                {LEVELS.map((level) => {

                    const unit = findUnit(level.unit);

                    if (!unit) return null;

                    const classes = [
                        `is-${unit.status}`,
                        unit.id === selectedId ? "is-selected" : "",
                    ].join(" ").trim();

                    return (

                        <path
                            key={level.id}
                            d={level.d}
                            className={classes}
                            role="button"
                            tabIndex={0}
                            aria-label={describe(unit)}
                            aria-pressed={unit.id === selectedId}
                            onClick={(event) => onSelect(unit, {
                                x: event.clientX / window.innerWidth,
                                y: event.clientY / window.innerHeight,
                            })}
                            onKeyDown={(event) => {
                                if (event.key !== "Enter" && event.key !== " ") return;
                                event.preventDefault();
                                const box = event.currentTarget.getBoundingClientRect();
                                onSelect(unit, {
                                    x: (box.left + box.width / 2) / window.innerWidth,
                                    y: (box.top + box.height / 2) / window.innerHeight,
                                });
                            }}
                        >
                            <title>{describe(unit)}</title>
                        </path>

                    );
                })}

            </g>

        </svg>

    );
}
