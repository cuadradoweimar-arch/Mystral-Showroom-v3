import { useEffect, useState } from "react";
import { StatusPicker } from "./Dashboard";
import { floorLabel, formatArea, formatMoney, formatPct, PANEL_FLOORS, saleOf, UNIT_STATUS, unitName } from "./util";

/*
Listado de ventas (como la hoja de INARQ.CO): valor m², área, valor de venta,
descuento, valores con descuento, estado y comprador. Descuento y comprador
se guardan en la base de datos del panel y nunca se publican en el showroom.
*/

// Campo que guarda al salir (o con Enter), sin guardar en cada tecla
function InlineField({ value, onSave, type = "text", placeholder, suffix, label }) {
    const [draft, setDraft] = useState(value ?? "");
    useEffect(() => setDraft(value ?? ""), [value]);
    const commit = () => {
        const next = type === "number" ? (draft === "" ? null : Number(draft)) : draft.trim();
        if (next !== (value ?? (type === "number" ? null : ""))) onSave(next);
    };
    return (
        <span className={`p-inline ${type === "number" ? "is-num" : ""}`}>
            <input
                aria-label={label}
                type={type}
                inputMode={type === "number" ? "decimal" : undefined}
                min={type === "number" ? 0 : undefined}
                max={type === "number" ? 50 : undefined}
                step={type === "number" ? 0.5 : undefined}
                value={draft}
                placeholder={placeholder}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            />
            {suffix && <small>{suffix}</small>}
        </span>
    );
}

