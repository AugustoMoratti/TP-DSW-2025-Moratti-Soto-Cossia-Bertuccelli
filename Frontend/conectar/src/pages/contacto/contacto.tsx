import React from 'react';
import Header from '../../components/header/header';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../Hooks/useUser";
import { handleLogout } from "../../utils/logout";
import './contact.css';
import fotoCossia from "../../../assets/Cossia.jpg";
import fotoBertu from "../../../assets/Bertu.png";
import fotoMora from "../../../assets/Mora.png";
import { Button } from '../../components/button/Button.tsx';

const Contacto: React.FC = () => {

  const user = useUser();

  const navigate = useNavigate();

  const handlerLogout = async () => {
    try {
      const logout = await handleLogout();

      if (!logout) {
        console.error("Error al cerrar sesión");
        return;
      }

      navigate("/login");
    } catch (error) {
      console.error("Error inesperado:", error);
    }
  };

  return (
    <div className="app-container">
      <Header bgColor="#ffffff" logoSrc="/assets/conect_2_1.png">
      { !user ? (
        <>
          <button className="header-btn" onClick={() => navigate("/register")}>
            Register
          </button>
          <button className="header-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        </>
        ) : (
          <>
            <button className="header-btn" onClick={() => navigate("/perfil")}>
              Mi Perfil
            </button>
            <Button
              style={{ backgroundColor: "#e74c3c", color: "#fff", border: "none" }}
              onClick={handlerLogout}
            >
              Cerrar Sesión
            </Button>
          </>
        )}
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
                <p>Legajo: <strong>52555</strong></p>
                <p>Correo: <strong>Augus.m0804@gmail.com</strong></p>
                <p>GitHub: <a href="https://github.com/AugusMoratti" target="_blank">Mi cuenta</a></p>
              </div>
              <img src={fotoMora} alt="Foto De Moratti" />
            </div>

            <div className="persona">
              <div className="info">
                <h2>Valentín Bertuccelli</h2>
                <p>Legajo: <strong>52809</strong></p>
                <p>Correo: <strong>valentinbertuccelli@gmail.com</strong></p>
                <p>GitHub: <a href="https://github.com/ValenBertu" target="_blank">Mi cuenta</a></p>
              </div>
              <img src={fotoBertu} alt="Foto De Bertuccelli" />
            </div>

            <div className="persona">
              <div className="info">
                <h2>Lucas Cossia Colagioia</h2>
                <p>Legajo: <strong>52777</strong></p>
                <p>Correo: <strong>luqui.cossia@gmail.com</strong></p>
                <p>GitHub: <a href="https://github.com/CossiaLucas" target="_blank">Mi cuenta</a></p>
              </div>
              <img src={fotoCossia} alt="Foto De Cossia" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacto;