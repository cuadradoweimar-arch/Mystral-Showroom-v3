import {
    formatArea,
    formatPrice,
    SHOW_PRICES,
    STATUS_LABELS,
    UNIT_TYPES,
    unitName,
} from "../../data/units";
import { whatsappLink } from "../../data/contact";

/*
=====================================================
FICHA DE UNIDAD (al tocar una franja de la fachada)
=====================================================
*/

export default function UnitCard({ unit, onTour, onClose }) {

    const type = UNIT_TYPES[unit.type];
    const tourReady = unit.tourStatus !== "maintenance";
    const showPrice = SHOW_PRICES && unit.status === "disponible";

    const contact = whatsappLink(
        `Hola, quiero información sobre el ${unitName(unit)} (${type.name}, piso ${unit.floor}) del proyecto Mystral.`
    );

    return (

        <div className="level-card unit-card" role="dialog" aria-label={unitName(unit)}>

            <button
                className="level-card-close"
                aria-label="Cerrar ficha"
                onClick={onClose}
            >
                ×
            </button>

            <span className="level-card-label">
                {type.name.toUpperCase()} · PISO {unit.floor}
            </span>

            <h2>
                {unitName(unit)}
            </h2>

            <span className={`unit-status is-${unit.status}`}>
                {STATUS_LABELS[unit.status]}
            </span>

            {showPrice && (
                <p className="unit-price">
                    {formatPrice(unit.price)}
                </p>
            )}

            <dl className="unit-details">
                <div>
                    <dt>Área</dt>
                    <dd>{formatArea(unit.area)}</dd>
                </div>
                <div>
                    <dt>Piso</dt>
                    <dd>{unit.floor}</dd>
                </div>
                <div>
                    <dt>Tipología</dt>
                    <dd>{type.name}</dd>
                </div>
            </dl>

            <div className="unit-actions">

                <button
                    className="unit-button primary"
                    onClick={onTour}
                    disabled={!tourReady}
                >
                    {tourReady ? "TOUR 360°" : "TOUR EN MANTENIMIENTO"}
                </button>

                {contact && unit.status !== "vendido" && (
                    <a
                        className="unit-button"
                        href={contact}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        MÁS INFORMACIÓN AQUÍ
                    </a>
                )}

            </div>

        </div>

    );
}
