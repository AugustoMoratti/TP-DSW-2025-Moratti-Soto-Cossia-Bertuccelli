import React from "react";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Header from "../../components/header/header";
import "./perfil.css";

const Perfil: React.FC = () => {
  return (
    <div className="app-container">
      <Header bgColor="#ffffff" logoSrc="/assets/conect_2_1.png" >
        <button className="header-btn">Home</button>
        <button className="header-btn">Mi Perfil</button>
        <button className="header-btn">Admin</button>
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

