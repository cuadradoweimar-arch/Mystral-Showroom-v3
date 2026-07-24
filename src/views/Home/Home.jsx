import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";

export default function Home({ onExplore }) {

  return (

    <div className="home">

      <Navbar />

      <Hero onExplore={onExplore} />

    </div>

  );

}