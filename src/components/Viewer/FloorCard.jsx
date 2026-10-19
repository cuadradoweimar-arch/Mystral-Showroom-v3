import { availableCount, floorUnits } from "../../data/floors";
import { STATUS_LABELS, UNIT_TYPES, unitName } from "../../data/units";

/*
=====================================================
TARJETA DEL PISO SELECCIONADO (sección NIVELES)

Muestra las unidades del piso; al tocar una se abre su
ficha (UnitCard). La terraza ofrece su recorrido 360.
=====================================================
*/

export default function FloorCard({ floor, onSelectUnit, onTour }) {

    const units = floorUnits(floor);
    const available = availableCount(floor);

    return (

        <div className="level-card floor-card" aria-live="polite">

            {floor.detail && (
                <span className="level-card-label">
                    {floor.detail.toUpperCase()}
                </span>
            )}

            <h2>
                {floor.label}
            </h2>

            {units.length > 0 && (

                <>

                    <p>
                        {available
                            ? `${available} disponible${available === 1 ? "" : "s"} de ${units.length} unidades`
                            : "Todas las unidades vendidas"}
                    </p>

                    <ul className="floor-units">

                        {units.map((unit) => (

                            <li key={unit.id}>

                                <button onClick={() => onSelectUnit(unit)}>

                                    <span className={`floor-unit-dot is-${unit.status}`} />

                                    <span className="floor-unit-name">
                                        {unitName(unit)}
                                        <small>{UNIT_TYPES[unit.type].name}</small>
                                    </span>

                                    <span className="floor-unit-status">
                                        {STATUS_LABELS[unit.status]}
                                    </span>

                                </button>

                            </li>

                        ))}

                    </ul>

                </>

            )}

            {floor.tour && (

                <>

                    <p>
                        Recorre las zonas comunes en 360°.
                    </p>

                    <div className="unit-actions">
                        <button className="unit-button primary" onClick={onTour}>
                            TOUR 360°
                        </button>
                    </div>

                </>

            )}

        </div>

    );
}
