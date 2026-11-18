/*
Clientes del vendedor (sólo con sesión).
GET    → { clients: [...] }
POST   → crea   { name, phone, email, status, unit_id, notes, next_contact }
PATCH  → edita  { id, ...campos }
DELETE → borra  ?id=123
*/
import { requireSession } from "./_lib/auth.js";
import { handle, httpError, readBody, requirePanelRequest, send } from "./_lib/http.js";
import { cleanClient, store } from "./_lib/store.js";

const idFrom = (value) => {
    const id = Number(value);
    if (!Number.isInteger(id) || id <= 0) throw httpError(400, "id inválido");
    return id;
};

export default handle(async (req, res) => {
    requireSession(req);
    if (req.method === "GET") return send(res, 200, { clients: await store().listClients() });
    requirePanelRequest(req);
    if (req.method === "POST") {
        const client = await store().createClient(cleanClient(await readBody(req)));
        return send(res, 201, { client });
    }
    if (req.method === "PATCH") {
        const body = await readBody(req);
        const client = await store().updateClient(idFrom(body.id), cleanClient(body, true));
        return send(res, 200, { client });
    }
    if (req.method === "DELETE") {
        const id = idFrom(new URL(req.url, "http://x").searchParams.get("id"));
        await store().deleteClient(id);
        return send(res, 200, { ok: true });
    }
    send(res, 405, { error: "Método no permitido" });
});
