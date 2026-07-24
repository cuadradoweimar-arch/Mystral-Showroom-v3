import { useState, useEffect } from "react";
import "./Brochure.css";
import { slides } from "./slides";

export default function Brochure({ setScene }) {

    const [current, setCurrent] = useState(0);

    const slide = slides[current];

    const next = () => {
        if (current < slides.length - 1) {
            setCurrent(prev => prev + 1);
        }
    };

    const prev = () => {
        if (current > 0) {
            setCurrent(prev => prev - 1);
        }
    };

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

            if (e.key === "ArrowRight") next();

            if (e.key === "ArrowLeft") prev();

            if (e.key === "Escape") setScene("home");

        };

        window.addEventListener("keydown", handleKey);

        return () => window.removeEventListener("keydown", handleKey);

    }, [current]);

    return (

        <div className="brochure">

            <img
                key={slide.image}
                src={slide.image}
                alt=""
                loading="eager"
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
                        onClick={prev}
                    >
                        ❮
                    </button>

                    <button
                        className="brochure-arrow right"
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
                            onClick={() => setScene("home")}
                        >
                            VOLVER
                        </button>

                    </div>

                </div>

            )}

            <button
                className="brochure-close"
                onClick={() => setScene("home")}
            >
                ✕
            </button>

        </div>

    );

}