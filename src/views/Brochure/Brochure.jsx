import { useState, useEffect } from "react";
import "./Brochure.css";
import { slides } from "./slides";

const LAST = slides.length - 1;

export default function Brochure({ onClose }) {

    const [current, setCurrent] = useState(0);

    const slide = slides[current];

    const next = () => setCurrent((index) => Math.min(index + 1, LAST));

    const prev = () => setCurrent((index) => Math.max(index - 1, 0));

    // Precarga de la siguiente imagen
    useEffect(() => {

        const nextSlide = slides[current + 1];

        if (nextSlide) {
            const img = new Image();
            img.src = nextSlide.image;
        }

    }, [current]);

    // Navegación con teclado
    useEffect(() => {

        const handleKey = (e) => {

            if (e.key === "ArrowRight") setCurrent((index) => Math.min(index + 1, LAST));

            if (e.key === "ArrowLeft") setCurrent((index) => Math.max(index - 1, 0));

            if (e.key === "Escape") onClose();

        };

        window.addEventListener("keydown", handleKey);

        return () => window.removeEventListener("keydown", handleKey);

    }, [onClose]);

    return (

        <div className="brochure">

            <img
                key={slide.image}
                src={slide.image}
                alt={`Brochure Mystral, página ${current + 1}`}
                decoding="async"
                className="brochure-image"
            />

            {slide.type === "start" && (

                <div className="brochure-overlay">

                    <h1>MYSTRAL</h1>

                    <p>Brochure interactivo</p>

                    <button
                        className="brochure-start"
                        onClick={next}
                    >
                        COMENZAR
                    </button>

                </div>

            )}

            {slide.type !== "start" && slide.type !== "end" && (

                <>

                    <button
                        className="brochure-arrow left"
                        aria-label="Página anterior"
                        onClick={prev}
                    >
                        ❮
                    </button>

                    <button
                        className="brochure-arrow right"
                        aria-label="Página siguiente"
                        onClick={next}
                    >
                        ❯
                    </button>

                    <div className="brochure-counter">

                        {current} / {slides.length - 2}

                    </div>

                </>

            )}

            {slide.type === "end" && (

                <div className="brochure-overlay">

                    <h1>Gracias</h1>

                    <p>Gracias por recorrer Mystral.</p>

                    <div className="brochure-buttons">

                        <button
                            className="brochure-start"
                            onClick={() => setCurrent(0)}
                        >
                            VER NUEVAMENTE
                        </button>

                        <button
                            className="brochure-start"
                            onClick={onClose}
                        >
                            VOLVER
                        </button>

                    </div>

                </div>

            )}

            <button
                className="brochure-close"
                aria-label="Cerrar brochure"
                onClick={onClose}
            >
                ✕
            </button>

        </div>

    );

}
