import "./Tour360.css";

import { useEffect, useRef } from "react";

import Viewer360 from "./Viewer360";
import { TOURS } from "../../data/tours";
import { panoramaUrl } from "../../lib/media";

export default function Tour360({ tourId, roomId, onRoomChange, onBack }) {

    const tour = TOURS[tourId];

    const findRoom = (id) => tour.rooms.find((room) => room.id === id);

    // Habitación de la URL o, si no existe, la primera del recorrido.
    const room = findRoom(roomId) ?? tour.rooms[0];

    const showMenu = tour.menu !== false && tour.rooms.length > 1;

    // En móvil el menú es una franja horizontal: la habitación
    // activa se desplaza a la vista.
    const menuRef = useRef(null);

    useEffect(() => {
        menuRef.current
            ?.querySelector(".menu-item.active")
            ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }, [room.id]);

    // =========================================================
    // HOTSPOTS
    // =========================================================

    const hotspots = (room.hotspots ?? []).map((hotspot) => {

        const target = hotspot.to ? findRoom(hotspot.to) : null;

        return {
            key: hotspot.to ?? "back",
            position: hotspot.position,
            label: hotspot.label ?? target?.title ?? "",
            onClick: hotspot.back ? onBack : () => onRoomChange(target.id),
        };
    });

    const neighbors = (room.hotspots ?? [])
        .filter((hotspot) => hotspot.to)
        .map((hotspot) => panoramaUrl(findRoom(hotspot.to).image));

    return (

        <div className="tour360">

            {/* =========================
                INFORMACIÓN
            ========================== */}

            <div className="panorama-info">

                <span className="panorama-apartment">
                    {tour.label}
                </span>

                <h2 className="panorama-title">
                    {room.title}
                </h2>

            </div>

            {/* =========================
                MENÚ
            ========================== */}

            {showMenu && (

                <nav className="tour360-menu" ref={menuRef}>

                    {tour.rooms.map((item) => (

                        <button
                            key={item.id}
                            className={`menu-item ${item.id === room.id ? "active" : ""}`}
                            aria-current={item.id === room.id ? "true" : undefined}
                            onClick={() => onRoomChange(item.id)}
                        >
                            {item.title}
                        </button>

                    ))}

                </nav>

            )}

            {/* =========================
                VISOR 360
            ========================== */}

            <div className="tour360-viewer">

                <Viewer360
                    image={panoramaUrl(room.image)}
                    hotspots={hotspots}
                    prefetch={neighbors}
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
                onClick={onBack}
            >
                ← VOLVER
            </button>

        </div>

    );
}
