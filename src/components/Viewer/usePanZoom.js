import { useCallback, useEffect, useRef, useState } from "react";

/*
=====================================================
ARRASTRE Y ZOOM DE LA ESCENA

El escenario (video/imagen + franjas, etiquetas y puntos)
mide lo mismo que el video o la imagen (--media-ratio):
en un celular vertical es más ancho que la pantalla y se
recorre arrastrando de lado a lado.

- Arrastre: siempre que el escenario sea más grande que
  la pantalla (celular) o haya zoom.
- Botones + / −: zoom al centro de la pantalla.
- Rueda del mouse (sólo si zoomable): zoom hacia el cursor.
- Un arrastre no cuenta como clic sobre una franja/punto.
=====================================================
*/

export const MIN_SCALE = 1;
export const MAX_SCALE = 3;

const STEP = 0.5;

// Píxeles que hay que mover para que cuente como arrastre
const DRAG_THRESHOLD = 6;

const RESET = { scale: 1, x: 0, y: 0 };

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function usePanZoom({ zoomable = false, mediaRatio } = {}) {

    const [view, setView] = useState(RESET);
    const [dragging, setDragging] = useState(false);
    const [pannable, setPannable] = useState(false);

    // El escenario se vuelve a montar en cada escena (transición):
    // el estado avisa del elemento nuevo para observar su tamaño.
    const stageRef = useRef(null);
    const [stageEl, setStageEl] = useState(null);

    // Estable (useCallback): si cambiara en cada render, React
    // la volvería a llamar y se encadenarían renders.
    const setStage = useCallback((el) => {
        stageRef.current = el;
        setStageEl(el);
    }, []);

    const drag = useRef(null);
    const justDragged = useRef(false);

    // Caja de la pantalla (contenedor del escenario)
    const box = () => stageRef.current?.parentElement?.getBoundingClientRect()
        ?? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

    // Tamaño del escenario sin zoom (offsetWidth ignora transform)
    const stageSize = () => ({
        width: stageRef.current?.offsetWidth ?? 0,
        height: stageRef.current?.offsetHeight ?? 0,
    });

    // La vista nunca deja ver fuera del escenario
    const limit = ({ scale, x, y }) => {

        const screen = box();
        const stage = stageSize();

        const maxX = Math.max(0, (stage.width * scale - screen.width) / 2);
        const maxY = Math.max(0, (stage.height * scale - screen.height) / 2);

        return {
            scale,
            x: clamp(x, -maxX, maxX),
            y: clamp(y, -maxY, maxY),
        };
    };

    const limitRef = useRef(limit);
    limitRef.current = limit;

    // ¿El escenario sobresale de la pantalla? (cambia con el
    // tamaño de pantalla, la orientación y la escena)
    useEffect(() => {

        const stage = stageEl;
        const parent = stage?.parentElement;

        if (!stage || !parent) return;

        const update = () => {
            const overflow =
                stage.offsetWidth > parent.clientWidth + 1 ||
                stage.offsetHeight > parent.clientHeight + 1;
            setPannable(overflow);
            setView((current) => limitRef.current(current));
        };

        update();

        const observer = new ResizeObserver(update);
        observer.observe(stage);
        observer.observe(parent);

        return () => observer.disconnect();

    }, [stageEl]);

    const canPan = view.scale > MIN_SCALE || pannable;

    // point = punto relativo al centro de la pantalla que queda fijo
    const zoomTo = (nextScale, point = { x: 0, y: 0 }) => {

        setView((current) => {

            const scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
            const ratio = scale / current.scale;

            return limit({
                scale,
                x: point.x - (point.x - current.x) * ratio,
                y: point.y - (point.y - current.y) * ratio,
            });
        });
    };

    const zoomIn = () => zoomTo(view.scale + STEP);
    const zoomOut = () => zoomTo(view.scale - STEP);
    const reset = () => setView(RESET);

    const onWheel = (event) => {

        if (!zoomable) return;

        const rect = box();

        zoomTo(view.scale * (event.deltaY < 0 ? 1.15 : 1 / 1.15), {
            x: event.clientX - rect.left - rect.width / 2,
            y: event.clientY - rect.top - rect.height / 2,
        });
    };

    const onPointerDown = (event) => {

        if (!canPan || event.button !== 0) return;

        drag.current = {
            id: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            originX: view.x,
            originY: view.y,
            moved: false,
        };
    };

    const onPointerMove = (event) => {

        const current = drag.current;

        if (!current || current.id !== event.pointerId) return;

        const dx = event.clientX - current.startX;
        const dy = event.clientY - current.startY;

        if (!current.moved) {

            if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

            // La captura se toma sólo al arrastrar: si no,
            // el clic se iría a la capa y no a la franja.
            current.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            setDragging(true);
        }

        setView((view) => limit({
            scale: view.scale,
            x: current.originX + dx,
            y: current.originY + dy,
        }));
    };

    const onPointerUp = (event) => {

        const current = drag.current;

        if (!current || current.id !== event.pointerId) return;

        justDragged.current = current.moved;
        drag.current = null;
        setDragging(false);
    };

    // Un arrastre no abre la ficha de la franja donde termina
    const onClickCapture = (event) => {

        if (!justDragged.current) return;

        justDragged.current = false;
        event.stopPropagation();
        event.preventDefault();
    };

    const classes = [
        "zoom-stage",
        canPan ? "is-pannable" : "",
        dragging ? "is-dragging" : "",
    ].join(" ");

    return {
        scale: view.scale,
        zoomIn,
        zoomOut,
        reset,
        stageProps: {
            ref: setStage,
            className: classes,
            style: {
                "--media-ratio": mediaRatio,
                transform: `translate(-50%, -50%) translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
            },
            onWheel,
            onPointerDown,
            onPointerMove,
            onPointerUp,
            onPointerCancel: onPointerUp,
            onClickCapture,
        },
    };
}
