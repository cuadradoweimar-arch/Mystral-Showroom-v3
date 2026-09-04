import { useState, useEffect } from "react";

import "./Tour360.css";
import Viewer360, { preloadPanoramas } from "./Viewer360";

// ======================
// TERRAZA
// ======================

import terraza from "../../assets/panoramas/terraza/terraza.jpg";
import terraza2 from "../../assets/panoramas/terraza/terraza2.jpg";

// ======================
// TIPO A
// ======================

import sala from "../../assets/panoramas/tipo-a/sala.jpg";
import cocina from "../../assets/panoramas/tipo-a/cocina.jpg";
import habitacion from "../../assets/panoramas/tipo-a/habitacion.png";
import balcon from "../../assets/panoramas/tipo-a/balcon.jpg";
import habitacion2 from "../../assets/panoramas/tipo-a/habitacion2.png";
import wc2 from "../../assets/panoramas/tipo-a/wc2.png";
import wc1 from "../../assets/panoramas/tipo-a/wc1.png";
import estarAlcobas from "../../assets/panoramas/tipo-a/estar de alcobas.png";
import habitacion3 from "../../assets/panoramas/tipo-a/habitacion 3a.jpg";
import bano3 from "../../assets/panoramas/tipo-a/baño 3a.jpg";

// ======================
// TIPO B
// ======================

import salaB from "../../assets/panoramas/tipo-b/sala.png";
import comedorB from "../../assets/panoramas/tipo-b/comedor.png";
import cocinaB from "../../assets/panoramas/tipo-b/cocina.png";
import habitacionB from "../../assets/panoramas/tipo-b/habitacion.png";
import balconB from "../../assets/panoramas/tipo-b/balcon.png";
import balconB2 from "../../assets/panoramas/tipo-b/balcon1.png";
import bano1B from "../../assets/panoramas/tipo-b/baño 1b.jpg";
import bano2B from "../../assets/panoramas/tipo-b/baño 2b.jpg";
import bano3B from "../../assets/panoramas/tipo-b/baño 3b.jpg";
import habitacion2B from "../../assets/panoramas/tipo-b/habitacion 2B.jpg";
import habitacion3B from "../../assets/panoramas/tipo-b/habitacion 3B.jpg";

// ======================
// DÚPLEX
// ======================

import PM1 from "../../assets/panoramas/duplex/Entrada.png";
import PM3 from "../../assets/panoramas/duplex/Comedor.png";
import PM5 from "../../assets/panoramas/duplex/Muebles.png";
import PM6 from "../../assets/panoramas/duplex/Sala1.png";
import PM7 from "../../assets/panoramas/duplex/Balcon.png";
import PM21 from "../../assets/panoramas/duplex/Sala Estar.png";

// ======================
// LISTAS DE PRECARGA
// ======================

const panoramasTerraza = [
    terraza,
    terraza2
];

const panoramasTipoA = [
    sala,
    cocina,
    estarAlcobas,
    habitacion,
    balconB2,
    wc1,
    habitacion2,
    wc2,
    habitacion3,
    bano3,
    balcon
];

const panoramasTipoB = [
    salaB,
    comedorB,
    cocinaB,
    habitacionB,
    balconB2,
    bano1B,
    habitacion2B,
    bano2B,
    habitacion3B,
    bano3B,
    balconB
];

const panoramasDuplex = [
    PM1,
    PM3,
    PM5,
    PM6,
    PM7,
    PM21
];

