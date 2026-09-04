import { useState } from "react";

import Viewer from "../Viewer/Viewer";
import Tour360 from "../Tour360/Tour360";
import Navbar from "../Navbar/Navbar";
import Hero from "../Hero/Hero";
import ProjectsMap from "../ProjectsMap/ProjectsMap";

export default function SceneManager() {

    const [scene, setScene] = useState("home");

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <>
            {scene !== "projects" && (
                <>
                    <Viewer
                        scene={scene}
                        setScene={setScene}
                    />

                    <Tour360
                        scene={scene}
                        setScene={setScene}
                    />
                </>
            )}

            {scene === "projects" && (
                <ProjectsMap
                    setScene={setScene}
                />
            )}

            <button
                className="fullscreen-button"
                onClick={toggleFullscreen}
                title="Pantalla completa"
            >
                ⛶
            </button>

            {scene !== "home" &&
             scene !== "typeA360" &&
             scene !== "typeB360" &&
             scene !== "levels" &&
             scene !== "apartmentsOverview" &&
             scene !== "projects" && (
                <Navbar
                    scene={scene}
                    setScene={setScene}
                />
            )}

            {scene === "home" && (
                <Hero
                    onExplore={() => setScene("location")}
                />
            )}
{scene === "home" && (
    <button
        onClick={() => setScene("projects")}
        style={{
            position: "fixed",
            right: "1500px",
            bottom: "45px",
            zIndex: 2000,
            padding: "14px 28px",
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.45)",
            borderRadius: "30px",
            color: "#fff",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "14px",
            letterSpacing: "3px",
            cursor: "pointer",
            backdropFilter: "blur(12px)"
        }}
    >
        PROYECTOS
    </button>
)}
            {scene === "projects" && (
                <Navbar
                    scene={scene}
                    setScene={setScene}
                />
            )}
        </>
    );
}