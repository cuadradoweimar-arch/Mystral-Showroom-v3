/*
=====================================================
PUNTO DEL EDIFICIO (escena INGRESO)

Un punto interactivo sobre la torre (mismo estilo que el
punto del ingreso 360). Al tocarlo se reproduce "frente
arriba" y se abre NIVELES. Su posición está en
.building-hotspot (Viewer.css), en % del video.
=====================================================
*/

const LABEL = "Ver niveles del edificio";

export default function BuildingOverlay({ onSelect }) {

    return (
        <button
            type="button"
            className="ingreso-hotspot building-hotspot"
            aria-label={LABEL}
            title={LABEL}
            onClick={onSelect}
        >
            <span className="ingreso-hotspot-dot"></span>
        </button>
    );
}
