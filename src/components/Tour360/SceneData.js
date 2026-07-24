import sala from "../../assets/panoramas/tipo-a/sala.jpg";
import cocina from "../../assets/panoramas/tipo-a/cocina.jpg";
import habitacion from "../../assets/panoramas/tipo-a/habitacion.png";
import balcon from "../../assets/panoramas/tipo-a/balcon.jpg";

import salaB from "../../assets/panoramas/tipo-b/sala_1.png";
import comedorB from "../../assets/panoramas/tipo-b/comedor.png";
import cocinaB from "../../assets/panoramas/tipo-b/cocina.png";
import habitacionB from "../../assets/panoramas/tipo-b/habitacion.png";
import balconB from "../../assets/panoramas/tipo-b/balcon.png";
import balconB2 from "../../assets/panoramas/tipo-b/balcon1.png";

import duplex360 from "../../assets/panoramas/duplex/render360.jpg";

const SceneData = {

    typeA: [

        {
            id: "sala",
            title: "SALA",
            image: sala
        },

        {
            id: "cocina",
            title: "COCINA",
            image: cocina
        },

        {
            id: "habitacion",
            title: "HABITACIÓN PRINCIPAL",
            image: habitacion
        },

        {
            id: "balcon",
            title: "BALCÓN",
            image: balcon
        }

    ],

    typeB: [

        {
            id: "sala",
            title: "SALA",
            image: salaB
        },

        {
            id: "comedor",
            title: "COMEDOR",
            image: comedorB
        },

        {
            id: "cocina",
            title: "COCINA",
            image: cocinaB
        },

        {
            id: "habitacion",
            title: "HABITACIÓN",
            image: habitacionB
        },

        {
            id: "balcon",
            title: "BALCÓN",
            image: balconB
        },

        {
            id: "balcon2",
            title: "BALCÓN 2",
            image: balconB2
        }

    ],

    duplex: [

        {
            id: "duplex",
            title: "DÚPLEX",
            image: duplex360
        }

    ]

};

export default SceneData;