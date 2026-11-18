import { UNITS, UNIT_TYPES, unitName } from "../data/units";

export const CLIENT_STATUS = {
    sin_contactar: "Sin contactar",
    contactado: "Contactado",
    cotizado: "Cotizado",
    visito: "Visitó la obra",
    reservo: "Reservó",
    compro: "Compró",
    descartado: "Descartado",
};

export const UNIT_STATUS = {
    disponible: { label: "Disponible", color: "#3ddc97" },
    reservado: { label: "Reservado", color: "#f5b84b" },
    vendido: { label: "Vendido", color: "#ff5d6c" },
};

// Pisos de abajo hacia arriba (como se ven en el edificio)
export const PANEL_FLOORS = ["3", "4", "5", "6", "7", "8", "9", "10-11"];
export const floorLabel = (floor) => (floor === "10-11" ? "Dúplex" : `Piso ${floor}`);
export const floorShort = (floor) => (floor === "10-11" ? "D" : floor);

export { UNITS, UNIT_TYPES, unitName };
export const unitById = (id) => UNITS.find((u) => u.id === id) || null;

const DAY = 86400000;
export const todayISO = () => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
export const addDaysISO = (days) => {
    const d = new Date(Date.now() + days * DAY);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};
const daysBetween = (fromISO, toISO) => Math.round((Date.parse(toISO) - Date.parse(fromISO)) / DAY);

const CLOSED = new Set(["compro", "descartado"]);

/*
Seguimiento de un cliente:
- con "próximo contacto": vence ese día; atrasado = días desde entonces
- sin fecha y sin contactar: vence desde que se registró
*/
export function followUp(client) {
    if (CLOSED.has(client.status)) return { due: false, overdue: 0 };
    const today = todayISO();
    let dueDate = client.next_contact;
    if (!dueDate && client.status === "sin_contactar") dueDate = String(client.created_at || today).slice(0, 10);
    if (!dueDate) return { due: false, overdue: 0 };
    const overdue = daysBetween(dueDate, today);
    return { due: overdue >= 0, overdue: Math.max(0, overdue), dueDate };
}

export function followUpText(client) {
    const { due, overdue, dueDate } = followUp(client);
    if (!dueDate || CLOSED.has(client.status)) return null;
    if (!due) return `Próximo contacto ${formatDate(dueDate)}`;
    if (overdue === 0) return "Para hoy";
    return `Atrasado ${overdue} día${overdue === 1 ? "" : "s"}`;
}

export const formatDate = (iso) =>
    new Date(`${String(iso).slice(0, 10)}T12:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "short" });

export const initials = (name) =>
    String(name || "?").trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

// WhatsApp: números colombianos de 10 dígitos (3xx...) llevan el 57 delante
export function whatsappLink(phone, name) {
    let digits = String(phone || "").replace(/\D/g, "");
    if (!digits) return null;
    if (digits.length === 10 && digits.startsWith("3")) digits = `57${digits}`;
    const first = String(name || "").trim().split(/\s+/)[0];
    const text = `Hola${first ? ` ${first}` : ""}, te escribo de Mystral, el proyecto frente al río Sinú. ¿Tienes un momento?`;
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function greeting(date = new Date()) {
    const h = date.getHours();
    if (h < 12) return "Buenos días";
    if (h < 19) return "Buenas tardes";
    return "Buenas noches";
}

const money = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
export const formatMoney = (value) => money.format(value);
const area = new Intl.NumberFormat("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const formatArea = (value) => `${area.format(value)} m²`;

// Listado de ventas: valores con el descuento de cada unidad
export function saleOf(unit) {
    const discount = unit.discount ?? 0;
    // sin redondear: así los totales cuadran con la hoja (se redondea al mostrar)
    const final = unit.price * (1 - discount / 100);
    return {
        m2: unit.price / unit.area,
        discount,
        m2Final: final / unit.area,
        final,
    };
}
const pct = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 2 });
export const formatPct = (value) => `${pct.format(value)} %`;
