import { lazy, Suspense } from "react";

import Viewer from "../Viewer/Viewer";
import Navbar from "../Navbar/Navbar";
import Hero from "../Hero/Hero";
import Fullscreen from "../Fullscreen/Fullscreen";
import LogoLoader from "../LogoLoader/LogoLoader";
import SoundToggle from "../SoundToggle/SoundToggle";
// Intro 3D: un iframe con public/intro/mystral-intro-3d.html
import IntroMapa3D from "../IntroMapa3D/IntroMapa3D";

import { SCENES } from "../../data/scenes";
import useSceneRouter from "../../lib/useSceneRouter";

// Three.js, MapLibre y el brochure se descargan sólo cuando se usan.
const Tour360 = lazy(() => import("../Tour360/Tour360"));
const ProjectsMap = lazy(() => import("../ProjectsMap/ProjectsMap"));
const Brochure = lazy(() => import("../../views/Brochure/Brochure"));
const PointCloud = lazy(() => import("../PointCloud/PointCloud"));

export default function SceneManager() {

    const { scene, room, goTo, setRoom, back } = useSceneRouter();

    const config = SCENES[scene];

    return (
        <>
            {config.kind === "intro" && (
                <IntroMapa3D goTo={goTo} />
            )}

            {(config.kind === "video" || config.kind === "image") && (
                <Viewer
                    scene={scene}
                    room={room}
                    setRoom={setRoom}
                    goTo={goTo}
                    back={back}
                />
            )}

            {/* Mientras se descarga una sección (tour 360, mapa, brochure) */}
            <Suspense fallback={<LogoLoader />}>

                {config.kind === "tour" && (
                    <Tour360
                        key={scene}
                        tourId={config.tour}
                        roomId={room}
                        onRoomChange={setRoom}
                        onBack={back}
                    />
                )}

                {config.kind === "map" && (
                    <ProjectsMap
                        goTo={goTo}
                        onBack={back}
                    />
                )}

                {config.kind === "brochure" && (
                    <Brochure onClose={back} />
                )}

                {config.kind === "pointcloud" && (
                    <PointCloud onBack={back} />
                )}

            </Suspense>

            {config.navbar && (
                <Navbar
                    scene={scene}
                    goTo={goTo}
                />
            )}

            {scene === "home" && (
                <Hero
                    onExplore={() => goTo("location")}
                    onProjects={() => goTo("projects")}
                    onMap={() => goTo("intro")}
                />
            )}

            {/* En la intro 3D no: taparía los créditos de OpenStreetMap del iframe */}
            {config.kind !== "brochure" && config.kind !== "intro" && (
                <Fullscreen raised={config.kind === "tour"} />
            )}

            {/* Siempre montado: el audio no se reinicia al cambiar de escena */}
            <SoundToggle
                placement={config.navbar ? "menu" : config.kind === "map" ? "map" : "corner"}
                track={config.sound ?? null}
            />
        </>
    );
}
