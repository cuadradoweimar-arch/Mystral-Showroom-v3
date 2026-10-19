/*
=====================================================
BOTONES DE ZOOM (+ / −)

Se usan en VER DISPONIBLE y en los tours 360.
className permite ubicarlos distinto en cada pantalla.
=====================================================
*/

function MagnifierIcon({ plus }) {

    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="M15.3 15.3 20 20" />
            <path d="M7.8 10.5h5.4" />
            {plus && <path d="M10.5 7.8v5.4" />}
        </svg>
    );
}

export default function ZoomControls({ canZoomIn, canZoomOut, onZoomIn, onZoomOut, className = "" }) {

    return (

        <div className={`zoom-controls ${className}`}>

            <button
                className="zoom-button"
                aria-label="Acercar"
                onClick={onZoomIn}
                disabled={!canZoomIn}
            >
                <MagnifierIcon plus />
            </button>

            <button
                className="zoom-button"
                aria-label="Alejar"
                onClick={onZoomOut}
                disabled={!canZoomOut}
            >
                <MagnifierIcon />
            </button>

        </div>

    );
}
