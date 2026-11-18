import "./Hero.css";

export default function Hero({ onExplore, onProjects, onMap }) {
  return (
    <section className="hero">

      <h1 className="visually-hidden">Mystral</h1>

      {/* Volver al mapa 3D de la intro */}
      <button
        className="hero-map"
        onClick={onMap}
      >
        ← MAPA
      </button>

      <button
        className="hero-button"
        onClick={onExplore}
      >
        INGRESAR
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
