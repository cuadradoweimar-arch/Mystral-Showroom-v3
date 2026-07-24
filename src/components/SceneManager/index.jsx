import { useState } from "react";

import Viewer from "../Viewer/Viewer";
import Tour360 from "../Tour360/Tour360";
import Navbar from "../Navbar/Navbar";
import Hero from "../Hero/Hero";

export default function SceneManager() {

    const [scene, setScene] = useState("home");

    // =========================
    // Pantalla completa
    // =========================
    const toggleFullscreen = () => {

        if (!document.fullscreenElement) {

            document.documentElement.requestFullscreen();

        } else {

            document.exitFullscreen();

        }

    };

    return (
        <>
            <Viewer
                scene={scene}
                setScene={setScene}
            />

            <Tour360
                scene={scene}
                setScene={setScene}
            />
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
 scene !== "apartmentsOverview" && (
    <Navbar
        scene={scene}
        setScene={setScene}
    />
)}

            {/* Hero únicamente en la pantalla inicial */}
            {scene === "home" && (
                <Hero
                    onExplore={() => setScene("location")}
                />
            )}
        </>
    );

}