export default function UnitsView({ units, clients, onUnitStatus, onUpdateUnit }) {

    const counts = Object.fromEntries(Object.keys(UNIT_STATUS).map((k) => [k, units.filter((u) => u.status === k).length]));
    const rows = units.map((u) => ({ u, s: saleOf(u) }));
    const totalPrice = rows.reduce((a, r) => a + r.u.price, 0);
    const totalFinal = rows.reduce((a, r) => a + r.s.final, 0);
    const totalArea = rows.reduce((a, r) => a + r.u.area, 0);
    const avgM2Final = rows.reduce((a, r) => a + r.s.m2Final, 0) / rows.length;
    const soldFinal = rows.filter((r) => r.u.status === "vendido").reduce((a, r) => a + r.s.final, 0);
    const reservedFinal = rows.filter((r) => r.u.status === "reservado").reduce((a, r) => a + r.s.final, 0);
    const availableFinal = rows.filter((r) => r.u.status === "disponible").reduce((a, r) => a + r.s.final, 0);

    return (
        <section className="p-card p-units">
            <div className="p-card-head">
                <h2>Listado de ventas</h2>
                <div className="p-legend">
                    {Object.entries(UNIT_STATUS).map(([k, s]) => (
                        <span key={k}><i style={{ background: s.color }} />{s.label} <b>{counts[k]}</b></span>
                    ))}
                </div>
            </div>

            <div className="p-kpis">
                <div><small>Vendido</small><b style={{ color: UNIT_STATUS.vendido.color }}>{formatMoney(soldFinal)}</b></div>
                <div><small>Reservado</small><b style={{ color: UNIT_STATUS.reservado.color }}>{formatMoney(reservedFinal)}</b></div>
                <div><small>Por vender</small><b style={{ color: UNIT_STATUS.disponible.color }}>{formatMoney(availableFinal)}</b></div>
                <div><small>Total con descuento</small><b>{formatMoney(totalFinal)}</b></div>
            </div>

            <p className="p-muted p-units-note">
                El estado lo ve el comprador en el showroom en segundos. El descuento y el comprador son privados: sólo se ven aquí.
            </p>

            <div className="p-table-wrap">
                <table className="p-table">
                    <thead>
                        <tr>
                            <th>Piso</th>
                            <th>Inmueble</th>
                            <th className="num">Valor m²</th>
                            <th className="num">Área m²</th>
                            <th className="num">Valor venta</th>
                            <th className="num">Dcto</th>
                            <th className="num">Valor m² con dcto</th>
                            <th className="num">Valor final con dcto</th>
                            <th>Estado</th>
                            <th>Comprador</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...PANEL_FLOORS].reverse().map((floor) => {
                            const floorRows = rows.filter((r) => r.u.floor === floor);
                            return floorRows.map(({ u, s }, i) => {
                                const interested = clients.filter((c) => c.unit_id === u.id).length;
                                return (
                                    <tr key={u.id} className={i === 0 ? "is-first" : ""}>
                                        {i === 0 && <td rowSpan={floorRows.length} className="p-td-floor">{floor === "10-11" ? "10-11 Dúplex" : floor}</td>}
                                        <td>
                                            <b>{unitName(u)}</b>
                                            {interested > 0 && <small className="p-muted"> · {interested} interesado{interested === 1 ? "" : "s"}</small>}
                                        </td>
                                        <td className="num">{formatMoney(s.m2)}</td>
                                        <td className="num">{formatArea(u.area).replace(" m²", "")}</td>
                                        <td className="num">{formatMoney(u.price)}</td>
                                        <td className="num">
                                            <InlineField type="number" value={u.discount} suffix="%" label={`Descuento ${unitName(u)}`} placeholder="0" onSave={(v) => onUpdateUnit(u.id, { discount: v })} />
                                        </td>
                                        <td className="num">{formatMoney(s.m2Final)}</td>
                                        <td className="num"><b>{formatMoney(s.final)}</b></td>
                                        <td><StatusPicker unit={u} onChange={onUnitStatus} /></td>
                                        <td>
                                            <InlineField value={u.buyer} label={`Comprador ${unitName(u)}`} placeholder="—" onSave={(v) => onUpdateUnit(u.id, { buyer: v || null })} />
                                        </td>
                                    </tr>
                                );
                            });
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3}>Totales</td>
                            <td className="num">{formatArea(totalArea).replace(" m²", "")}</td>
                            <td className="num">{formatMoney(totalPrice)}</td>
                            <td />
                            <td className="num" title="Promedio de la columna">{formatMoney(avgM2Final)}</td>
                            <td className="num">{formatMoney(totalFinal)}</td>
                            <td colSpan={2} className="p-muted">Total m² construido vendible: {formatArea(totalArea)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* celular: una tarjeta por unidad */}
            <div className="p-sale-cards">
                {[...PANEL_FLOORS].reverse().map((floor) => (
                    <div key={floor} className="p-floor-group">
                        <p className="p-mono">{floorLabel(floor)}</p>
                        {rows.filter((r) => r.u.floor === floor).map(({ u, s }) => (
                            <div key={u.id} className="p-sale-card">
                                <div className="p-sale-top">
                                    <i className="p-unit-dot" style={{ background: UNIT_STATUS[u.status].color }} />
                                    <b>{unitName(u)}</b>
                                    <small className="p-muted">{formatArea(u.area)}</small>
                                </div>
                                <dl>
                                    <dt>Valor venta</dt><dd>{formatMoney(u.price)}</dd>
                                    <dt>Valor m²</dt><dd>{formatMoney(s.m2)}</dd>
                                    <dt>Descuento</dt><dd><InlineField type="number" value={u.discount} suffix="%" label={`Descuento ${unitName(u)}`} placeholder="0" onSave={(v) => onUpdateUnit(u.id, { discount: v })} /></dd>
                                    <dt>m² con dcto</dt><dd>{formatMoney(s.m2Final)}</dd>
                                    <dt>Final con dcto</dt><dd><b>{formatMoney(s.final)}</b></dd>
                                    <dt>Comprador</dt><dd><InlineField value={u.buyer} label={`Comprador ${unitName(u)}`} placeholder="—" onSave={(v) => onUpdateUnit(u.id, { buyer: v || null })} /></dd>
                                </dl>
                                <StatusPicker unit={u} onChange={onUnitStatus} />
                            </div>
                        ))}
                    </div>
                ))}
                <div className="p-sale-total">
                    <span>Total venta <b>{formatMoney(totalPrice)}</b></span>
                    <span>Total con dcto <b>{formatMoney(totalFinal)}</b></span>
                    <span>m² vendibles <b>{formatArea(totalArea)}</b></span>
                </div>
            </div>
        </section>
    );
}
