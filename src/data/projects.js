/*
=====================================================
PROYECTOS DEL MAPA

scene: escena de este showroom que abre el proyecto
url:   showroom externo (se abre en otra pestaña)
image: foto del proyecto en su ficha del mapa (opcional)
=====================================================
*/

import mystralImage from "../assets/images/projects/mystral.jpg";

export const PROJECTS = [
    {
        name: "MYSTRAL",
        city: "Montería",
        country: "Colombia",
        coordinates: [-75.871683, 8.780019],
        scene: "home",
        image: mystralImage,
    },
    {
        name: "ARENA",
        city: "Coveñas",
        country: "Colombia",
        coordinates: [-75.663596, 9.410074],
        url: "https://arena-showroom-rho.vercel.app/",
    },
    {
        name: "LA MAR",
        city: "Coveñas",
        country: "Colombia",
        coordinates: [-75.663983, 9.40949],
    },
    {
        name: "IUC",
        fullName: "Instituto Universitario de Córdoba",
        city: "Montería",
        country: "Colombia",
        coordinates: [-75.864421, 8.788177],
    },
    {
        name: "RIVIERA",
        city: "Montería",
        country: "Colombia",
        coordinates: [-75.869249, 8.786343],
    },
];