export default function Tour360({ scene, setScene }) {

    const [current, setCurrent] = useState(sala);
    const [title, setTitle] = useState("SALA");

    const isTerraza = scene === "project";
    const isDuplex = scene === "duplex";
    const isTypeB = scene === "typeB360";

    // =========================================================
    // PRECARGA DE PANORAMAS
    // =========================================================

    useEffect(() => {

        if (scene === "project") {
            preloadPanoramas(panoramasTerraza);
        }

        else if (scene === "typeA360") {
            preloadPanoramas(panoramasTipoA);
        }

        else if (scene === "typeB360") {
            preloadPanoramas(panoramasTipoB);
        }

        else if (scene === "duplex") {
            preloadPanoramas(panoramasDuplex);
        }

    }, [scene]);

    // =========================================================
    // PANORAMA INICIAL
    // =========================================================

    useEffect(() => {

        if (scene === "project") {

            setCurrent(terraza);
            setTitle("TERRAZA");

        }

        else if (scene === "duplex") {

            setCurrent(PM1);
            setTitle("ENTRADA");

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

    // =========================================================
    // HOTSPOTS
    // =========================================================

    const hotspots = [];

    // =========================================================
    // TERRAZA → TERRAZA 2
    // =========================================================

    if (scene === "project" && current === terraza) {

        hotspots.push({
            position: [-3.0, -2.2, -0.05],
            label: "TERRAZA 2",
            onClick: () => {
                setCurrent(terraza2);
                setTitle("TERRAZA 2");
            }
        });

    }

    // =========================================================
    // TERRAZA 2 → TERRAZA
    // =========================================================

    if (scene === "project" && title === "TERRAZA 2") {

        hotspots.push({
            position: [-2, -2, -0.01],
            label: "TERRAZA",
            onClick: () => {
                setCurrent(terraza);
                setTitle("TERRAZA");
            }
        });

    }

    // =========================================================
    // TIPO A
    // =========================================================

    // ---------------------------------------------------------
    // SALA → COCINA
    // ---------------------------------------------------------

    if (scene === "typeA360" && current === sala) {

        hotspots.push({
            position: [-4.5, -2.0, 3],
            label: "COCINA",
            onClick: () => {
                setCurrent(cocina);
                setTitle("COCINA");
            }
        });

    }

    // ---------------------------------------------------------
    // COCINA → SALA
    // ---------------------------------------------------------

    if (scene === "typeA360" && current === cocina) {

        hotspots.push({
            position: [-5, -1.5, 1],
            label: "SALA",
            onClick: () => {
                setCurrent(sala);
                setTitle("SALA");
            }
        });

    }
    // ---------------------------------------------------------
// COCINA → ESTAR DE ALCOBAS
// ---------------------------------------------------------

if (scene === "typeA360" && current === cocina) {

    hotspots.push({
        position: [0.05, -2.0, -6],
        label: "ESTAR DE ALCOBAS",
        onClick: () => {
            setCurrent(estarAlcobas);
            setTitle("ESTAR DE ALCOBAS");
        }
    });

}
// ---------------------------------------------------------
// ESTAR DE ALCOBAS → COCINA
// ---------------------------------------------------------

if (scene === "typeA360" && current === estarAlcobas) {

    hotspots.push({
        position: [1.0, -2.0, 0.5],
        label: "COCINA",
        onClick: () => {
            setCurrent(cocina);
            setTitle("COCINA");
        }
    });

}
// ---------------------------------------------------------
// ESTAR DE ALCOBAS → HABITACIÓN 2
// ---------------------------------------------------------

if (scene === "typeA360" && current === estarAlcobas) {

    hotspots.push({
        position: [-6.0, -2.0, -0.05],
        label: "HABITACIÓN 2",
        onClick: () => {
            setCurrent(habitacion2);
            setTitle("HABITACIÓN 2");
        }
    });

}
// ---------------------------------------------------------
// HABITACIÓN 2 → BAÑO 2
// ---------------------------------------------------------

if (scene === "typeA360" && current === habitacion2) {

    hotspots.push({
        position: [-6.0, -2.0, 0.1],
        label: "BAÑO 2",
        onClick: () => {
            setCurrent(wc2);
            setTitle("BAÑO 2");
        }
    });

}
// ---------------------------------------------------------
// SALA → BALCÓN
// ---------------------------------------------------------

if (scene === "typeA360" && current === sala) {

    hotspots.push({
        position: [5, -3.0, -3],
        label: "BAL4ÓN",
        onClick: () => {
            setCurrent(balcon);
            setTitle("BALCÓN");
        }
    });

    
}
// ---------------------------------------------------------
// BALCÓN → SALA
// ---------------------------------------------------------

if (scene === "typeA360" && current === balcon) {

    hotspots.push({
        position: [3.0, -2.0, 0.5],
        label: "SALA",
        onClick: () => {
            setCurrent(sala);
            setTitle("SALA");
        }
    });

}
    // =========================================================
    // MOSTRAR TOUR 360
    // =========================================================

    if (
        scene !== "project" &&
        scene !== "typeA360" &&
        scene !== "typeB360" &&
        scene !== "duplex"
    ) {
        return null;
    }

    return (

        <div className="tour360">

            {/* =========================
                INFORMACIÓN
            ========================== */}

            <div className="panorama-info">

                <span className="panorama-apartment">

                    {isTerraza
                        ? "MYSTRAL"
                        : isDuplex
                        ? "Apartamento Dúplex"
                        : isTypeB
                        ? "Apartamento Tipo B"
                        : "Apartamento Tipo A"}

                </span>

                <h2 className="panorama-title">
                    {title}
                </h2>

            </div>

            {/* =========================
                MENÚ
            ========================== */}

            {!isTerraza && (

                <div className="tour360-menu">

                    {isDuplex ? (

                        <>
                            <button
                                onClick={() => {
                                    setCurrent(PM1);
                                    setTitle("ENTRADA");
                                }}
                                className="menu-item"
                            >
                                ENTRADA
                            </button>

                            <button
                                onClick={() => {
                                    setCurrent(PM3);
                                    setTitle("COMEDOR");
                                }}
                                className="menu-item"
                            >
                                COMEDOR
                            </button>

                            <button
                                onClick={() => {
                                    setCurrent(PM5);
                                    setTitle("MUEBLES");
                                }}
                                className="menu-item"
                            >
                                MUEBLES
                            </button>

                            <button
                                onClick={() => {
                                    setCurrent(PM6);
                                    setTitle("SALA");
                                }}
                                className="menu-item"
                            >
                                SALA
                            </button>

                            <button
                                onClick={() => {
                                    setCurrent(PM7);
                                    setTitle("BALCÓN");
                                }}
                                className="menu-item"
                            >
                                BALCÓN
                            </button>

                            <button
                                onClick={() => {
                                    setCurrent(PM21);
                                    setTitle("SALA DE ESTAR");
                                }}
                                className="menu-item"
                            >
                                SALA DE ESTAR
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
                                    setCurrent(balconB2);
                                    setTitle("BALCÓN 1");
                                }}
                            >
                                BALCÓN 1
                            </button>

                            <button
                                className="menu-item"
                                onClick={() => {
                                    setCurrent(bano1B);
                                    setTitle("BAÑO 1");
                                }}
                            >
                                BAÑO 1
                            </button>

                            <button
                                className="menu-item"
                                onClick={() => {
                                    setCurrent(habitacion2B);
                                    setTitle("HABITACIÓN 2");
                                }}
                            >
                                HABITACIÓN 2
                            </button>

                            <button
                                className="menu-item"
                                onClick={() => {
                                    setCurrent(bano2B);
                                    setTitle("BAÑO 2");
                                }}
                            >
                                BAÑO 2
                            </button>

                            <button
                                className="menu-item"
                                onClick={() => {
                                    setCurrent(habitacion3B);
                                    setTitle("HABITACIÓN 3");
                                }}
                            >
                                HABITACIÓN 3
                            </button>

                            <button
                                className="menu-item"
                                onClick={() => {
                                    setCurrent(bano3B);
                                    setTitle("BAÑO 3");
                                }}
                            >
                                BAÑO 3
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
                                    setCurrent(estarAlcobas);
                                    setTitle("ESTAR DE ALCOBAS");
                                }}
                            >
                                ESTAR DE ALCOBAS
                            </button>

                            <button
                                className="menu-item"
                                onClick={() => {
                                    setCurrent(habitacion);
                                    setTitle("HABITACIÓN PRINCIPAL");
                                }}
                            >
                                HABITACIÓN PRINCIPAL
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

                            <button
                                className="menu-item"
                                onClick={() => {
                                    setCurrent(wc1);
                                    setTitle("BAÑO 1");
                                }}
                            >
                                BAÑO 1
                            </button>

                            <button
                                className="menu-item"
                                onClick={() => {
                                    setCurrent(habitacion2);
                                    setTitle("HABITACIÓN 2");
                                }}
                            >
                                HABITACIÓN 2
                            </button>

                            <button
                                className="menu-item"
                                onClick={() => {
                                    setCurrent(wc2);
                                    setTitle("BAÑO 2");
                                }}
                            >
                                BAÑO 2
                            </button>

                            <button
                                className="menu-item"
                                onClick={() => {
                                    setCurrent(habitacion3);
                                    setTitle("HABITACIÓN 3");
                                }}
                            >
                                HABITACIÓN 3
                            </button>

                            <button
                                className="menu-item"
                                onClick={() => {
                                    setCurrent(bano3);
                                    setTitle("BAÑO 3");
                                }}
                            >
                                BAÑO 3
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

            )}

            {/* =========================
                VISOR 360
            ========================== */}

            <div className="tour360-viewer">

                <Viewer360
                    image={current}
                    hotspots={hotspots}
                />

            </div>

            {/* =========================
                INDICADOR
            ========================== */}

            <div className="drag-indicator">

                <div className="drag-arrows">
                    ◄────►
                </div>

                <span>
                    ARRASTRA PARA EXPLORAR
                </span>

            </div>

            {/* =========================
                BOTÓN VOLVER
            ========================== */}

            <button
                className="tour360-back"
                onClick={() => setScene("apartments")}
            >
                ← VOLVER
            </button>

            {/* =========================
                PANTALLA COMPLETA
            ========================== */}

            <button
                className="tour360-fullscreen"
                onClick={() => {

                    if (!document.fullscreenElement) {

                        document.documentElement.requestFullscreen();

                    } else {

                        document.exitFullscreen();

                    }

                }}
            >
                ⛶
            </button>

        </div>

    );
}