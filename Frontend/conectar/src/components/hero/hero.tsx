import React from "react";
import "./hero.css";
import heroImage from "../../../assets/plomero.png";
import avionImage from "../../../assets/avion.png";
import logo from "../../../assets/conect.png";


const Hero: React.FC = () => {
  return (


<section className="hero">

  {/* Contenido principal */}
  <div className="hero_text">
    <h2>
      ¿Buscas un <br /> profesional confiable?
    </h2>
    <br />
    <div className="text_logo">
      <p>Estás buscando</p>   
      <img src={logo} alt="Conectar Logo" className="logo" />
    </div>
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
