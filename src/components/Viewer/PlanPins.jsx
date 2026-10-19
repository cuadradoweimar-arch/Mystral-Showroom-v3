import { floorUnits } from "../../data/floors";
import { STATUS_LABELS, unitName } from "../../data/units";

/*
=====================================================
ETIQUETAS DE UNIDADES SOBRE LA PLANTA (sección NIVELES)

Cada etiqueta muestra el número del apartamento y un
punto con el color de su estado. Al tocarla se abre la
ficha de la unidad.

La caja interna reproduce el recorte de la imagen de
fondo (background-size: cover) para que las etiquetas
queden sobre el mismo punto de la planta.
=====================================================
*/

export default function PlanPins({ floor, selectedId, onSelect }) {

    const { ratio, byType } = floor.pins;

    return (

        <div className="plan-pins">

            <div className="plan-pins-box" style={{ "--plan-ratio": ratio }}>

                {floorUnits(floor).map((unit) => {

                    const pin = byType[unit.type];

                    if (!pin) return null;

                    const selected = unit.id === selectedId;

                    return (

                        <button
                            key={unit.id}
                            className={`plan-pin ${selected ? "is-selected" : ""}`}
                            style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
                            aria-label={`${unitName(unit)} · ${STATUS_LABELS[unit.status]}`}
                            aria-pressed={selected}
                            onClick={(event) => onSelect(unit, {
                                x: event.clientX / window.innerWidth,
                                y: event.clientY / window.innerHeight,
                            })}
                        >
                            <span className={`plan-pin-dot is-${unit.status}`} />
                            {unit.id}
                        </button>

                    );
                })}

            </div>

        </div>

    );
}
