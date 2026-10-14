import { lazy, Suspense } from "react";

import Viewer from "../Viewer/Viewer";
import Navbar from "../Navbar/Navbar";
import Hero from "../Hero/Hero";
import Fullscreen from "../Fullscreen/Fullscreen";

import { SCENES } from "../../data/scenes";
import useSceneRouter from "../../lib/useSceneRouter";

// Three.js, MapLibre y el brochure se descargan sólo cuando se usan.
const Tour360 = lazy(() => import("../Tour360/Tour360"));
const ProjectsMap = lazy(() => import("../ProjectsMap/ProjectsMap"));
const Brochure = lazy(() => import("../../views/Brochure/Brochure"));

function SceneLoader() {
    return (
        <div className="scene-loader">
            <span className="scene-loader-spinner" />
        </div>
    );
}

export default function SceneManager() {

    const { scene, room, goTo, setRoom, back } = useSceneRouter();

    const config = SCENES[scene];

    return (
        <>
            {(config.kind === "video" || config.kind === "image") && (
                <Viewer
                    scene={scene}
                    goTo={goTo}
                    back={back}
                />
            )}

            <Suspense fallback={<SceneLoader />}>

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
                />
            )}

            {config.kind !== "brochure" && (
                <Fullscreen raised={config.kind === "tour"} />
            )}
        </>
    );
}
