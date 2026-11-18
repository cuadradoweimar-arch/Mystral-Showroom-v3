import { useMemo, useState } from "react";
import { ContactButton, WhatsAppButton } from "./Dashboard";
import ClientForm from "./ClientForm";
import { CLIENT_STATUS, followUp, followUpText, formatDate, initials, unitById, unitName } from "./util";

const FILTERS = [
    { id: "todos", label: "Todos" },
    { id: "hoy", label: "Para hoy" },
    ...Object.entries(CLIENT_STATUS).map(([id, label]) => ({ id, label })),
];

export default function ClientsView({ clients, units, onSave, onDelete }) {

    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("todos");
    const [editing, setEditing] = useState(null); // null | {} (nuevo) | cliente

    const list = useMemo(() => {
        const q = query.trim().toLowerCase();
        return clients.filter((c) => {
            if (filter === "hoy" && !followUp(c).due) return false;
            if (filter !== "todos" && filter !== "hoy" && c.status !== filter) return false;
            if (!q) return true;
            return [c.name, c.phone, c.email, c.notes].some((v) => String(v || "").toLowerCase().includes(q));
        });
    }, [clients, query, filter]);

    return (
        <section className="p-card p-clients">
            <div className="p-card-head">
                <h2>Clientes <span className="p-muted">{clients.length}</span></h2>
                <button type="button" className="p-btn-primary" onClick={() => setEditing({})}>+ Nuevo cliente</button>
            </div>

            <div className="p-toolbar">
                <input className="p-search" placeholder="Buscar por nombre, teléfono, correo o nota…" value={query} onChange={(e) => setQuery(e.target.value)} />
                <div className="p-filters">
                    {FILTERS.map((f) => {
                        const n = f.id === "todos" ? clients.length : f.id === "hoy" ? clients.filter((c) => followUp(c).due).length : clients.filter((c) => c.status === f.id).length;
                        if (n === 0 && f.id !== "todos" && f.id !== filter) return null;
                        return (
                            <button key={f.id} type="button" className={`p-filter ${filter === f.id ? "is-on" : ""}`} onClick={() => setFilter(f.id)}>
                                {f.label} <small>{n}</small>
                            </button>
                        );
                    })}
                </div>
            </div>

            {list.length === 0 && <div className="p-empty">{clients.length ? "Ningún cliente coincide." : "Todavía no hay clientes registrados."}</div>}

            <ul className="p-list p-list-clients">
                {list.map((c) => {
                    const unit = c.unit_id ? unitById(c.unit_id) : null;
                    const fu = followUpText(c);
                    const late = followUp(c).due;
                    return (
                        <li key={c.id}>
                            <span className="p-avatar">{initials(c.name)}</span>
                            <button type="button" className="p-li-main p-li-btn" onClick={() => setEditing(c)}>
                                <b>{c.name}</b>
                                <small>
                                    {CLIENT_STATUS[c.status]}
                                    {unit && <> · {unitName(unit)}</>}
                                    {fu && <> · <span className={late ? "is-hot" : ""}>{fu}</span></>}
                                </small>
                                <small className="p-muted">
                                    {c.phone || "Sin teléfono"}
                                    {c.last_contact && <> · último contacto {formatDate(c.last_contact)}</>}
                                </small>
                            </button>
                            <ContactButton client={c} onSave={onSave} />
                            <WhatsAppButton client={c} />
                        </li>
                    );
                })}
            </ul>

            {editing && (
                <ClientForm
                    client={editing}
                    units={units}
                    onClose={() => setEditing(null)}
                    onSave={async (data) => { await onSave(data); setEditing(null); }}
                    onDelete={editing.id ? async () => { await onDelete(editing.id); setEditing(null); } : null}
                />
            )}
        </section>
    );
}
