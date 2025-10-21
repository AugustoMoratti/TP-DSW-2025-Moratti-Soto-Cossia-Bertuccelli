import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Header from "../../components/header/header";
import "./perfil.css";


const Perfil: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/usuario/${id}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    })();
  }, [id]);

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
            imagenPerfil={`http://localhost:3000${user.imagenPerfil}`}
          />
        </div>
      </main>
    </div>
  );
};

export default Perfil;
