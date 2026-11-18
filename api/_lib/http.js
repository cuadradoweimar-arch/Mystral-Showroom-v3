/*
Utilidades HTTP comunes a las funciones del panel de vendedor.
Escritas sobre la API nativa de Node (req/res) para que funcionen igual
en Vercel y en el servidor de desarrollo de Vite (vite.config.js).
*/

export function send(res, status, data) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    // Datos del panel: nunca en caché compartida ni indexados
    if (!res.getHeader("Cache-Control")) res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Robots-Tag", "noindex");
    res.end(JSON.stringify(data));
}

export async function readBody(req) {
    if (req.body !== undefined && req.body !== null && typeof req.body === "object") return req.body;
    if (typeof req.body === "string") return safeJson(req.body);
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
        size += chunk.length;
        if (size > 64 * 1024) throw httpError(413, "Solicitud demasiado grande");
        chunks.push(chunk);
    }
    return safeJson(Buffer.concat(chunks).toString("utf8"));
}

function safeJson(text) {
    if (!text) return {};
    try {
        return JSON.parse(text);
    } catch {
        throw httpError(400, "JSON inválido");
    }
}

export function httpError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

// Las peticiones que cambian datos deben venir del propio panel
// (cabecera propia + cookie SameSite=Strict → protección CSRF).
export function requirePanelRequest(req) {
    if (req.headers["x-panel"] !== "1") throw httpError(403, "Solicitud no permitida");
}

export function handle(fn) {
    return async (req, res) => {
        try {
            await fn(req, res);
        } catch (error) {
            const status = error.status || 500;
            if (status >= 500) console.error(error);
            send(res, status, { error: status >= 500 ? "Error del servidor" : error.message });
        }
    };
}
