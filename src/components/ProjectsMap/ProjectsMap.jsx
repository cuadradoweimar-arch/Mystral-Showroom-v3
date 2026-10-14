import "./ProjectsMap.css";

import { useEffect, useRef } from "react";
import {
    Map,
    NavigationControl,
    AttributionControl,
    LngLatBounds,
    Marker,
    Popup,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { PROJECTS } from "../../data/projects";

const MAP_STYLE = {
    version: 8,
    sources: {
        satellite: {
            type: "raster",
            tiles: [
                "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution:
                "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        },
    },
    layers: [
        {
            id: "satellite",
            type: "raster",
            source: "satellite",
            minzoom: 0,
            maxzoom: 19,
        },
    ],
};

function popupHtml(project) {

    const action = project.url || project.scene
        ? `<button class="project-explore-button">EXPLORAR PROYECTO →</button>`
        : "";

    return `
        <div class="project-popup">
            <div class="project-popup-label">PROYECTO</div>
            <h2>${project.name}</h2>
            <p>
                ${project.fullName ? `${project.fullName}<br />` : ""}
                ${project.city}<br />
                ${project.country}
            </p>
            ${action}
        </div>
    `;
}

export default function ProjectsMap({ goTo, onBack }) {

    const mapContainer = useRef(null);

    // goTo puede cambiar entre renders; el mapa se crea una sola vez.
    const goToRef = useRef(goTo);

    useEffect(() => {
        goToRef.current = goTo;
    }, [goTo]);

    useEffect(() => {

        // Encuadre inicial: todos los proyectos.
        const bounds = PROJECTS.reduce(
            (box, project) => box.extend(project.coordinates),
            new LngLatBounds(PROJECTS[0].coordinates, PROJECTS[0].coordinates)
        );

        const map = new Map({
            container: mapContainer.current,
            style: MAP_STYLE,
            bounds,
            fitBoundsOptions: { padding: 120, maxZoom: 12 },
            attributionControl: false,
        });

        // Abajo a la derecha queda el botón de pantalla completa.
        map.addControl(new NavigationControl(), "top-right");
        map.addControl(new AttributionControl({ compact: true }), "bottom-left");

        PROJECTS.forEach((project) => {

            const popup = new Popup({
                offset: 25,
                closeButton: true,
                closeOnClick: false,
                maxWidth: "300px",
            }).setHTML(popupHtml(project));

            const marker = new Marker({ color: "#ffffff", scale: 1.2 })
                .setLngLat(project.coordinates)
                .setPopup(popup)
                .addTo(map);

            const markerElement = marker.getElement();

            markerElement.classList.add("project-marker-with-label");
            markerElement.setAttribute("data-project-name", project.name);

            markerElement.addEventListener("click", () => {
                map.flyTo({
                    center: project.coordinates,
                    zoom: 15,
                    speed: 1.2,
                    curve: 1.4,
                    essential: true,
                });
            });

            popup.on("open", () => {

                const button = popup
                    .getElement()
                    ?.querySelector(".project-explore-button");

                if (!button) return;

                button.onclick = () => {
                    if (project.url) {
                        window.open(project.url, "_blank", "noopener");
                    } else if (project.scene) {
                        goToRef.current(project.scene);
                    }
                };
            });
        });

        return () => map.remove();

    }, []);

    return (
        <div className="projects-map">

            <div
                ref={mapContainer}
                className="projects-map-container"
            />

            <div className="projects-map-overlay">

                <div className="projects-map-title">
                    <span>MYSTRAL</span>
                    <h1>PROYECTOS</h1>
                </div>

                <button
                    className="projects-map-back"
                    onClick={onBack}
                >
                    ← VOLVER
                </button>

            </div>

        </div>
    );
}
