import React from 'react';
import Header from '../../components/header/header';
import { useNavigate } from 'react-router-dom';
import './about.css';
import fotoCossia from "../../../assets/Cossia.jpg";
import fotoBertu from "../../../assets/Bertu.png";
import fotoMora from "../../../assets/Mora.png";

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <Header bgColor="#ffffff" logoSrc="/assets/conect_2_1.png">
        <button className="header-btn" onClick={() => navigate("/busqProfesionales")}>
          Quiero contratar un profesional!
        </button>
        <button className="header-btn" onClick={() => navigate("/miPerfil")}>
          Mi perfil
        </button>
      </Header>

      <div className='card_about'>
        <div className='content'>
          <h1>Sobre nosotros</h1>
          <p>Aquí podrás encontrar toda la información para contactar a los creadores de esta página tan fachera.</p>
          <br />
          <div className='divisor' style={{ background: '#114f5a'}}></div>

          <div className='Muchacho'>
            <div className="persona">
              <div className="info">
                <h2>Augusto Moratti</h2>
                <p>Legajo: <strong>Ingresa aquí tus datos</strong></p>
                <p>Correo: <strong>Ingresa aquí tus datos</strong></p>
                <p>GitHub: <a href="https://github.com/AugusMoratti">Mi cuenta</a></p>
              </div>
              <img src={fotoMora} alt="Foto De Moratti" />
            </div>

            <div className="persona">
              <div className="info">
                <h2>Valentín Bertuccelli</h2>
                <p>Legajo: <strong>52809</strong></p>
                <p>Correo: <strong>valentinbertuccelli@gmail.com</strong></p>
                <p>GitHub: <a href="https://github.com/ValenBertu">Mi cuenta</a></p>
              </div>
              <img src={fotoBertu} alt="Foto De Bertuccelli" />
            </div>

            <div className="persona">
              <div className="info">
                <h2>Lucas Cossia Colagioia</h2>
                <p>Legajo: <strong>52777</strong></p>
                <p>Correo: <strong>luqui.cossia@gmail.com</strong></p>
                <p>GitHub: <a href="https://github.com/CossiaLucas">Mi cuenta</a></p>
              </div>
              <img src={fotoCossia} alt="Foto De Cossia" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;