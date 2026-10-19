/*
=====================================================
INVENTARIO DE UNIDADES — MYSTRAL

Fuente: "Listado de ventas" (INARQ.CO Constructora Salgado SAS).

status: "disponible" | "reservado" | "vendido"
price:  valor de venta de lista en COP (sin descuentos).
        Sólo se muestra en unidades disponibles.
tour:   escena del recorrido 360 de su tipología.
tourStatus: "maintenance" → el recorrido aún no está listo.

Este archivo se publica con el showroom: no incluir datos
de compradores ni descuentos negociados.
=====================================================
*/

export const SHOW_PRICES = true;

// Temporal: los dígitos del precio se muestran como "*"
// (ej. $ *.***.***.***). Poner en false para mostrarlos.
export const MASK_PRICES = true;

export const UNIT_TYPES = {
    A: { name: "Tipo A", tour: "typeA360" },
    B: { name: "Tipo B", tour: "typeB360" },
    duplex: { name: "Dúplex", tour: "duplex" },
};

export const STATUS_LABELS = {
    disponible: "Disponible",
    reservado: "Reservado",
    vendido: "Vendido",
};

export const UNITS = [

    { id: "301", floor: "3", type: "A", area: 220.30, price: 1817475000, status: "disponible" },
    { id: "302", floor: "3", type: "B", area: 214.22, price: 1767315000, status: "disponible" },

    { id: "401", floor: "4", type: "A", area: 220.30, price: 1854551490, status: "vendido" },
    { id: "402", floor: "4", type: "B", area: 214.22, price: 1803368226, status: "disponible" },

    { id: "501", floor: "5", type: "A", area: 220.30, price: 1891642520, status: "disponible" },
    { id: "502", floor: "5", type: "B", area: 214.22, price: 1839435591, status: "disponible" },

    { id: "601", floor: "6", type: "A", area: 220.30, price: 1929475370, status: "disponible" },
    { id: "602", floor: "6", type: "B", area: 214.22, price: 1876224302, status: "vendido" },

    { id: "701", floor: "7", type: "A", area: 220.30, price: 1968064878, status: "vendido" },
    { id: "702", floor: "7", type: "B", area: 214.22, price: 1913748788, status: "disponible" },

    { id: "801", floor: "8", type: "A", area: 220.30, price: 2007426175, status: "vendido" },
    { id: "802", floor: "8", type: "B", area: 214.22, price: 1952023764, status: "disponible" },

    { id: "901", floor: "9", type: "A", area: 220.30, price: 2047574699, status: "vendido" },
    { id: "902", floor: "9", type: "B", area: 214.22, price: 1991064239, status: "vendido" },

    { id: "D01", name: "Dúplex 01", floor: "10-11", type: "duplex", area: 440.40, price: 4175156311, status: "disponible" },
    // El render del dúplex 02 aún no existe.
    { id: "D02", name: "Dúplex 02", floor: "10-11", type: "duplex", area: 428.44, price: 4061771048, status: "vendido", tourStatus: "maintenance" },

];

export function findUnit(id) {
    return UNITS.find((unit) => unit.id === id) ?? null;
}

export function unitName(unit) {
    return unit.name ?? `Apto ${unit.id}`;
}

const priceFormat = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
});

export const formatPrice = (value) => {
    const text = priceFormat.format(value);
    return MASK_PRICES ? text.replace(/\d/g, "*") : text;
};

const areaFormat = new Intl.NumberFormat("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatArea = (value) => `${areaFormat.format(value)} m²`;
