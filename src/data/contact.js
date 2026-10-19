/*
=====================================================
CONTACTO COMERCIAL

whatsapp: número con indicativo, sólo dígitos (ej. "573001234567").
          Vacío → el botón "Solicitar información" no se muestra.
=====================================================
*/

export const CONTACT = {
    whatsapp: "573205713911",
};

export function whatsappLink(message) {
    if (!CONTACT.whatsapp) return null;
    return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
