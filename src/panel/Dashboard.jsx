import { lazy, Suspense, useMemo, useState } from "react";
import {
    addDaysISO, CLIENT_STATUS, floorLabel, floorShort, followUp, followUpText, formatArea,
    formatMoney, formatPct, greeting, saleOf, initials, PANEL_FLOORS, UNIT_STATUS, UNIT_TYPES, unitById, unitName, whatsappLink,
} from "./util";

const Building3D = lazy(() => import("./Building3D"));

export function StatusPicker({ unit, onChange }) {
    return (
        <div className="p-seg" role="radiogroup" aria-label={`Estado de ${unitName(unit)}`}>
            {Object.entries(UNIT_STATUS).map(([key, s]) => (
                <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={unit.status === key}
                    className={unit.status === key ? "is-on" : ""}
                    style={{ "--c": s.color }}
                    onClick={() => unit.status !== key && onChange(unit.id, key)}
                >
                    {s.label}
                </button>
            ))}
        </div>
    );
}

export function ContactButton({ client, onSave }) {
    // Registrar que se habló hoy: próximo seguimiento en 3 días
    return (
        <button
            type="button"
            className="p-btn-ghost"
            title="Registrar contacto de hoy (próximo en 3 días)"
            onClick={() => onSave({
                id: client.id,
                last_contact: new Date().toISOString(),
                next_contact: addDaysISO(3),
                status: client.status === "sin_contactar" ? "contactado" : client.status,
            })}
        >
            ✓ Contactado
        </button>
    );
}

export function WhatsAppButton({ client }) {
    const href = whatsappLink(client.phone, client.name);
    if (!href) return <span className="p-btn-ghost is-disabled" title="Sin teléfono">WhatsApp</span>;
    return <a className="p-btn-ghost is-wa" href={href} target="_blank" rel="noopener">WhatsApp</a>;
}

