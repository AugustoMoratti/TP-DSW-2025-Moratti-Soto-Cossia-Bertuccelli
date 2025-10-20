import React from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Header from "../../components/header/header";
import "./perfil.css";
import { useNavigate } from "react-router";


const Perfil: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="app-container">
      <Header bgColor="#ffffff" logoSrc="/assets/conect_2_1.png" >
        <button className="header-btn" onClick={() => navigate("/")}>Home</button>
        <button className="header-btn" onClick={() => navigate("/busqProfesionales")}>Buscar Profesionales</button>
      </Header>

      <main>
        <div className="profile-wrapper">
          <ProfileCard />
        </div>
      </main>
    </div>
  );
};

export default Perfil;

