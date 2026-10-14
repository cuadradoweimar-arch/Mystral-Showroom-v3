/*
=====================================================
NIVELES SOBRE LA FACHADA TRASERA

Las zonas están dibujadas en coordenadas de "niveles.svg"
y se ubican sobre el video (1920×1080) con LEVELS_TRANSFORM.
El SVG usa el mismo encuadre que el video (object-fit: cover),
así que queda alineado en cualquier tamaño de pantalla.

side:   "left" | "right" (lado del núcleo de ascensores)
target: tour 360 que abre al tocarla
status: "maintenance" → muestra un aviso en vez de abrir el tour
=====================================================
*/

export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;

// Medido sobre el fotograma del video: bloque izquierdo desde x≈650,
// balcones derechos hasta x≈1222, último piso hasta y≈795.
export const LEVELS_TRANSFORM = "translate(650 211) scale(1.199)";

export const LEVELS = [

    // DÚPLEX 10-11
    { id: "duplex-left", name: "DÚPLEX", floors: "10-11", side: "left", target: "duplex", d: "M272,119.09V33.09L96,8.09l-36-4L36,.09s-10.03.45-12,0-12,1-12,1l-7,6L0,14.09v91l6-5,9-4,11-2h17l16,2,213,23Z" },
    { id: "duplex-right", name: "DÚPLEX", floors: "10-11", side: "right", status: "maintenance", d: "M476,144.09V60.09l-110-15,1,87,109,12Z" },

    // PENTHOUSE 9
    { id: "penthouse-left", name: "PENTHOUSE", floors: "9", side: "left", target: "typeA360", d: "M272,135.45L96,116.09l-35-3-26-3h-18l-5,2-5,2-4,5-2,4v36l4-5,3-2,6-3,7,1,40,3,35,2,176,16Z" },
    { id: "penthouse-right", name: "PENTHOUSE", floors: "9", side: "right", target: "typeB360", d: "M367,145.9L476,158.09V192.09L367,181.09Z" },

    // APARTAMENTOS 8 → 3
    { id: "8-left", name: "NIVEL", floors: "8", side: "left", target: "typeA360", d: "M271,222.09v-35l-176-16-34-4-24-2-15-1-14,3-6,6-1,39,5-5,8-3,23,2,22,1,212,15Z" },
    { id: "8-right", name: "NIVEL", floors: "8", side: "right", target: "typeB360", d: "M476,241.09l-1-35-109-10v35l110,10Z" },

    { id: "7-left", name: "NIVEL", floors: "7", side: "left", target: "typeA360", d: "M96,225.09l-36-3-37-2-9,1-8,2-6,5,1,38,6-5s6.91-2.14,9-2,15,0,15,0l29,2,36,1,175,12v-35l-175-14Z" },
    { id: "7-right", name: "NIVEL", floors: "7", side: "right", target: "typeB360", d: "M367,247.09v35l108,7v-34l-108-8Z" },

    { id: "6-left", name: "NIVEL", floors: "6", side: "left", target: "typeA360", d: "M272,326.09l-212-10-45-2h-5l-5,2-3,3-1-36,4-4,7-3s6.51-.75,8-1,17,0,17,0l24,1,210,14,1,36Z" },
    { id: "6-right", name: "NIVEL", floors: "6", side: "right", target: "typeB360", d: "M475,338.09v-34l-108-7v35l108,6Z" },

    { id: "5-left", name: "NIVEL", floors: "5", side: "left", target: "typeA360", d: "M272,341.09l-256-11-6,1-5,2-4,4v37l4-2,5-1h51l211,6v-36Z" },
    { id: "5-right", name: "NIVEL", floors: "5", side: "right", target: "typeB360", d: "M477,351.09l-110-4v36l109,4,1-36Z" },

    { id: "4-left", name: "NIVEL", floors: "4", side: "left", target: "typeA360", d: "M273,388.09v41l-261-3H2v-37l4-2,7-1h48l212,2Z" },
    { id: "4-right", name: "NIVEL", floors: "4", side: "right", target: "typeB360", d: "M476,436.09l-109-2v-37l110,3-1,36Z" },

    { id: "3-left", name: "NIVEL", floors: "3", side: "left", target: "typeA360", d: "M271,446.09l-253-6-9,2-8,1,1,37h4l7-1,47,1,211,2v-36Z" },
    { id: "3-right", name: "NIVEL", floors: "3", side: "right", target: "typeB360", d: "M476,485.09v-35l-109-2v35l109,2Z" },

];
