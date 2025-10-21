import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Header from "../../components/header/header";
import "./perfil.css";
import type { Usuario } from "../../interfaces/usuario.ts";


const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Usuario>();

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3000/api/usuario/me", {
        credentials: "include", // envía la cookie userToken automáticamente
      });

      if (!res.ok) {
        navigate("/login"); // si no está logueado, lo mandamos al login
        return;
      }
      const data = await res.json();
      setUser(data.usuario);
    })();
  }, [navigate]);

  if (!user) return <div className="loading">Cargando perfil...</div>;

  return (
    <div className="app-container">
      <Header bgColor="#ffffff" logoSrc="/assets/conect_2_1.png">
        <button className="header-btn" onClick={() => navigate("/")}>
          Home
        </button>
        <button className="header-btn" onClick={() => navigate("/admin")}>
          Admin
        </button>
      </Header>

      <main>
        <div className="profile-wrapper">
          <ProfileCard
            nombre={user.nombre}
            email={user.email}
            direccion={user.direccion}
          />
        </div>
      </main>
    </div>
  );
};

export default Perfil;
