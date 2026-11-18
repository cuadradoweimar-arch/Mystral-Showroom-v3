// Llamadas al servidor del panel. La sesión viaja en una cookie HttpOnly.
export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export async function api(path, { method = "GET", body } = {}) {
    const res = await fetch(`/api/${path}`, {
        method,
        credentials: "same-origin",
        cache: "no-store",
        headers: { "x-panel": "1", ...(body ? { "Content-Type": "application/json" } : {}) },
        body: body ? JSON.stringify(body) : undefined,
    });
    let data = {};
    try { data = await res.json(); } catch { /* respuesta vacía */ }
    if (!res.ok) throw new ApiError(res.status, data.error || `Error ${res.status}`);
    return data;
}
