/*
=====================================================
RECORRIDOS 360

Cada habitación:
  id:       identificador (aparece en la URL: #/tipo-a/cocina)
  title:    nombre visible
  image:    panorama en src/assets/panoramas (sin extensión)
  hotspots: flechas dentro del panorama
            { to: "id-habitación", position: [x, y, z], label? }
            { back: true, ... } vuelve a la escena anterior

El orden de "rooms" es el orden del menú.
=====================================================
*/

export const TOURS = {

    terraza: {
        label: "MYSTRAL",
        menu: false,
        rooms: [
            {
                id: "terraza",
                title: "TERRAZA",
                image: "terraza/terraza",
                hotspots: [
                    { to: "terraza-2", position: [-3.0, -2.2, -0.05] },
                ],
            },
            {
                id: "terraza-2",
                title: "TERRAZA 2",
                image: "terraza/terraza-2",
                hotspots: [
                    { to: "terraza", position: [-2, -2, -0.01] },
                ],
            },
        ],
    },

    tipoA: {
        label: "Apartamento Tipo A",
        rooms: [
            {
                id: "sala",
                title: "SALA",
                image: "tipo-a/sala",
                hotspots: [
                    { to: "cocina", position: [-4.5, -2.0, 3] },
                    { to: "balcon", position: [5, -3.0, -3] },
                ],
            },
            {
                id: "cocina",
                title: "COCINA",
                image: "tipo-a/cocina",
                hotspots: [
                    { to: "sala", position: [-5, -1.5, 1] },
                    { to: "estar-alcobas", position: [0.05, -2.0, -6] },
                ],
            },
            {
                id: "estar-alcobas",
                title: "ESTAR DE ALCOBAS",
                image: "tipo-a/estar-alcobas",
                hotspots: [
                    { to: "cocina", position: [1.0, -2.0, 0.5] },
                    { to: "habitacion-2", position: [-6.0, -2.0, -0.05] },
                ],
            },
            {
                id: "habitacion-principal",
                title: "HABITACIÓN PRINCIPAL",
                image: "tipo-a/habitacion-principal",
            },
            {
                // Usa el panorama del balcón 1 del Tipo B (así estaba en la versión anterior).
                id: "balcon-2",
                title: "BALCÓN 2",
                image: "tipo-b/balcon-1",
            },
            {
                id: "bano-1",
                title: "BAÑO 1",
                image: "tipo-a/bano-1",
            },
            {
                id: "habitacion-2",
                title: "HABITACIÓN 2",
                image: "tipo-a/habitacion-2",
                hotspots: [
                    { to: "bano-2", position: [-6.0, -2.0, 0.1] },
                ],
            },
            {
                id: "bano-2",
                title: "BAÑO 2",
                image: "tipo-a/bano-2",
            },
            {
                id: "habitacion-3",
                title: "HABITACIÓN 3",
                image: "tipo-a/habitacion-3",
            },
            {
                id: "bano-3",
                title: "BAÑO 3",
                image: "tipo-a/bano-3",
            },
            {
                id: "balcon",
                title: "BALCÓN",
                image: "tipo-a/balcon",
                hotspots: [
                    { to: "sala", position: [3.0, -2.0, 0.5] },
                ],
            },
        ],
    },

    tipoB: {
        label: "Apartamento Tipo B",
        rooms: [
            { id: "sala", title: "SALA", image: "tipo-b/sala" },
            { id: "comedor", title: "COMEDOR", image: "tipo-b/comedor" },
            { id: "cocina", title: "COCINA", image: "tipo-b/cocina" },
            { id: "habitacion", title: "HABITACIÓN", image: "tipo-b/habitacion" },
            { id: "balcon-1", title: "BALCÓN 1", image: "tipo-b/balcon-1" },
            { id: "bano-1", title: "BAÑO 1", image: "tipo-b/bano-1" },
            { id: "habitacion-2", title: "HABITACIÓN 2", image: "tipo-b/habitacion-2" },
            { id: "bano-2", title: "BAÑO 2", image: "tipo-b/bano-2" },
            { id: "habitacion-3", title: "HABITACIÓN 3", image: "tipo-b/habitacion-3" },
            { id: "bano-3", title: "BAÑO 3", image: "tipo-b/bano-3" },
            { id: "balcon", title: "BALCÓN", image: "tipo-b/balcon" },
        ],
    },

    duplex: {
        label: "Apartamento Dúplex",
        rooms: [
            { id: "entrada", title: "ENTRADA", image: "duplex/entrada" },
            { id: "comedor", title: "COMEDOR", image: "duplex/comedor" },
            { id: "muebles", title: "MUEBLES", image: "duplex/muebles" },
            { id: "sala", title: "SALA", image: "duplex/sala" },
            { id: "balcon", title: "BALCÓN", image: "duplex/balcon" },
            { id: "sala-estar", title: "SALA DE ESTAR", image: "duplex/sala-estar" },
        ],
    },

    ingreso: {
        label: "MYSTRAL",
        menu: false,
        rooms: [
            {
                id: "calle",
                title: "INGRESO",
                image: "ingreso/calle",
                hotspots: [
                    { back: true, label: "INGRESO", position: [-3, -1.2, 0] },
                ],
            },
        ],
    },

};
