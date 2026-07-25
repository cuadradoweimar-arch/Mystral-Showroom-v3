import "./Hero.css";

export default function Hero({ onExplore }) {
  return (
    <section className="hero">

      <div className="hero-card">

        <span className="hero-engine">
          
        </span>

        <h2 className="hero-logo">
          
        </h2>

        <p className="hero-description">
          
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