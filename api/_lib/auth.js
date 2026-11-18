/*
Sesión del panel de vendedor.

Credenciales (variables de entorno en Vercel, o .env.local en desarrollo):
  PANEL_USER       usuario del vendedor
  PANEL_PASSWORD   contraseña
  PANEL_NAME       nombre que se muestra en el panel (opcional)
  SESSION_SECRET   clave larga y aleatoria para firmar la sesión

La sesión es una cookie HttpOnly firmada con HMAC: el navegador la envía
sola, pero ningún script de la página puede leerla.
*/
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { httpError } from "./http.js";

const COOKIE = "mys_panel";
const MAX_AGE = 12 * 60 * 60; // 12 h

const isProd = () => Boolean(process.env.VERCEL);

function secret() {
    const value = process.env.SESSION_SECRET;
    if (value && value.length >= 24) return value;
    if (isProd()) throw httpError(503, "Panel sin configurar (SESSION_SECRET)");
    return "solo-desarrollo-no-usar-en-produccion";
}

function credentials() {
    const user = process.env.PANEL_USER;
    const password = process.env.PANEL_PASSWORD;
    if (!user || !password) throw httpError(503, "Panel sin configurar (PANEL_USER / PANEL_PASSWORD)");
    return { user, password, name: process.env.PANEL_NAME || user };
}

const sha = (text) => createHash("sha256").update(text).digest();
const sign = (payload) => createHmac("sha256", secret()).update(payload).digest("base64url");

function sameText(a, b) {
    // compara en tiempo constante (no revela cuántos caracteres coinciden)
    return timingSafeEqual(sha(a), sha(b));
}

// Freno a los intentos repetidos (por instancia del servidor)
const attempts = new Map();
function throttle(ip) {
    const now = Date.now();
    const entry = attempts.get(ip) || { count: 0, until: 0 };
    if (entry.until > now) throw httpError(429, "Demasiados intentos. Espera un minuto.");
    return entry;
}

export async function login(req, user, password) {
    const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "?").split(",")[0].trim();
    const entry = throttle(ip);
    const cred = credentials();
    const ok = sameText(String(user || "").trim().toLowerCase(), cred.user.toLowerCase()) & sameText(String(password || ""), cred.password);
    if (!ok) {
        entry.count++;
        if (entry.count >= 5) { entry.count = 0; entry.until = Date.now() + 60_000; }
        attempts.set(ip, entry);
        await new Promise((r) => setTimeout(r, 600));
        throw httpError(401, "Usuario o contraseña incorrectos");
    }
    attempts.delete(ip);
    const session = { u: cred.user, n: cred.name, exp: Math.floor(Date.now() / 1000) + MAX_AGE };
    const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
    return { cookie: `${payload}.${sign(payload)}`, session };
}

export function sessionCookie(value, maxAge = MAX_AGE) {
    return [
        `${COOKIE}=${value}`,
        "Path=/",
        "HttpOnly",
        "SameSite=Strict",
        `Max-Age=${maxAge}`,
        isProd() ? "Secure" : "",
    ].filter(Boolean).join("; ");
}

export const clearCookie = () => sessionCookie("", 0);

export function readSession(req) {
    const raw = String(req.headers.cookie || "")
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${COOKIE}=`));
    if (!raw) return null;
    const [payload, signature] = raw.slice(COOKIE.length + 1).split(".");
    if (!payload || !signature) return null;
    const expected = sign(payload);
    if (expected.length !== signature.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
    try {
        const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        if (!session.exp || session.exp < Date.now() / 1000) return null;
        return { user: session.u, name: session.n };
    } catch {
        return null;
    }
}

export function requireSession(req) {
    const session = readSession(req);
    if (!session) throw httpError(401, "Inicia sesión");
    return session;
}
