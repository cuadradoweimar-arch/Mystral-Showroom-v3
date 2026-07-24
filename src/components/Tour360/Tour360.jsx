import { useState, useEffect } from "react";

import "./Tour360.css";
import Viewer360 from "./Viewer360";

// ======================
// TIPO A
// ======================

import sala from "../../assets/panoramas/tipo-a/sala.jpg";
import cocina from "../../assets/panoramas/tipo-a/cocina.jpg";
import habitacion from "../../assets/panoramas/tipo-a/habitacion.png";
import balcon from "../../assets/panoramas/tipo-a/balcon.jpg";

// ======================
// TIPO B
// ======================

import salaB from "../../assets/panoramas/tipo-b/sala.png";
import comedorB from "../../assets/panoramas/tipo-b/comedor.png";
import cocinaB from "../../assets/panoramas/tipo-b/cocina.png";
import habitacionB from "../../assets/panoramas/tipo-b/habitacion.png";
import balconB from "../../assets/panoramas/tipo-b/balcon.png";
import balconB2 from "../../assets/panoramas/tipo-b/balcon2.png";

// ======================
// DÚPLEX
// ======================

import PM1 from "../../assets/panoramas/duplex/Entrada.png";
import PM3 from "../../assets/panoramas/duplex/Comedor.png";
import PM5 from "../../assets/panoramas/duplex/Muebles.png";
import PM6 from "../../assets/panoramas/duplex/Sala1.png";
import PM7 from "../../assets/panoramas/duplex/Balcon.png";
import PM21 from "../../assets/panoramas/duplex/Sala Estar.png";

export default function Tour360({ scene, setScene }) {

    const [current, setCurrent] = useState(sala);
    const [title, setTitle] = useState("SALA");

    const isDuplex = scene === "duplex";
    const isTypeB = scene === "typeB360";

    useEffect(() => {

        if (scene === "duplex") {

            setCurrent(PM1);
setTitle("PM 1");

        }

        else if (scene === "typeA360") {

            setCurrent(sala);
            setTitle("SALA");

        }

        else if (scene === "typeB360") {

            setCurrent(salaB);
            setTitle("SALA");

        }

    }, [scene]);

    if (
        scene !== "typeA360" &&
        scene !== "typeB360" &&
        scene !== "duplex"
    ) return null;

    return (

        <div className="tour360">

            {/* ========================= */}
            {/* INFORMACIÓN */}
            {/* ========================= */}

            <div className="panorama-info">

                <span className="panorama-apartment">

                    {isDuplex
                        ? "Apartamento Dúplex"
                        : isTypeB
                        ? "Apartamento Tipo B"
                        : "Apartamento Tipo A"}

                </span>

                <h2 className="panorama-title">
                    {title}
                </h2>

            </div>

            {/* ========================= */}
            {/* MENÚ */}
            {/* ========================= */}

            <div className="tour360-menu">

                {isDuplex ? (

    <>

        <button
            className="menu-item"
            onClick={() => {
                setCurrent(PM1);
                setTitle("Entrada");
            }}
        >
            Entrada
        </button>

        <button
            className="menu-item"
            onClick={() => {
                setCurrent(PM3);
                setTitle("Comedor");
            }}
        >
            Comedor
        </button>

        <button
            className="menu-item"
            onClick={() => {
                setCurrent(PM5);
                setTitle("Muebles");
            }}
        >
            Muebles
        </button>

        <button
            className="menu-item"
            onClick={() => {
                setCurrent(PM6);
                setTitle("Sala1");
            }}
        >
            Sala1
        </button>

        <button
            className="menu-item"
            onClick={() => {
                setCurrent(PM7);
                setTitle("Balcon");
            }}
        >
            Balcon
        </button>

        <button
            className="menu-item"
            onClick={() => {
                setCurrent(PM21);
                setTitle("Sala Estar");
            }}
        >
            Sala Estar
        </button>

    </>

) : isTypeB ? (

                    <>

                        <button
                            className="menu-item"
                            onClick={() => {
                                setCurrent(salaB);
                                setTitle("SALA");
                            }}
                        >
                            SALA
                        </button>

                        <button
                            className="menu-item"
                            onClick={() => {
                                setCurrent(comedorB);
                                setTitle("COMEDOR");
                            }}
                        >
                            COMEDOR
                        </button>

                        <button
                            className="menu-item"
                            onClick={() => {
                                setCurrent(cocinaB);
                                setTitle("COCINA");
                            }}
                        >
                            COCINA
                        </button>

                        <button
                            className="menu-item"
                            onClick={() => {
                                setCurrent(habitacionB);
                                setTitle("HABITACIÓN");
                            }}
                        >
                            HABITACIÓN
                        </button>

                        <button
                            className="menu-item"
                            onClick={() => {
                                setCurrent(balconB);
                                setTitle("BALCÓN");
                            }}
                        >
                            BALCÓN
                        </button>

                        <button
                            className="menu-item"
                            onClick={() => {
                                setCurrent(balconB2);
                                setTitle("BALCÓN 2");
                            }}
                        >
                            BALCÓN 2
                        </button>

                    </>

                ) : (

                    <>

                        <button
                            className="menu-item"
                            onClick={() => {
                                setCurrent(sala);
                                setTitle("SALA");
                            }}
                        >
                            SALA
                        </button>

                        <button
                            className="menu-item"
                            onClick={() => {
                                setCurrent(cocina);
                                setTitle("COCINA");
                            }}
                        >
                            COCINA
                        </button>

                        <button
                            className="menu-item"
                            onClick={() => {
                                setCurrent(habitacion);
                                setTitle("HABITACIÓN PRINCIPAL");
                            }}
                        >
                            HABITACIÓN
                        </button>

                        <button
                            className="menu-item"
                            onClick={() => {
                                setCurrent(balcon);
                                setTitle("BALCÓN");
                            }}
                        >
                            BALCÓN
                        </button>

                    </>

                )}

            </div>

            {/* ========================= */}
            {/* VISOR */}
            {/* ========================= */}

            <div className="tour360-viewer">

                <Viewer360 image={current} />

            </div>

            {/* ========================= */}
            {/* INDICADOR */}
            {/* ========================= */}

            <div className="drag-indicator">

                <div className="drag-arrows">
                    ◄────►
                </div>

                <span>
                    ARRASTRA PARA EXPLORAR
                </span>

            </div>

            {/* ========================= */}
            {/* BOTÓN VOLVER */}
            {/* ========================= */}

            <button
                className="tour360-back"
                onClick={() => setScene("apartments")}
            >
                ← VOLVER
            </button>

        </div>

    );

}