import "./ProjectsMap.css";

import { useEffect, useRef } from "react";
import {
    Map,
    NavigationControl,
    Marker,
    Popup,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function ProjectsMap({ setScene }) {
    const mapContainer = useRef(null);
    const map = useRef(null);

    const projects = [
    {
        name: "MYSTRAL",
        city: "Montería",
        country: "Colombia",
        coordinates: [-75.871683, 8.780019],
        scene: "home",
    },
    {
        name: "ARENA",
        city: "Coveñas",
        country: "Colombia",
        coordinates: [-75.663596, 9.410074],
        scene: null,
    },
    {
        name: "LA MAR",
        city: "Coveñas",
        country: "Colombia",
        coordinates: [-75.663983, 9.409490],
        scene: null,
    },
    {
        name: "IUC",
        fullName: "Instituto Universitario de Córdoba",
        city: "Montería",
        country: "Colombia",
        coordinates: [-75.864421, 8.788177],
        scene: null,
    },
    {
        name: "RIVIERA",
        city: "Montería",
        country: "Colombia",
        coordinates: [-75.869249, 8.786343],
        scene: null,
    },
];

    useEffect(() => {
        if (map.current) return;

        map.current = new Map({
            container: mapContainer.current,

            style: {
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
            },

            center: [-74, 4],
            zoom: 1.5,
        });

        map.current.addControl(
            new NavigationControl(),
            "bottom-right"
        );

        map.current.on("load", () => {
            projects.forEach((project) => {
                const popup = new Popup({
                    offset: 25,
                    closeButton: true,
                    closeOnClick: false,
                    maxWidth: "300px",
                }).setHTML(`
                    <div class="project-popup">

                        <div class="project-popup-label">
                            PROYECTO
                        </div>

                        <h2>${project.name}</h2>

                        <p>
                            ${
                                project.fullName
                                    ? `${project.fullName}<br />`
                                    : ""
                            }
                            ${project.city}<br />
                            ${project.country}
                        </p>

                        ${
                            project.scene
                                ? `
                                    <button
                                        class="project-explore-button"
                                        data-project="${project.name}"
                                    >
                                        EXPLORAR PROYECTO →
                                    </button>
                                `
                                : `
                                    <div class="project-coming-soon">
                                        
                                    </div>
                                `
                        }

                    </div>
                `);

                const marker = new Marker({
                    color: "#ffffff",
                    scale: 1.2,
                })
                    .setLngLat(project.coordinates)
                    .setPopup(popup)
                    .addTo(map.current);

                const markerElement = marker.getElement();

                markerElement.classList.add(
                    "project-marker-with-label"
                );

                markerElement.setAttribute(
                    "data-project-name",
                    project.name
                );

                markerElement.setAttribute(
                    "data-label-position",
                    project.labelPosition
                );

                markerElement.addEventListener("click", () => {
                    map.current.flyTo({
                        center: project.coordinates,
                        zoom: 15,
                        speed: 1.2,
                        curve: 1.4,
                        essential: true,
                    });
                });

                popup.on("open", () => {
                    const button = document.querySelector(
                        `.project-explore-button[data-project="${project.name}"]`
                    );

                    if (button && project.scene) {
                        button.onclick = () => {
                            setScene(project.scene);
                        };
                    }
                });
            });
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [setScene]);

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
                    onClick={() => setScene("home")}
                >
                    ← VOLVER
                </button>

            </div>

        </div>
    );
}