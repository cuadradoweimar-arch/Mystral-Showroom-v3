import apartment from "../assets/images/apartments/apartment-01.jpg";
import levels from "../assets/images/levels/levels.jpg";

/*
=====================================================
CONFIGURACIÓN DE ESCENAS

path:   ruta en la URL (#/path)
kind:   video | image | tour | map | brochure | pointcloud
back:   escena a la que vuelve "VOLVER" si no hay historial
navbar: muestra el menú lateral
=====================================================
*/

export const SCENES = {

    home: {
        path: "",
        kind: "video",
        video: "home-loop",
        loop: true,
        back: null,
        navbar: false,
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
    },

    gallery: {
        path: "disponible",
        kind: "video",
        video: "fachada-trasera",
        loop: true,
        back: "home",
        navbar: true,
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
    },

    project: {
        path: "terraza",
        kind: "tour",
        tour: "terraza",
        back: "home",
        navbar: false,
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
    },

    typeB360: {
        path: "tipo-b",
        kind: "tour",
        tour: "tipoB",
        back: "apartments",
        navbar: false,
    },

    duplex: {
        path: "duplex",
        kind: "tour",
        tour: "duplex",
        back: "apartments",
        navbar: false,
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
