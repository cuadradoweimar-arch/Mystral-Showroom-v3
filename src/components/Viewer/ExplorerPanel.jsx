import { useState } from "react";

/*
=====================================================
PANEL "NIVELES" (escenas levels y apartmentsOverview)

target: escena que abre; sin target se muestra como
"próximamente" y queda deshabilitado.
=====================================================
*/

const ITEMS = [
    { label: "TERRAZA", target: "project" },
    { label: "DÚPLEX 10-11", target: "duplex" },
    { label: "PENTHOUSE 9" },
    { label: "APARTAMENTOS", detail: "3–8", target: "apartmentsOverview" },
    { label: "PARQUEADERO 2" },
];

export default function ExplorerPanel({ scene, goTo }) {

    const [open, setOpen] = useState(false);

    return (

        <>

            <aside className={`explorer-panel ${open ? "open" : "closed"}`}>

                <div className="explorer-header">
                    <span>NIVELES</span>
                </div>

                <div className="explorer-content">

                    {ITEMS.map((item) => (

                        <button
                            key={item.label}
                            className={`explorer-item ${item.target === scene ? "active" : ""}`}
                            disabled={!item.target}
                            onClick={() => item.target && goTo(item.target)}
                        >

                            <span className="indicator"></span>

                            <span className="explorer-text">

                                {item.label}

                                {item.detail && <small>{item.detail}</small>}

                                {!item.target && <small className="soon">PRÓXIMAMENTE</small>}

                            </span>

                        </button>

                    ))}

                </div>

            </aside>

            <button
                className={`explorer-toggle ${open ? "open" : ""}`}
                onClick={() => setOpen(!open)}
                aria-label={open ? "Cerrar panel" : "Abrir panel"}
            >
                {open ? "→" : "←"}
            </button>

        </>

    );
}
