import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/header/header";
import "./SuPerfil.css";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import type { OtroUsuario } from "../../interfaces/otroUsuario";

const SuPerfil: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<OtroUsuario>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/usuario/${id}`);
        if (!res.ok) {
          navigate("/busqProfesionales");
          return;
        }

        const data = await res.json();
        setUser(data.data);
      } catch (err) {
        console.error("Error en el fetch:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  if (loading) return <p>Cargando perfil...</p>;
  if (!user) return <p>No se encontró el usuario.</p>;

  return (
    <div className="app-container">
      <Header bgColor="#ffffff" logoSrc="/assets/conect_2_1.png" >
        <button className="header-btn" onClick={() => navigate("/busqProfesionales")}>Buscar Profesionales</button>
        <button className="header-btn" onClick={() => navigate("/perfil")}>Mi Perfil</button>
      </Header>

      <main>
        <div className="profile-wrapper">
          {user && (
            <ProfileCard
              id={user.id}
              nombre={user.nombre}
              apellido={user.apellido}
              email={user.email}
              contacto={user.contacto}
              localidad={user.localidad.nombre}
              provincia={user.provincia.nombre}
              profesiones={user.profesiones ?? []}
              habilidades={user.habilidades ?? []}
              fotoUrl={user.fotoUrl}
              tipoPage="suPerfil"
              trabajos={user.trabajos ?? []}
              descripcion={user?.descripcion}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default SuPerfil;
