import "./Hotspot.css";

export default function Hotspot({

    top,
    left,
    width = "22px",
    height = "22px",
    label,
    onClick,
    type = "point"

}){

    return(

        <button
            className={`hotspot ${type}`}
            style={{
                top,
                left,
                width,
                height
            }}
            onClick={onClick}
        >

            {type === "point" && (

                <>

                    <span className="pulse"></span>

                    <span className="circle">
                        →
                    </span>

                </>

            )}

            {label && (
                <p>{label}</p>
            )}

        </button>

    );

}