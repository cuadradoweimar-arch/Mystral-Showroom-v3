import { StatusPicker } from "./Dashboard";
import { floorLabel, formatArea, formatMoney, PANEL_FLOORS, UNIT_STATUS, UNIT_TYPES, unitName } from "./util";

export default function UnitsView({ units, clients, onUnitStatus }) {

    const counts = Object.fromEntries(Object.keys(UNIT_STATUS).map((k) => [k, units.filter((u) => u.status === k).length]));

    return (
        <section className="p-card p-units">
            <div className="p-card-head">
                <h2>Departamentos</h2>
                <div className="p-legend">
                    {Object.entries(UNIT_STATUS).map(([k, s]) => (
                        <span key={k}><i style={{ background: s.color }} />{s.label} <b>{counts[k]}</b></span>
                    ))}
                </div>
            </div>
            <p className="p-muted p-units-note">Lo que cambies aquí lo ve el comprador en el showroom en segundos (niveles, planta y ficha de cada unidad).</p>

            {[...PANEL_FLOORS].reverse().map((floor) => (
                <div key={floor} className="p-floor-group">
                    <p className="p-mono">{floorLabel(floor)}</p>
                    {units.filter((u) => u.floor === floor).map((u) => {
                        const interested = clients.filter((c) => c.unit_id === u.id).length;
                        return (
                            <div key={u.id} className="p-unit-row">
                                <i className="p-unit-dot" style={{ background: UNIT_STATUS[u.status].color }} />
                                <div className="p-unit-info">
                                    <b>{unitName(u)}</b>
                                    <small>{UNIT_TYPES[u.type].name} · {formatArea(u.area)} · {formatMoney(u.price)}</small>
                                    <small className="p-muted">
                                        {interested > 0 && <>{interested} interesado{interested === 1 ? "" : "s"} · </>}
                                        {u.updated_by ? `Cambiado por ${u.updated_by}, ${new Date(u.updated_at).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}` : "Estado inicial del inventario"}
                                    </small>
                                </div>
                                <StatusPicker unit={u} onChange={onUnitStatus} />
                            </div>
                        );
                    })}
                </div>
            ))}
        </section>
    );
}
