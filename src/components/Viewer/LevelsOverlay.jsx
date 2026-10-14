import {
    LEVELS,
    LEVELS_TRANSFORM,
    VIDEO_HEIGHT,
    VIDEO_WIDTH,
} from "../../data/levels";

/*
=====================================================
HOTSPOTS DE NIVELES SOBRE LA FACHADA

Cada franja abre el tour de su apartamento (level.target)
o muestra un aviso si está en mantenimiento.

viewBox = tamaño del video y "slice" = object-fit: cover,
así las zonas escalan y se recortan igual que el video.

onSelect(level, origin) — origin es el punto tocado en
proporción de la pantalla (0-1), para la transición de zoom.
=====================================================
*/

const TOUR_NAMES = {
    typeA360: "Tipo A",
    typeB360: "Tipo B",
    duplex: "Dúplex",
};

const describe = (level) => {
    const name = `${level.name} ${level.floors}`;
    if (level.status === "maintenance") return `${name} · En mantenimiento`;
    return `${name} · Recorrido ${TOUR_NAMES[level.target] ?? ""}`.trim();
};

export default function LevelsOverlay({ onSelect }) {

    const select = (level, event) => {
        onSelect(level, {
            x: event.clientX / window.innerWidth,
            y: event.clientY / window.innerHeight,
        });
    };

    return (

        <svg
            className="levels-overlay"
            viewBox={`0 0 ${VIDEO_WIDTH} ${VIDEO_HEIGHT}`}
            preserveAspectRatio="xMidYMid slice"
        >

            <g transform={LEVELS_TRANSFORM}>

                {LEVELS.map((level) => (

                    <path
                        key={level.id}
                        d={level.d}
                        className={level.status === "maintenance" ? "is-maintenance" : undefined}
                        role="button"
                        tabIndex={0}
                        aria-label={describe(level)}
                        onClick={(event) => select(level, event)}
                        onKeyDown={(event) => {
                            if (event.key !== "Enter" && event.key !== " ") return;
                            event.preventDefault();
                            const box = event.currentTarget.getBoundingClientRect();
                            onSelect(level, {
                                x: (box.left + box.width / 2) / window.innerWidth,
                                y: (box.top + box.height / 2) / window.innerHeight,
                            });
                        }}
                    >
                        <title>{describe(level)}</title>
                    </path>

                ))}

            </g>

        </svg>

    );
}
