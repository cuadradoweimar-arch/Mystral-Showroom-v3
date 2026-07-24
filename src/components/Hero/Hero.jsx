import "./Hero.css";

export default function Hero({ onExplore }) {
  return (
    <section className="hero">

      <div className="hero-card">

        <span className="hero-engine">
          Brosure inmersivo
        </span>

        <h2 className="hero-logo">
          MYSTRAL
        </h2>

        <p className="hero-description">
          Un privilegio reservado para pocos.
        </p>

        <button
          className="hero-button"
          onClick={onExplore}
        >
          EXPLORAR
        </button>

      </div>

    </section>
  );
}