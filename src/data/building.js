/*
=====================================================
MÁSCARA DEL EDIFICIO EN INGRESO

Silueta de la torre sobre el video de ingreso (1920×1366,
cámara fija). Al tocarla se reproduce "frente arriba"
(de la fachada a la vista cenital) y al terminar se abre
NIVELES en el piso indicado (la Terraza, donde termina el video).
=====================================================
*/

export const INGRESO_VIDEO_WIDTH = 1920;
export const INGRESO_VIDEO_HEIGHT = 1366;

export const BUILDING_MASK =
    "M56,280 L190,280 L190,206 L332,190 L332,258 L714,226 L714,192 L828,190 Q872,195 872,240 L872,1078 L56,1078 Z";

export const BUILDING_TRANSITION = {
    video: "frente-arriba",
    scene: "levels",
    room: null, // null = Terraza (primer piso de NIVELES)
};
