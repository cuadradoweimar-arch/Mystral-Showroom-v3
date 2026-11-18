import { useCallback, useEffect, useMemo, useState } from "react";
import { api, ApiError } from "./api";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ClientsView from "./ClientsView";
import UnitsView from "./UnitsView";
import { followUp, UNITS } from "./util";

const TABS = [
    { id: "panel", label: "Mi panel" },
    { id: "clientes", label: "Clientes" },
    { id: "unidades", label: "Listado de ventas" },
];

export default function PanelApp() {

    const [session, setSession] = useState(undefined); // undefined = comprobando
    const [tab, setTab] = useState("panel");
    const [unitRows, setUnitRows] = useState([]);
    const [clients, setClients] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        api("session").then(setSession).catch(() => setSession(null));
    }, []);

    // Cualquier 401 (sesión vencida) vuelve al inicio de sesión
    const guard = useCallback((promise) => promise.catch((err) => {
        if (err instanceof ApiError && err.status === 401) setSession(null);
        else setError(err.message);
        throw err;
    }), []);

    const loadUnits = useCallback(() => guard(api("units?detalle")).then((d) => setUnitRows(d.units)).catch(() => {}), [guard]);
    const loadClients = useCallback(() => guard(api("clients")).then((d) => setClients(d.clients)).catch(() => {}), [guard]);

    useEffect(() => {
        if (!session) return undefined;
        loadUnits();
        loadClients();
        // otros vendedores pueden cambiar estados: refresco suave
        const id = setInterval(() => { if (document.visibilityState === "visible") loadUnits(); }, 20000);
        return () => clearInterval(id);
    }, [session, loadUnits, loadClients]);

    // Inventario con el estado vigente (base del archivo + cambios guardados)
    const units = useMemo(() => {
        const byId = Object.fromEntries(unitRows.map((r) => [r.id, r]));
        return UNITS.map((u) => {
            const row = byId[u.id] || {};
            return { ...u, status: row.status || u.status, buyer: row.buyer || "", discount: row.discount ?? null, updated_at: row.updated_at, updated_by: row.updated_by };
        });
    }, [unitRows]);

    // Cambia estado, comprador o descuento de una unidad (se ve al instante y se guarda)
    const updateUnit = useCallback(async (id, fields) => {
        const previous = unitRows;
        setUnitRows((rows) => {
            const base = rows.find((r) => r.id === id) || { id, status: UNITS.find((u) => u.id === id)?.status };
            return [...rows.filter((r) => r.id !== id), { ...base, ...fields, updated_at: new Date().toISOString(), updated_by: session?.name }];
        });
        try {
            await guard(api("units", { method: "PATCH", body: { id, ...fields } }));
        } catch {
            setUnitRows(previous);
        }
    }, [unitRows, guard, session]);
    const setUnitStatus = useCallback((id, status) => updateUnit(id, { status }), [updateUnit]);

    const saveClient = useCallback(async (data) => {
        const method = data.id ? "PATCH" : "POST";
        const { client } = await guard(api("clients", { method, body: data }));
        setClients((list) => (data.id ? list.map((c) => (c.id === client.id ? client : c)) : [client, ...list]));
        return client;
    }, [guard]);

    const deleteClient = useCallback(async (id) => {
        await guard(api(`clients?id=${id}`, { method: "DELETE" }));
        setClients((list) => list.filter((c) => c.id !== id));
    }, [guard]);

    const logout = async () => {
        await api("session", { method: "DELETE" }).catch(() => {});
        setSession(null);
        setClients([]);
        setUnitRows([]);
    };

    if (session === undefined) return <div className="p-loading">Cargando…</div>;
    if (!session) return <Login onLogin={setSession} />;

    const dueCount = clients.filter((c) => followUp(c).due).length;

    return (
        <div className="p-app">
            <header className="p-head">
                <div className="p-brand">
                    <img src="/icons/icon-180.png" alt="" />
                    <b>Mystral</b>
                    <span className="p-sep" />
                    <span>Panel de vendedor</span>
                </div>
                <div className="p-user">
                    <span className="p-mono">{session.name}</span>
                    <button type="button" className="p-link" onClick={logout}>Salir</button>
                    <a className="p-btn-light" href="/" target="_blank" rel="noopener">Ver showroom ↗</a>
                </div>
            </header>

            <nav className="p-tabs">
                {TABS.map((t) => (
                    <button key={t.id} type="button" className={tab === t.id ? "is-on" : ""} onClick={() => setTab(t.id)}>
                        {t.label}
                        {t.id === "clientes" && <span className="p-count">{clients.length}</span>}
                        {t.id === "panel" && dueCount > 0 && <span className="p-count is-hot">{dueCount}</span>}
                    </button>
                ))}
            </nav>

            {error && (
                <div className="p-error" role="alert">
                    {error}
                    <button type="button" onClick={() => setError("")} aria-label="Cerrar">×</button>
                </div>
            )}

            <main className="p-main">
                {tab === "panel" && (
                    <Dashboard session={session} units={units} clients={clients} onUnitStatus={setUnitStatus} onSaveClient={saveClient} onGoClients={() => setTab("clientes")} />
                )}
                {tab === "clientes" && (
                    <ClientsView clients={clients} units={units} onSave={saveClient} onDelete={deleteClient} />
                )}
                {tab === "unidades" && (
                    <UnitsView units={units} clients={clients} onUnitStatus={setUnitStatus} onUpdateUnit={updateUnit} />
                )}
            </main>
        </div>
    );
}
