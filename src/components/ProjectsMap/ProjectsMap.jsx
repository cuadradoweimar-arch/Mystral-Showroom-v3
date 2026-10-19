import "./ProjectsMap.css";

import { useEffect, useRef, useState } from "react";
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
        // Nombres de países, departamentos y ciudades + límites
        // (transparente, va encima del satélite)
        places: {
            type: "raster",
            tiles: [
                "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution: "Esri, HERE, Garmin",
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
        {
            id: "places",
            type: "raster",
            source: "places",
            minzoom: 0,
            maxzoom: 19,
        },
    ],
};

// Ciudades con proyectos, en el orden de la lista
const CITIES = [...new Set(PROJECTS.map((project) => project.city))];

function boundsOf(projects) {
    return projects.reduce(
        (box, project) => box.extend(project.coordinates),
        new LngLatBounds(projects[0].coordinates, projects[0].coordinates)
    );
}

function popupHtml(project) {

    const action = project.url || project.scene
        ? `<button class="project-explore-button">EXPLORAR PROYECTO →</button>`
        : "";
    const info = `
        <div class="project-popup-label">PROYECTO</div>
        <h2>${project.name}</h2>
        <p>
            ${project.fullName ? `${project.fullName}<br />` : ""}
            ${project.city}<br />
            ${project.country}
        </p>
    `;

    // Con foto: la tarjeta ES la foto; la información y el
    // botón van encima de la imagen
    if (project.image) {
        return `
            <div class="project-popup has-image">
                <div class="project-popup-media">
                    <img class="project-popup-image" src="${project.image}" alt="${project.name}" />
                    <div class="project-popup-info">
                        ${info}
                        ${action}
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="project-popup">
            ${info}
            ${action}
        </div>
    `;
}

export default function ProjectsMap({ goTo, onBack }) {

    const mapContainer = useRef(null);
    const mapRef = useRef(null);

    // Ciudad elegida en el selector (null = todos los proyectos)
    const [city, setCity] = useState(null);

    const showCity = (name) => {

        setCity(name);

        const map = mapRef.current;
        if (!map) return;

        const projects = name ? PROJECTS.filter((p) => p.city === name) : PROJECTS;

        map.fitBounds(boundsOf(projects), {
            padding: name ? 140 : 120,
            maxZoom: name ? 15 : 12,
            duration: 1800,
            essential: true,
        });
    };

    // goTo puede cambiar entre renders; el mapa se crea una sola vez.
    const goToRef = useRef(goTo);

    useEffect(() => {
        goToRef.current = goTo;
    }, [goTo]);

    useEffect(() => {

        // Encuadre inicial: todos los proyectos.
        const map = new Map({
            container: mapContainer.current,
            style: MAP_STYLE,
            bounds: boundsOf(PROJECTS),
            fitBoundsOptions: { padding: 120, maxZoom: 12 },
            attributionControl: false,
        });

        mapRef.current = map;

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

        return () => {
            mapRef.current = null;
            map.remove();
        };

    }, []);

    return (
        <div className="projects-map">

            <div
                ref={mapContainer}
                className="projects-map-container"
            />

            <div className="projects-map-overlay">

                <div className="projects-map-title">
                    <span>INARQCO</span>
                    <h1>PROYECTOS</h1>
                </div>

                {/* Selector de ciudad: lleva el mapa a sus proyectos */}
                <nav className="projects-map-cities" aria-label="Ciudades">

                    {[null, ...CITIES].map((name) => (
                        <button
                            key={name ?? "todos"}
                            className={city === name ? "active" : ""}
                            aria-pressed={city === name}
                            onClick={() => showCity(name)}
                        >
                            {name ?? "Todos"}
                        </button>
                    ))}

                </nav>

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
