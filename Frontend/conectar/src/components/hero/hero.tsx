import React from "react";
import "./hero.css";
import heroImage from "../../../assets/plomero.png";
import avionImage from "../../../assets/avion.png";
import logo from "../../../assets/conect.png";
import img1 from "../../../assets/laburante_1.png";
import img2 from "../../../assets/laburante_2.png";
import img3 from "../../../assets/laburante_3.png";

const Hero: React.FC = () => {
  return (
    <>
      <section className="hero">
        <div className="hero_text">
          <h2>
            ¿Buscas un <br /> profesional confiable?
          </h2>
          <br />
          <div className="text_logo">
            <p>Estás buscando</p>
            <img src={logo} alt="Conectar Logo" className="logo" />
            <img src={avionImage} alt="Plane" style={{ position: 'relative', bottom: '90%'}}/>
          </div>
        </div>

        <div className="hero_image">
          <img src={heroImage} alt="Hero" />
        </div>
      </section>

      <div className="text_info">
        
        <div className="card_info izq">
          <p>
            ¿Necesitas un servicio profesional? <br />
            Encuentra profesionales calificados en diversas áreas y servicios. <br />
            ¡Conectar te ayuda a conectar con los mejores expertos cerca de ti!
          </p>
          <img src={img1} alt="Personaje que trabaja" className="img_work" />
        </div>


        <div className="card_info der">
          <img src={img2} alt="Personaje que trabaja" className="img_work" />
          <p>
            ¿Eres un profesional? <br />
            Regístrate en nuestra plataforma y amplía tu alcance. <br />
            Conectar te conecta con clientes que buscan tus habilidades para que los ayudes.
          </p>
        </div>

        <div className="card_info center">
          <p>
            ¡Únete a Conectar hoy mismo y descubre un mundo de oportunidades! <br />
            Ya sea que busques servicios o quieras ofrecerlos, <br />
            Conectar es tu aliado confiable para conectar con profesionales y clientes de manera fácil y segura.
          </p>
          <img src={img3} alt="Personaje que trabaja" className="img_work" />
        </div>
      </div>

      <div className="vacio"></div>
    </>
  );
};

export default Hero;
