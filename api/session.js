// Sesión del vendedor: GET = ¿quién soy?, POST = entrar, DELETE = salir
import { clearCookie, login, readSession, sessionCookie } from "./_lib/auth.js";
import { handle, readBody, requirePanelRequest, send } from "./_lib/http.js";

export default handle(async (req, res) => {
    if (req.method === "GET") {
        const session = readSession(req);
        return send(res, session ? 200 : 401, session ? { user: session.user, name: session.name } : { error: "Inicia sesión" });
    }
    if (req.method === "POST") {
        requirePanelRequest(req);
        const { user, password } = await readBody(req);
        const { cookie, session } = await login(req, user, password);
        res.setHeader("Set-Cookie", sessionCookie(cookie));
        return send(res, 200, { user: session.u, name: session.n });
    }
    if (req.method === "DELETE") {
        res.setHeader("Set-Cookie", clearCookie());
        return send(res, 200, { ok: true });
    }
    send(res, 405, { error: "Método no permitido" });
});
