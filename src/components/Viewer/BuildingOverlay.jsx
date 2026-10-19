import {
    BUILDING_MASK,
    INGRESO_VIDEO_HEIGHT,
    INGRESO_VIDEO_WIDTH,
} from "../../data/building";

/*
=====================================================
MÁSCARA DEL EDIFICIO (escena INGRESO)

Mismo comportamiento que las franjas de la fachada:
invisible hasta pasar el mouse; en pantallas táctiles
muestra un contorno fino. viewBox = tamaño del video y
"slice" = object-fit: cover, para quedar alineada.
=====================================================
*/

const LABEL = "Ver niveles del edificio";

export default function BuildingOverlay({ onSelect }) {

    return (

        <svg
            className="levels-overlay"
            viewBox={`0 0 ${INGRESO_VIDEO_WIDTH} ${INGRESO_VIDEO_HEIGHT}`}
            preserveAspectRatio="xMidYMid slice"
        >

            <path
                d={BUILDING_MASK}
                role="button"
                tabIndex={0}
                aria-label={LABEL}
                onClick={onSelect}
                onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    onSelect();
                }}
            >
                <title>{LABEL}</title>
            </path>

        </svg>

    );
}
