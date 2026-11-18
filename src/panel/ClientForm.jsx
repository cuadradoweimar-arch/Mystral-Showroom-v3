import { useEffect, useState } from "react";
import { addDaysISO, CLIENT_STATUS, unitName, UNIT_STATUS } from "./util";

const EMPTY = { name: "", phone: "", email: "", status: "sin_contactar", unit_id: "", notes: "", next_contact: "" };

export default function ClientForm({ client, units, onClose, onSave, onDelete }) {

    const [form, setForm] = useState(() => ({ ...EMPTY, ...Object.fromEntries(Object.entries(client).map(([k, v]) => [k, v ?? ""])) }));
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const submit = async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        try {
            const data = {
                name: form.name, phone: form.phone, email: form.email, status: form.status,
                unit_id: form.unit_id || null, notes: form.notes, next_contact: form.next_contact || null,
            };
            if (client.id) data.id = client.id;
            await onSave(data);
        } catch (err) {
            setError(err.message);
            setBusy(false);
        }
    };

    return (
        <div className="p-modal" role="dialog" aria-modal="true" aria-label={client.id ? "Editar cliente" : "Nuevo cliente"} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
            <form className="p-modal-card" onSubmit={submit}>
                <div className="p-card-head">
                    <h2>{client.id ? "Editar cliente" : "Nuevo cliente"}</h2>
                    <button type="button" className="p-x" onClick={onClose} aria-label="Cerrar">×</button>
                </div>

                <div className="p-form-grid">
                    <label className="is-wide">Nombre*<input value={form.name} onChange={set("name")} required autoFocus maxLength={120} /></label>
                    <label>Teléfono / WhatsApp<input value={form.phone} onChange={set("phone")} inputMode="tel" placeholder="300 123 4567" maxLength={40} /></label>
                    <label>Correo<input type="email" value={form.email} onChange={set("email")} maxLength={160} /></label>
                    <label>Estado
                        <select value={form.status} onChange={set("status")}>
                            {Object.entries(CLIENT_STATUS).map(([k, label]) => <option key={k} value={k}>{label}</option>)}
                        </select>
                    </label>
                    <label>Unidad de interés
                        <select value={form.unit_id} onChange={set("unit_id")}>
                            <option value="">—</option>
                            {units.map((u) => <option key={u.id} value={u.id}>{unitName(u)} · {UNIT_STATUS[u.status].label}</option>)}
                        </select>
                    </label>
                    <label>Próximo contacto
                        <input type="date" value={form.next_contact} onChange={set("next_contact")} />
                    </label>
                    <div className="p-quick">
                        {[["Mañana", 1], ["En 3 días", 3], ["En 1 semana", 7]].map(([label, days]) => (
                            <button key={days} type="button" className="p-filter" onClick={() => setForm((f) => ({ ...f, next_contact: addDaysISO(days) }))}>{label}</button>
                        ))}
                    </div>
                    <label className="is-wide">Notas<textarea rows={4} value={form.notes} onChange={set("notes")} maxLength={2000} placeholder="Qué busca, presupuesto, forma de pago, quién decide…" /></label>
                </div>

                {error && <p className="p-login-error" role="alert">{error}</p>}

                <div className="p-modal-actions">
                    {onDelete && (confirmDelete
                        ? <button type="button" className="p-btn-danger" onClick={onDelete}>Sí, eliminar</button>
                        : <button type="button" className="p-link is-danger" onClick={() => setConfirmDelete(true)}>Eliminar cliente</button>)}
                    <span className="p-grow" />
                    <button type="button" className="p-btn-ghost" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="p-btn-primary" disabled={busy}>{busy ? "Guardando…" : "Guardar"}</button>
                </div>
            </form>
        </div>
    );
}
