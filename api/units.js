/*
Estado de las unidades.
GET   (público)  → { statuses: { "301": "vendido", ... } }  lo lee el showroom
PATCH (vendedor) → { id, status }  cambia el estado de una unidad
*/
import { requireSession } from "./_lib/auth.js";
import { handle, httpError, readBody, requirePanelRequest, send } from "./_lib/http.js";
import { store, UNIT_STATUSES } from "./_lib/store.js";
import { UNITS } from "../src/data/units.js";

export default handle(async (req, res) => {
    if (req.method === "GET") {
        const rows = await store().unitStatuses();
        const session = req.query?.detalle !== undefined || /[?&]detalle/.test(req.url || "") ? requireSession(req) : null;
        if (session) return send(res, 200, { units: rows });
        // público: sólo el estado, nada de quién lo cambió; caché corta en el CDN
        res.setHeader("Cache-Control", "public, max-age=0, s-maxage=5, stale-while-revalidate=10");
        return send(res, 200, { statuses: Object.fromEntries(rows.map((r) => [r.id, r.status])) });
    }
    if (req.method === "PATCH") {
        requirePanelRequest(req);
        const session = requireSession(req);
        const { id, status } = await readBody(req);
        if (!UNITS.some((u) => u.id === id)) throw httpError(400, "Unidad inexistente");
        if (!UNIT_STATUSES.includes(status)) throw httpError(400, "Estado inválido");
        await store().setUnitStatus(id, status, session.name);
        return send(res, 200, { ok: true, id, status });
    }
    send(res, 405, { error: "Método no permitido" });
});
