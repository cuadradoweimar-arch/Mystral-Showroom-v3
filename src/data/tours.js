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

Ubicar una flecha: tomar el punto en la imagen del panorama
(u = proporción desde la izquierda, v = desde arriba, 0-1) y
convertirlo con φ = 2π·u, θ = π·v:
  position = [6·sinθ·cosφ, 6·cosθ, 6·sinθ·sinφ]
v ≈ 0.6 deja la flecha a la altura del piso frente a la puerta.
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
                    { to: "habitacion-3", position: [-5.48, -1.85, 1.59] },
                    { to: "habitacion-principal", position: [-0.36, -1.85, -5.7] },
                ],
            },
            {
                id: "habitacion-principal",
                title: "HABITACIÓN PRINCIPAL",
                image: "tipo-a/habitacion-principal",
                hotspots: [
                    { to: "estar-alcobas", position: [-0.55, -1.49, -5.79] },
                    { to: "bano-1", position: [2.05, -2.21, -5.19] },
                    { to: "balcon-2", position: [-3.83, -2.89, 3.6] },
                ],
            },
            {
                // Usa el panorama del balcón 1 del Tipo B (así estaba en la versión anterior).
                id: "balcon-2",
                title: "BALCÓN 2",
                image: "tipo-b/balcon-1",
                hotspots: [
                    { to: "habitacion-principal", position: [-0.35, -2.21, 5.57] },
                ],
            },
            {
                id: "bano-1",
                title: "BAÑO 1",
                image: "tipo-a/bano-1",
                hotspots: [
                    { to: "habitacion-principal", position: [-4.89, -2.21, -2.69] },
                ],
            },
            {
                id: "habitacion-2",
                title: "HABITACIÓN 2",
                image: "tipo-a/habitacion-2",
                hotspots: [
                    { to: "bano-2", position: [-6.0, -2.0, 0.1] },
                    { to: "estar-alcobas", position: [-5.61, -1.85, -1.07] },
                ],
            },
            {
                id: "bano-2",
                title: "BAÑO 2",
                image: "tipo-a/bano-2",
                hotspots: [
                    { to: "habitacion-2", position: [-4.71, -2.21, 2.99] },
                ],
            },
            {
                id: "habitacion-3",
                title: "HABITACIÓN 3",
                image: "tipo-a/habitacion-3",
                hotspots: [
                    { to: "estar-alcobas", position: [1.39, -2.21, -5.4] },
                    { to: "bano-3", position: [4.07, -2.21, -3.82] },
                ],
            },
            {
                id: "bano-3",
                title: "BAÑO 3",
                image: "tipo-a/bano-3",
                hotspots: [
                    { to: "habitacion-3", position: [5, -1.85, -2.75] },
                ],
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
            {
                id: "sala",
                title: "SALA",
                image: "tipo-b/sala",
                hotspots: [
                    { to: "balcon", position: [4.51, -2.21, 3.28] },
                    { to: "comedor", position: [-5.05, -2.21, -2.38] },
                    { to: "cocina", position: [3.28, -2.21, -4.51] },
                ],
            },
            {
                id: "comedor",
                title: "COMEDOR",
                image: "tipo-b/comedor",
                hotspots: [
                    { to: "sala", position: [-5.05, -2.21, 2.38] },
                    { to: "cocina", position: [-3.35, -1.85, 4.62] },
                    { to: "habitacion", position: [-0.36, -1.85, 5.7] },
                    { to: "habitacion-2", position: [3.5, -1.85, -4.51] },
                    { to: "habitacion-3", position: [5.31, -2.21, 1.72] },
                ],
            },
            {
                id: "cocina",
                title: "COCINA",
                image: "tipo-b/cocina",
                hotspots: [
                    { to: "sala", position: [-1.72, -2.21, 5.31] },
                    { to: "balcon", position: [2.62, -2.55, 4.76] },
                ],
            },
            {
                id: "habitacion",
                title: "HABITACIÓN",
                image: "tipo-b/habitacion",
                hotspots: [
                    { to: "balcon-1", position: [-5.58, -2.21, 0] },
                    { to: "bano-1", position: [5.53, -1.85, 1.42] },
                    { to: "comedor", position: [2.43, -1.85, -5.16] },
                ],
            },
            {
                id: "balcon-1",
                title: "BALCÓN 1",
                image: "tipo-b/balcon-1",
                hotspots: [
                    { to: "habitacion", position: [-0.35, -2.21, 5.57] },
                ],
            },
            {
                id: "bano-1",
                title: "BAÑO 1",
                image: "tipo-b/bano-1",
                hotspots: [
                    { to: "habitacion", position: [5.05, -2.21, -2.38] },
                ],
            },
            {
                id: "habitacion-2",
                title: "HABITACIÓN 2",
                image: "tipo-b/habitacion-2",
                hotspots: [
                    { to: "bano-2", position: [5.31, -1.85, 2.1] },
                    { to: "comedor", position: [5.05, -2.21, -2.38] },
                ],
            },
            {
                id: "bano-2",
                title: "BAÑO 2",
                image: "tipo-b/bano-2",
                hotspots: [
                    { to: "habitacion-2", position: [1.72, -2.21, -5.31] },
                ],
            },
            {
                id: "habitacion-3",
                title: "HABITACIÓN 3",
                image: "tipo-b/habitacion-3",
                hotspots: [
                    { to: "comedor", position: [5, -1.85, 2.75] },
                    { to: "bano-3", position: [0, -1.85, -5.71] },
                ],
            },
            {
                id: "bano-3",
                title: "BAÑO 3",
                image: "tipo-b/bano-3",
                hotspots: [
                    { to: "habitacion-3", position: [5.31, -1.85, 2.1] },
                ],
            },
            {
                id: "balcon",
                title: "BALCÓN",
                image: "tipo-b/balcon",
                hotspots: [
                    { to: "sala", position: [0, -2.21, 5.58] },
                ],
            },
        ],
    },

    duplex: {
        label: "Apartamento Dúplex",
        rooms: [
            {
                id: "entrada",
                title: "ENTRADA",
                image: "duplex/entrada",
                hotspots: [
                    { to: "sala-estar", position: [-5.7, -1.85, 0.36] },
                ],
            },
            {
                id: "comedor",
                title: "COMEDOR",
                image: "duplex/comedor",
                hotspots: [
                    { to: "sala-estar", position: [-5.43, -1.85, -1.76] },
                    { to: "muebles", position: [-5, -1.85, 2.75] },
                ],
            },
            {
                id: "muebles",
                title: "MUEBLES",
                image: "duplex/muebles",
                hotspots: [
                    { to: "comedor", position: [-5.66, -1.85, 0.72] },
                ],
            },
            {
                id: "sala",
                title: "SALA",
                image: "duplex/sala",
                hotspots: [
                    { to: "balcon", position: [4.07, -2.21, -3.82] },
                    { to: "sala-estar", position: [-5.16, -1.85, 2.43] },
                    { to: "muebles", position: [-5.41, -2.38, -1.03] },
                ],
            },
            {
                id: "balcon",
                title: "BALCÓN",
                image: "duplex/balcon",
                hotspots: [
                    { to: "sala", position: [-5.4, -2.21, 1.39] },
                ],
            },
            {
                id: "sala-estar",
                title: "SALA DE ESTAR",
                image: "duplex/sala-estar",
                hotspots: [
                    { to: "comedor", position: [0, -1.85, 5.71] },
                    { to: "sala", position: [-5.58, -2.21, 0] },
                    { to: "entrada", position: [2.1, -1.85, -5.31] },
                ],
            },
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
