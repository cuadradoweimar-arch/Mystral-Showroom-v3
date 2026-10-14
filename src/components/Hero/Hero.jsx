import "./Hero.css";

export default function Hero({ onExplore, onProjects }) {
  return (
    <section className="hero">

      <h1 className="visually-hidden">Mystral</h1>

      <button
        className="hero-button"
        onClick={onExplore}
      >
        EXPLORAR
      </button>

      <button
        className="hero-projects"
        onClick={onProjects}
      >
        PROYECTOS
      </button>

    </section>
  );
}
