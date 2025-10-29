import React from "react";
import Header from "../../components/header/header";
import "./SuPerfil.css";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { OtroUsuario } from "../../interfaces/otroUsuario.ts";
import ProfileCard from "../../components/ProfileCard/ProfileCard.tsx";




const SuPerfil: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const [user, setUser] = useState<OtroUsuario>();

  console.log(id)

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/usuario/${id}`, {
          method: "GET",
        });

        if (!res.ok) {
          navigate("/busqProfesionales"); // si no está existe el usuario lo enviamos de vuelta a la pagina busqueda profesionales
          return;
        }
        const data = await res.json();
        setUser(data.data); // 👈 solo si existe data.usuario
      } catch (err) {
        console.log("Error en el fetch", err);
      }
    })();
  }, [id, navigate]);


  return (
    <div className="app-container">
      <Header bgColor="#ffffff" logoSrc="/assets/conect_2_1.png" >
        <button className="header-btn" onClick={() => navigate("/")}>Home</button>
        <button className="header-btn" onClick={() => navigate("/busqProfesionales")}>Buscar Profesionales</button>
      </Header>

      <main>
        <div className="profile-wrapper">
          {user && (
            <ProfileCard
              nombre={user.nombre}
              apellido={user.apellido}
              email={user.email}
              localidad={user.localidad}
              provincia={user.provincia}
              fotoUrl={user.fotoUrl}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default SuPerfil;

