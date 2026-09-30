import "./Viewer.css";

import { useState, useEffect } from "react";

import Transition from "../Transition/Transition";
import Viewer360 from "../Tour360/Viewer360";

import hero from "../../assets/images/home/hero.jpg";
import project from "../../assets/images/project/project.png";
import inicio from "../../assets/images/location/inicio.jpg";
import levelsSvg from "../../assets/images/levels/niveles.svg?raw";

import homeLoop from "../../assets/videos/home-loop.mp4";
import galleryVideo from "../../assets/videos/fachada-trasera.mp4";
import galleryTransitionVideo from "../../assets/videos/atras a frente.mp4";
import locationVideo from "../../assets/videos/ubicacion.MP4";
import ingresoVideo from "../../assets/videos/ingreso.mp4";

import callePanorama from "../../assets/panoramas/ingreso/calle.png";

import apartment from "../../assets/images/apartments/apartment-01.jpg";
import levels from "../../assets/images/levels/levels.png";
import apartmentsOverview from "../../assets/images/apartments/apartments-overview.png";

import Brochure from "../../views/Brochure/Brochure";


export default function Viewer({ scene, setScene }) {

    const [panelOpen, setPanelOpen] = useState(false);

    const [selectedLevel, setSelectedLevel] = useState(null);

    const [isGalleryTransitioning, setIsGalleryTransitioning] =
        useState(false);

    const [showIngresoPanorama, setShowIngresoPanorama] =
        useState(false);


    // =====================================================
    // LIMPIAR ESTADOS AL CAMBIAR DE ESCENA
    // =====================================================

    useEffect(() => {

        if (scene === "levels" || scene === "apartmentsOverview") {
            setPanelOpen(false);
        }

        // Si salimos de gallery, apagamos la transición.
        if (scene !== "gallery") {
            setIsGalleryTransitioning(false);
        }

        // Si salimos de ingreso, cerramos el panorama.
        if (scene !== "ingreso") {
            setShowIngresoPanorama(false);
        }

    }, [scene]);


    // =====================================================
    // OCULTAR VIEWER CUANDO SE ABRE EL TOUR 360
    // =====================================================

    if (scene === "typeA360" || scene === "typeB360") {
        return null;
    }


    // =====================================================
    // MOSTRAR ÚNICAMENTE EL BROCHURE
    // =====================================================

    if (scene === "brochure") {
        return <Brochure setScene={setScene} />;
    }


    // =====================================================
    // IMÁGENES DE LAS ESCENAS
    // =====================================================

    const sceneImages = {

        home: hero,

        project: project,

        gallery: null,

        apartments: apartment,

        apartmentsOverview: apartmentsOverview,

        levels: levels,

        location: inicio,

    };


    /*
    =====================================================
    FUNCIÓN DE LA FLECHA DE VER DISPONIBLE
    =====================================================
    */

    const handleGalleryArrow = () => {

        // Evita hacer clic varias veces mientras
        // el video ya se está reproduciendo.
        if (isGalleryTransitioning) return;


        // Quitamos cualquier nivel seleccionado.
        setSelectedLevel(null);


        // Activamos el video "atras a frente.mp4".
        setIsGalleryTransitioning(true);

    };


    /*
    =====================================================
    CUANDO TERMINA EL VIDEO "ATRAS A FRENTE"
    =====================================================
    */

    const handleVideoEnded = () => {

        // Video de ubicación
        if (scene === "location") {

            setScene("gallery");

            return;
        }


        // Video especial de la flecha:
        // al terminar vamos automáticamente a INGRESO.
        if (scene === "gallery" && isGalleryTransitioning) {

            setIsGalleryTransitioning(false);

            setScene("ingreso");
        }

    };


    /*
    =====================================================
    ABRIR PANORAMA 360 DEL INGRESO
    =====================================================
    */

    const handleOpenIngresoPanorama = () => {

        setShowIngresoPanorama(true);

    };


    /*
    =====================================================
    CERRAR PANORAMA 360 DEL INGRESO
    =====================================================
    */

    const handleCloseIngresoPanorama = () => {

        setShowIngresoPanorama(false);

    };


    return (

        <div className="viewer">


            {/* =====================================
                    TRANSICIÓN CINEMATOGRÁFICA
                ====================================== */}

            <Transition scene={scene}>


                {/* =====================================
                        ESCENAS CON VIDEO
                    ====================================== */}

                {scene === "home" ||
                scene === "ingreso" ||
                scene === "gallery" ||
                scene === "location" ? (


                    <div className="layer active">


                        <video

                            key={
                                scene === "gallery" &&
                                isGalleryTransitioning
                                    ? "gallery-transition"
                                    : scene
                            }

                            className="layer-video"

                            src={

                                scene === "home"

                                    ? homeLoop

                                    : scene === "ingreso"

                                        ? ingresoVideo

                                        : scene === "gallery"

                                            ? isGalleryTransitioning

                                                ? galleryTransitionVideo

                                                : galleryVideo

                                            : locationVideo

                            }

                            autoPlay

                            loop={
                                scene === "home" ||
                                (
                                    scene === "gallery" &&
                                    !isGalleryTransitioning
                                )
                            }

                            muted

                            playsInline

                            preload="auto"

                            onEnded={handleVideoEnded}

                        />


                        {/* =====================================
                                OVERLAY DE NIVELES

                                SOLO EN FACHADA TRASERA

                                NO APARECE MIENTRAS SE
                                REPRODUCE EL VIDEO DE TRANSICIÓN
                            ====================================== */}

                        {scene === "gallery" &&
                            !isGalleryTransitioning && (

                                <div

                                    className="levels-overlay"

                                    onClick={(e) => {

                                        const path =
                                            e.target.closest("path");

                                        if (!path) return;


                                        const paths = Array.from(

                                            e.currentTarget.querySelectorAll(
                                                "path"
                                            )

                                        );


                                        const index =
                                            paths.indexOf(path);


                                        paths.forEach((item) => {

                                            item.classList.remove(
                                                "selected"
                                            );

                                        });


                                        path.classList.add("selected");


                                        setSelectedLevel(index);

                                    }}

                                    dangerouslySetInnerHTML={{
                                        __html: levelsSvg
                                    }}

                                />

                            )}


                    </div>


                ) : (


                    /* =====================================
                            ESCENAS CON IMAGEN
                        ====================================== */

                    <div className="layer active">


                        <div

                            className="background-image"

                            style={{

                                backgroundImage:

                                    sceneImages[scene]

                                        ? `url(${sceneImages[scene]})`

                                        : "none",

                            }}

                        />


                    </div>

                )}


            </Transition>


            {/* =====================================
                    HOTSPOT DEL INGRESO

                    SOLO APARECE EN INGRESO

                    AL HACER CLICK:
                    ABRE EL PANORAMA 360
                ====================================== */}

            {scene === "ingreso" &&
                !showIngresoPanorama && (

                    <button

                        className="ingreso-hotspot"

                        aria-label="Explorar ingreso"

                        onClick={handleOpenIngresoPanorama}

                    >

                        <span className="ingreso-hotspot-dot"></span>

                    </button>

                )}


            {/* =====================================
                    PANORAMA 360 DEL INGRESO
                ====================================== */}

            {scene === "ingreso" &&
                showIngresoPanorama && (

                    <div className="ingreso-panorama-overlay">


                        <div className="ingreso-panorama-viewer">

                           <Viewer360
    image={callePanorama}
    hotspots={[
        {
            type: "arrow",
            position: [-3, -1.2, 0],
            label: "INGRESO",
            onClick: () => {
                console.log("Hotspot de ingreso");
            }
        }
    ]}
/>

                        </div>


                        {/* BOTÓN CERRAR */}

                        <button

                            className="ingreso-panorama-close"

                            aria-label="Cerrar panorama"

                            onClick={handleCloseIngresoPanorama}

                        >

                            ×

                        </button>


                        {/* TÍTULO */}

                        <div className="ingreso-panorama-title">

                            INGRESO

                        </div>


                    </div>

                )}


            {/* =====================================
                    FLECHA DE VER DISPONIBLE

                    SOLO EN GALLERY

                    AL HACER CLICK:

                    atras a frente.mp4
                    ↓
                    INGRESO
                ====================================== */}

            {scene === "gallery" &&
                !isGalleryTransitioning && (

                    <button

                        className="facade-arrow"

                        aria-label="Continuar hacia ingreso"

                        onClick={handleGalleryArrow}

                    >

                        ‹

                    </button>

                )}


            {/* =====================================
                    TARJETA DEL NIVEL SELECCIONADO
                ====================================== */}

            {selectedLevel !== null &&
                scene === "gallery" &&
                !isGalleryTransitioning && (


                    <div className="level-card">


                        <button

                            className="level-card-close"

                            onClick={() =>
                                setSelectedLevel(null)
                            }

                        >

                            ×

                        </button>


                        <span className="level-card-label">

                            NIVEL

                        </span>


                        <h2>

                            {selectedLevel + 1}

                        </h2>


                        <p>

                            Información del apartamento

                        </p>


                        <strong>

                            Disponible

                        </strong>


                    </div>

                )}


            {/* =====================================
                    PANEL EXPLORAR
                ====================================== */}

            {(scene === "levels" ||
                scene === "apartmentsOverview") && (


                <>


                    <aside

                        className={`explorer-panel ${
                            panelOpen
                                ? "open"
                                : "closed"
                        }`}

                    >


                        <div className="explorer-header">

                            <span>NIVELES</span>

                        </div>


                        <div className="explorer-content">


                            <button className="explorer-item active">

                                <span className="indicator"></span>

                                TERRAZA

                            </button>


                            <button className="explorer-item">

                                <span className="indicator"></span>

                                DÚPLEX 10-11

                            </button>


                            <button className="explorer-item">

                                <span className="indicator"></span>

                                PENTHOUSE 9

                            </button>


                            <button

                                className="explorer-item"

                                onClick={() =>
                                    setScene(
                                        "apartmentsOverview"
                                    )
                                }

                            >

                                <span className="indicator"></span>


                                <span className="explorer-text">

                                    APARTAMENTOS

                                    <small>3–8</small>

                                </span>

                            </button>


                            <button className="explorer-item">

                                <span className="indicator"></span>

                                PARQUEADERO 2

                            </button>


                        </div>


                    </aside>


                    <button

                        className={`explorer-toggle ${
                            panelOpen ? "open" : ""
                        }`}

                        onClick={() =>
                            setPanelOpen(!panelOpen)
                        }

                        aria-label={

                            panelOpen

                                ? "Cerrar panel"

                                : "Abrir panel"

                        }

                    >

                        {panelOpen ? "→" : "←"}

                    </button>


                </>

            )}


            {/* =====================================
                    TARJETAS APARTAMENTOS
                ====================================== */}

            {scene === "apartments" && (


                <div className="apartment-selector">


                    <div className="apartment-card">


                        <h2>

                            TIPO A

                        </h2>


                        <span>

                            220.30 m²

                        </span>


                        <button

                            onClick={() =>
                                setScene("typeA360")
                            }

                        >

                            ENTRAR →

                        </button>


                    </div>


                    <div className="apartment-card duplex-card">


                        <div className="duplex-badge"></div>


                        <h2>

                            DÚPLEX

                        </h2>


                        <span>

                            420.60 m²

                        </span>


                        <p>

                            Dos niveles • Terraza privada

                        </p>


                        <button

                            className="duplex-button"

                            onClick={() =>
                                setScene("duplex")
                            }

                        >

                            EXPLORAR →

                        </button>


                    </div>


                    <div className="apartment-card">


                        <h2>

                            TIPO B

                        </h2>


                        <span>

                            214.22 m²

                        </span>


                        <button

                            onClick={() =>
                                setScene("typeB360")
                            }

                        >

                            ENTRAR →

                        </button>


                    </div>


                </div>

            )}


            {/* =====================================
                    BOTÓN VOLVER
                ====================================== */}

            {scene !== "home" && !showIngresoPanorama && (


                <button

                    className="back-button"

                    onClick={() => {

                        setIsGalleryTransitioning(false);

                        setSelectedLevel(null);

                        setShowIngresoPanorama(false);

                        setScene("home");

                    }}

                >

                    ← VOLVER

                </button>


            )}


        </div>

    );

}