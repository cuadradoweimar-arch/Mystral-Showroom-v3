/*
Datos del panel: estado de las unidades y clientes.

- En Vercel: base Postgres (Neon) conectada al proyecto → DATABASE_URL.
- En desarrollo sin DATABASE_URL: archivo local .data/panel.json
  (nunca se publica; está en .gitignore).

El inventario base (áreas, precios, tipologías) sigue en src/data/units.js;
aquí sólo se guarda el estado que cambia el vendedor.
*/
import { httpError } from "./http.js";

export const UNIT_STATUSES = ["disponible", "reservado", "vendido"];
export const CLIENT_STATUSES = ["sin_contactar", "contactado", "cotizado", "visito", "reservo", "compro", "descartado"];

const dbUrl = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

// ---------- validación ----------
const clip = (value, max) => (value === undefined || value === null ? null : String(value).trim().slice(0, max) || null);

function isDate(value) {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

export function cleanClient(input, partial = false) {
    const out = {};
    const has = (key) => Object.prototype.hasOwnProperty.call(input, key);
    if (!partial || has("name")) {
        out.name = clip(input.name, 120);
        if (!out.name) throw httpError(400, "El nombre es obligatorio");
    }
    if (has("phone")) out.phone = clip(input.phone, 40);
    if (has("email")) out.email = clip(input.email, 160);
    if (has("notes")) out.notes = clip(input.notes, 2000);
    if (has("unit_id")) out.unit_id = clip(input.unit_id, 20);
    if (!partial || has("status")) {
        out.status = input.status ?? "sin_contactar";
        if (!CLIENT_STATUSES.includes(out.status)) throw httpError(400, "Estado de cliente inválido");
    }
    if (has("next_contact")) {
        out.next_contact = input.next_contact || null;
        if (out.next_contact && !isDate(out.next_contact)) throw httpError(400, "Fecha inválida");
    }
    if (has("last_contact")) {
        out.last_contact = input.last_contact ? new Date(input.last_contact).toISOString() : null;
    }
    return out;
}

const FIELDS = ["name", "phone", "email", "status", "unit_id", "notes", "next_contact", "last_contact"];

// ---------- Postgres (Neon) ----------
let pg = null;
async function postgres() {
    if (pg) return pg;
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(dbUrl());
    await sql`create table if not exists unit_status (
        id text primary key,
        status text not null,
        updated_at timestamptz not null default now(),
        updated_by text
    )`;
    await sql`create table if not exists clients (
        id bigserial primary key,
        name text not null,
        phone text, email text,
        status text not null default 'sin_contactar',
        unit_id text, notes text,
        next_contact date,
        last_contact timestamptz,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
    )`;
    pg = sql;
    return sql;
}

const rowOut = (row) => row && ({
    ...row,
    id: Number(row.id),
    next_contact: row.next_contact instanceof Date ? row.next_contact.toISOString().slice(0, 10) : row.next_contact,
});

const pgStore = {
    async unitStatuses() {
        const sql = await postgres();
        const rows = await sql`select id, status, updated_at, updated_by from unit_status`;
        return rows;
    },
    async setUnitStatus(id, status, by) {
        const sql = await postgres();
        await sql`insert into unit_status (id, status, updated_at, updated_by) values (${id}, ${status}, now(), ${by})
                  on conflict (id) do update set status = excluded.status, updated_at = now(), updated_by = excluded.updated_by`;
    },
    async listClients() {
        const sql = await postgres();
        return (await sql`select * from clients order by created_at desc`).map(rowOut);
    },
    async createClient(data) {
        const sql = await postgres();
        const [row] = await sql`insert into clients (name, phone, email, status, unit_id, notes, next_contact, last_contact)
            values (${data.name}, ${data.phone ?? null}, ${data.email ?? null}, ${data.status}, ${data.unit_id ?? null},
                    ${data.notes ?? null}, ${data.next_contact ?? null}, ${data.last_contact ?? null}) returning *`;
        return rowOut(row);
    },
    async updateClient(id, data) {
        const sql = await postgres();
        const [current] = await sql`select * from clients where id = ${id}`;
        if (!current) throw httpError(404, "Cliente no encontrado");
        const next = { ...rowOut(current), ...data };
        const [row] = await sql`update clients set name = ${next.name}, phone = ${next.phone}, email = ${next.email},
            status = ${next.status}, unit_id = ${next.unit_id}, notes = ${next.notes}, next_contact = ${next.next_contact},
            last_contact = ${next.last_contact}, updated_at = now() where id = ${id} returning *`;
        return rowOut(row);
    },
    async deleteClient(id) {
        const sql = await postgres();
        await sql`delete from clients where id = ${id}`;
    },
};

// ---------- archivo local (sólo desarrollo) ----------
async function fileIO() {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const file = path.join(process.cwd(), ".data", "panel.json");
    const read = async () => {
        try { return JSON.parse(await fs.readFile(file, "utf8")); } catch { return { units: {}, clients: [], seq: 0 }; }
    };
    const write = async (data) => {
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, JSON.stringify(data, null, 2));
    };
    return { read, write };
}

const fileStore = {
    async unitStatuses() {
        const { read } = await fileIO();
        const data = await read();
        return Object.entries(data.units).map(([id, value]) => ({ id, ...value }));
    },
    async setUnitStatus(id, status, by) {
        const { read, write } = await fileIO();
        const data = await read();
        data.units[id] = { status, updated_at: new Date().toISOString(), updated_by: by };
        await write(data);
    },
    async listClients() {
        const { read } = await fileIO();
        return (await read()).clients.slice().sort((a, b) => b.created_at.localeCompare(a.created_at));
    },
    async createClient(input) {
        const { read, write } = await fileIO();
        const data = await read();
        const now = new Date().toISOString();
        const row = { id: ++data.seq, ...Object.fromEntries(FIELDS.map((k) => [k, input[k] ?? null])), created_at: now, updated_at: now };
        data.clients.push(row);
        await write(data);
        return row;
    },
    async updateClient(id, input) {
        const { read, write } = await fileIO();
        const data = await read();
        const row = data.clients.find((c) => c.id === id);
        if (!row) throw httpError(404, "Cliente no encontrado");
        Object.assign(row, input, { updated_at: new Date().toISOString() });
        await write(data);
        return row;
    },
    async deleteClient(id) {
        const { read, write } = await fileIO();
        const data = await read();
        data.clients = data.clients.filter((c) => c.id !== id);
        await write(data);
    },
};

export function store() {
    if (dbUrl()) return pgStore;
    if (process.env.VERCEL) throw httpError(503, "Base de datos no conectada (DATABASE_URL)");
    return fileStore;
}
