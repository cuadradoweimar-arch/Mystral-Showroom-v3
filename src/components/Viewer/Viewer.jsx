import "./Viewer.css";

import { useState, useEffect } from "react";
import Transition from "../Transition/Transition";

import hero from "../../assets/images/home/hero.jpg";
import project from "../../assets/images/project/project.png";
import inicio from "../../assets/images/location/inicio.jpg";
import galleryVideo from "../../assets/videos/fachada-trasera.mp4";
import apartment from "../../assets/images/apartments/apartment-01.jpg";
import levels from "../../assets/images/levels/levels.png";
import apartmentsOverview from "../../assets/images/apartments/apartments-overview.png";
import Brochure from "../../views/Brochure/Brochure";

export default function Viewer({ scene, setScene }) {

    const [panelOpen, setPanelOpen] = useState(false);

    useEffect(() => {
        // Al entrar en las pantallas de niveles, el panel debe iniciar oculto
        if (scene === "levels" || scene === "apartmentsOverview") {
            setPanelOpen(false);
        }
    }, [scene]);
    // Ocultar Viewer cuando se abre el Tour 360
if (scene === "typeA360" || scene === "typeB360") {
    return null;
}

// Mostrar únicamente el brochure
if (scene === "brochure") {
    return <Brochure setScene={setScene} />;
}

    const sceneImages = {

    home: hero,

    project: project,

    gallery: null,

    apartments: apartment,

    apartmentsOverview: apartmentsOverview,

    levels: levels,

    location: inicio,

};

    return (

        <div className="viewer">
            

            {/* ===========================
                TRANSICIÓN CINEMATOGRÁFICA
            ============================ */}

            <Transition scene={scene}>

                {scene === "gallery" ? (

    <div className="layer active">

        <video
            className="layer-video"
            src={galleryVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
        />

    {/* Hotspots eliminados */}

    </div>

) : (

                    <div className="layer active">

    <div
        className="background-image"
        style={{
            backgroundImage: sceneImages[scene]
                ? `url(${sceneImages[scene]})`
                : "none"
        }}
    />


</div>

                )}

            </Transition>

            {/* =====================================
                    PANEL EXPLORAR
            ====================================== */}

            {(scene === "levels" || scene === "apartmentsOverview") && (

                <>

                    <aside className={`explorer-panel ${panelOpen ? "open" : "closed"}`}>

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
                                onClick={() => setScene("apartmentsOverview")}
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
                        className={`explorer-toggle ${panelOpen ? "open" : ""}`}
                        onClick={() => setPanelOpen(!panelOpen)}
                        aria-label={panelOpen ? "Cerrar panel" : "Abrir panel"}
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

                        <h2>TIPO A</h2>

                        <span>220.30 m²</span>

                        <button
                            onClick={() => setScene("typeA360")}
                        >
                            ENTRAR →
                        </button>

                    </div>

                    <div className="apartment-card duplex-card">

                        <div className="duplex-badge"></div>

                        <h2>DÚPLEX</h2>

                        <span>420.60 m²</span>


                        <p>Dos niveles • Terraza privada</p>

                        <button
                            className="duplex-button"
                            onClick={() => setScene("duplex")}
                        >
                            EXPLORAR →
                        </button>

                    </div>

                    <div className="apartment-card">

                        <h2>TIPO B</h2>

                        <span>214.22 m²</span>

                        <button
                            onClick={() => setScene("typeB360")}
                        >
                            ENTRAR →
                        </button>

                    </div>

                </div>

            )}

            {/* =====================================
                    BOTÓN VOLVER
            ====================================== */}

            {scene !== "home" && (

                <button
                    className="back-button"
                    onClick={() => setScene("home")}
                >

                    ← VOLVER

                </button>

            )}

        </div>

    );

}