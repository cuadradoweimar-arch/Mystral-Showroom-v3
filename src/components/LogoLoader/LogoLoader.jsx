import "./LogoLoader.css";

import { useRef } from "react";

// Las dos piezas salen de la misma imagen original, como PNG
// con transparencia real (el negro del render pasó a canal
// alfa): la esfera con el rombo borrado y el rombo solo.
import sphere from "../../assets/images/brand/esfera-vidrio.png";
import rhombus from "../../assets/images/brand/rombo-vidrio.png";

/*
=====================================================
PANTALLA DE CARGA (estilo Siri de iOS 27)

La esfera de vidrio con el logo, recortada en círculo y
transparente (el negro de la imagen se funde con lo que
hay detrás), que flota suavemente mientras carga. Dentro,
el rombo del logo como pieza 3D con espesor (prisma
cuadrado girado 45°) que gira 360° sobre el eje Y.

Interacción (mouse o dedo):
  - la esfera se inclina y se desplaza hacia el puntero
    y el reflejo de luz lo sigue (--px / --py, de -1 a 1);
  - al presionar se hunde y rebota, y suelta una onda.
Los valores se escriben directo en el estilo: no hay
re-render por cada movimiento.

leaving:   inicia el fundido de salida.
className: variantes (ej. "is-embedded is-overlay" dentro
           del visor 360, ver LogoLoader.css).
=====================================================
*/

const EDGES = ["right", "left", "top", "bottom"];

const clamp = (value) => Math.max(-1, Math.min(1, value));

export default function LogoLoader({ leaving = false, className = "" }) {

    const ref = useRef(null);

    const setPointer = (x, y) => {
        ref.current?.style.setProperty("--px", x.toFixed(3));
        ref.current?.style.setProperty("--py", y.toFixed(3));
    };

    const handleMove = (event) => {
        const box = ref.current.getBoundingClientRect();
        setPointer(
            clamp(((event.clientX - box.left) / box.width) * 2 - 1),
            clamp(((event.clientY - box.top) / box.height) * 2 - 1),
        );
    };

    const handleDown = (event) => {

        handleMove(event);

        const el = ref.current;

        el.classList.add("is-pressed");

        // Reinicia la onda aunque se toque varias veces seguidas
        el.classList.remove("is-pulse");
        void el.offsetWidth;
        el.classList.add("is-pulse");
    };

    const handleUp = () => ref.current?.classList.remove("is-pressed");

    const handleLeave = () => {
        handleUp();
        setPointer(0, 0);
    };

    return (

        <div
            ref={ref}
            className={`logo-loader ${leaving ? "is-leaving" : ""} ${className}`}
            role="status"
            aria-live="polite"
            onPointerMove={handleMove}
            onPointerDown={handleDown}
            onPointerUp={handleUp}
            onPointerCancel={handleLeave}
            onPointerLeave={handleLeave}
        >

            <span className="visually-hidden">Cargando</span>

            <div className="logo-loader-stage" aria-hidden="true">

                <div className="logo-orb-float">

                    <span className="logo-orb-pulse" />

                    {/* La esfera queda quieta (sólo se inclina hacia el
                        puntero); el rombo de adentro gira sobre el eje Y */}
                    <div className="logo-orb">

                        <div className="logo-plate">
                            <div className="logo-prism">

                                <div className="logo-prism-face is-front">
                                    <img src={rhombus} alt="" draggable="false" />
                                </div>

                                <div className="logo-prism-face is-back">
                                    <img src={rhombus} alt="" draggable="false" />
                                </div>

                                {EDGES.map((edge) => (
                                    <div key={edge} className={`logo-prism-edge is-${edge}`} />
                                ))}

                            </div>
                        </div>

                        <img className="logo-orb-image" src={sphere} alt="" draggable="false" />
                        <span className="logo-orb-shine" />

                    </div>

                </div>

            </div>

        </div>

    );
}
