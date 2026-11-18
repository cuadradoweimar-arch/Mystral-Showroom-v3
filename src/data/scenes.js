import apartment from "../assets/images/apartments/apartment-01.jpg";
import levels from "../assets/images/levels/levels.jpg";

/*
=====================================================
CONFIGURACIÓN DE ESCENAS

path:   ruta en la URL (#/path)
kind:   video | image | tour | map | brochure | pointcloud | intro
back:   escena a la que vuelve "VOLVER" si no hay historial
navbar: muestra el menú lateral
sound:  pista de sonido ambiente (src/lib/ambientAudio.js → TRACKS);
        sin "sound" la escena queda en silencio
=====================================================
*/

export const SCENES = {

    // Intro: mapa de la zona antes de la portada. Al abrir el
    // showroom en la raíz se redirige aquí una vez por visita
    // (useSceneRouter.js); "INGRESAR" lleva a la portada.
    intro: {
        path: "mapa",
        kind: "intro",
        back: "home",
        navbar: false,
    },

    home: {
        path: "",
        kind: "video",
        video: "home-loop",
        loop: true,
        back: null,
        navbar: false,
        sound: "exterior",
    },

    location: {
        path: "ubicacion",
        kind: "video",
        video: "ubicacion",
        loop: false,
        // Al terminar el video pasa automáticamente a la fachada.
        next: "gallery",
        back: "home",
        navbar: true,
        sound: "exterior",
    },

    gallery: {
        path: "disponible",
        kind: "video",
        video: "fachada-trasera",
        loop: true,
        back: "home",
        navbar: true,
        sound: "disponible",
    },

    ingreso: {
        path: "ingreso",
        kind: "video",
        video: "ingreso",
        loop: false,
        back: "home",
        navbar: true,
    },

    ingresoPanorama: {
        path: "ingreso-360",
        kind: "tour",
        tour: "ingreso",
        back: "ingreso",
        navbar: false,
        sound: "tour",
    },

    project: {
        path: "terraza",
        kind: "tour",
        tour: "terraza",
        back: "home",
        navbar: false,
        sound: "tour",
    },

    apartments: {
        path: "apartamentos",
        kind: "image",
        image: apartment,
        back: "home",
        navbar: true,
    },

    typeA360: {
        path: "tipo-a",
        kind: "tour",
        tour: "tipoA",
        back: "apartments",
        navbar: false,
        sound: "tour",
    },

    typeB360: {
        path: "tipo-b",
        kind: "tour",
        tour: "tipoB",
        back: "apartments",
        navbar: false,
        sound: "tour",
    },

    duplex: {
        path: "duplex",
        kind: "tour",
        tour: "duplex",
        back: "apartments",
        navbar: false,
        sound: "tour",
    },

    // El piso elegido va en la URL: #/niveles/8
    levels: {
        path: "niveles",
        kind: "image",
        image: levels,
        back: "home",
        navbar: false,
    },

    projects: {
        path: "proyectos",
        kind: "map",
        back: "home",
        navbar: false,
    },

    brochure: {
        path: "brochure",
        kind: "brochure",
        back: "home",
        navbar: false,
    },

    // Nube de puntos de la captura D5 XR (public/nube/mystral.ply)
    pointCloud: {
        path: "modelo-3d",
        kind: "pointcloud",
        back: "home",
        navbar: false,
    },

};

export function sceneFromPath(path) {
    return Object.keys(SCENES).find((id) => SCENES[id].path === path) ?? null;
}
