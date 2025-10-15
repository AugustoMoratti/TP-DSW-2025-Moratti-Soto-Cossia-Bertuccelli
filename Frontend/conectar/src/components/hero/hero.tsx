import React from "react";
import "./Hero.css";
import { Button } from "../button/Button";

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero_text">
        <h2>
          ¿Buscas un <br /> profesional confiable?
        </h2>
        <p>
          Estás buscando <span>CONET<span>AR</span></span>
        </p>
        <div className="hero_buttons">
          <Button variant="contained">Get started</Button>
          <Button variant="outlined">Talk to sales</Button>
        </div>
        <div className="paper_plane">✈️</div>
      </div>

      <div className="hero_image"></div>
    </section>
  );
};

export default Hero;