export default function Dashboard({ session, units, clients, onUnitStatus, onSaveClient, onGoClients }) {

    const [focusFloor, setFocusFloor] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const today = useMemo(() => clients
        .map((c) => ({ c, f: followUp(c) }))
        .filter(({ f }) => f.due)
        .sort((a, b) => b.f.overdue - a.f.overdue)
        .map(({ c }) => c), [clients]);

    const uncontacted = clients.filter((c) => c.status === "sin_contactar").length;
    const counts = Object.fromEntries(Object.keys(UNIT_STATUS).map((k) => [k, units.filter((u) => u.status === k).length]));
    const selected = selectedId ? units.find((u) => u.id === selectedId) : null;
    const interested = selected ? clients.filter((c) => c.unit_id === selected.id) : [];

    const now = new Date();
    const floorIndex = focusFloor ? PANEL_FLOORS.indexOf(focusFloor) : -1;
    const stepFloor = (dir) => {
        const next = floorIndex === -1 ? (dir > 0 ? 0 : PANEL_FLOORS.length - 1) : floorIndex + dir;
        setFocusFloor(next < 0 || next >= PANEL_FLOORS.length ? null : PANEL_FLOORS[next]);
    };

    return (
        <div className="p-dash">
            <section className="p-card p-hello">
                <p className="p-mono p-date">{now.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}</p>
                <h1>{greeting(now)}, {session.name.split(" ")[0]}</h1>
                <p className="p-sub">
                    <span className="is-hot">{today.length} {today.length === 1 ? "contacto" : "contactos"} para hoy</span>
                    <span className="p-dot-sep">·</span>
                    <span className="is-warn">{uncontacted} sin contactar</span>
                </p>

                <div className="p-legend">
                    {Object.entries(UNIT_STATUS).map(([k, s]) => (
                        <span key={k}><i style={{ background: s.color }} />{s.label} <b>{counts[k]}</b></span>
                    ))}
                </div>

                <Suspense fallback={<div className="p-building p-building-wait">Cargando edificio…</div>}>
                    <Building3D units={units} focusFloor={focusFloor} selectedId={selectedId} onSelect={setSelectedId} />
                </Suspense>

                <p className="p-mono p-hint">Desliza por los pisos</p>
                <div className="p-floors">
                    <button type="button" className="p-arrow" onClick={() => stepFloor(-1)} aria-label="Piso anterior">‹</button>
                    <div className="p-floor-chips">
                        {PANEL_FLOORS.map((floor) => {
                            const floorUnits = units.filter((u) => u.floor === floor);
                            return (
                                <button
                                    key={floor}
                                    type="button"
                                    className={`p-chip ${focusFloor === floor ? "is-on" : ""}`}
                                    onClick={() => setFocusFloor(focusFloor === floor ? null : floor)}
                                    title={floorLabel(floor)}
                                >
                                    <span className="p-chip-bar">
                                        {floorUnits.map((u) => <i key={u.id} style={{ background: UNIT_STATUS[u.status].color }} />)}
                                    </span>
                                    <small>{floorShort(floor)}</small>
                                </button>
                            );
                        })}
                    </div>
                    <button type="button" className="p-arrow" onClick={() => stepFloor(1)} aria-label="Piso siguiente">›</button>
                </div>
                <p className="p-hint-sm">Arrastra para girar el edificio · toca una unidad o un piso para verla</p>

                {focusFloor && !selected && (
                    <div className="p-floor-units">
                        <p className="p-mono">{floorLabel(focusFloor)}</p>
                        <div className="p-unit-tiles">
                            {units.filter((u) => u.floor === focusFloor).map((u) => (
                                <button key={u.id} type="button" className="p-unit-tile" onClick={() => setSelectedId(u.id)}>
                                    <b>{unitName(u)}</b>
                                    <small>{UNIT_TYPES[u.type].name} · {formatArea(u.area)}</small>
                                    <span style={{ color: UNIT_STATUS[u.status].color }}>{UNIT_STATUS[u.status].label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {selected && (
                    <div className="p-unit-detail">
                        <div className="p-unit-head">
                            <div>
                                <b>{unitName(selected)}</b>
                                <small>{UNIT_TYPES[selected.type].name} · {formatArea(selected.area)} · {formatMoney(selected.price)}</small>
                                <small>
                                    {selected.discount ? <>Dcto {formatPct(selected.discount)} → <b>{formatMoney(saleOf(selected).final)}</b></> : "Sin descuento"}
                                    {selected.buyer && <> · Comprador: <b>{selected.buyer}</b></>}
                                </small>
                            </div>
                            <button type="button" className="p-x" onClick={() => setSelectedId(null)} aria-label="Cerrar">×</button>
                        </div>
                        <StatusPicker unit={selected} onChange={onUnitStatus} />
                        {selected.updated_by && (
                            <small className="p-muted">Último cambio: {selected.updated_by}, {new Date(selected.updated_at).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}</small>
                        )}
                        <small className="p-muted">El showroom muestra el cambio en segundos.</small>
                        {interested.length > 0 && (
                            <p className="p-interest">Interesados: {interested.map((c) => c.name).join(", ")}</p>
                        )}
                    </div>
                )}
            </section>

            <section className="p-card p-today">
                <div className="p-card-head">
                    <h2><span className="p-ico">✆</span>Para hoy</h2>
                    <span className="p-mono p-muted">{today.length} llamadas o mensajes</span>
                </div>
                {today.length === 0 && (
                    <div className="p-empty">
                        {clients.length === 0
                            ? <>Aún no hay clientes. <button type="button" className="p-link" onClick={onGoClients}>Agrega el primero</button></>
                            : "Nada pendiente para hoy. 🎉"}
                    </div>
                )}
                <ul className="p-list">
                    {today.map((c) => {
                        const unit = c.unit_id ? unitById(c.unit_id) : null;
                        return (
                            <li key={c.id}>
                                <span className="p-avatar">{initials(c.name)}</span>
                                <div className="p-li-main">
                                    <b>{c.name}</b>
                                    <small>
                                        {CLIENT_STATUS[c.status]}
                                        {unit && <> · {unitName(unit)}</>}
                                        {" · "}<span className="is-hot">{followUpText(c)}</span>
                                    </small>
                                </div>
                                <ContactButton client={c} onSave={onSaveClient} />
                                <WhatsAppButton client={c} />
                            </li>
                        );
                    })}
                </ul>
                {clients.length > 0 && (
                    <button type="button" className="p-btn-wide" onClick={onGoClients}>Ver los {clients.length} clientes</button>
                )}
            </section>
        </div>
    );
}
