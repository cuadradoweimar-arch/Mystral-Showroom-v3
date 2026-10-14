/*
=====================================================
TARJETAS DE APARTAMENTOS (escena apartments)
=====================================================
*/

const APARTMENTS = [
    { title: "TIPO A", area: "220.30 m²", target: "typeA360", action: "ENTRAR →" },
    {
        title: "DÚPLEX",
        area: "420.60 m²",
        description: "Dos niveles • Terraza privada",
        target: "duplex",
        action: "EXPLORAR →",
        featured: true,
    },
    { title: "TIPO B", area: "214.22 m²", target: "typeB360", action: "ENTRAR →" },
];

export default function ApartmentSelector({ goTo }) {

    return (

        <div className="apartment-selector">

            {APARTMENTS.map((apartment) => (

                <div
                    key={apartment.target}
                    className={`apartment-card ${apartment.featured ? "duplex-card" : ""}`}
                >

                    <h2>{apartment.title}</h2>

                    <span>{apartment.area}</span>

                    {apartment.description && <p>{apartment.description}</p>}

                    <button onClick={() => goTo(apartment.target)}>
                        {apartment.action}
                    </button>

                </div>

            ))}

        </div>

    );
}
