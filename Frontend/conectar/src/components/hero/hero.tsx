import React from "react";
import "./hero.css";
import heroImage from "../../../assets/plomero.jpg";
import avionImage from "../../../assets/avion.png";


const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero_text">
        <h2>
          ¿Buscas un <br /> profesional confiable?
        </h2>
        <p>
          Estás buscando <span>CONECT<span>AR</span></span>
        </p>
        <div className="paper_plane">
          <img src={avionImage} alt="Plane" />
          </div>
      </div>

      <div className="hero_image">
        <img src={heroImage} alt="Hero" />
      </div>
    </section>
  );
};

export default Hero;
