import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Header from "../../components/header/header";
import "./perfil.css";
import type { OtroUsuario } from "../../interfaces/otroUsuario.ts";
import { useUser } from "../../Hooks/useUser.tsx";


const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser(); // viene del UserProvider (me)
  const [usuario, setUsuario] = useState<OtroUsuario>();
  const [loadingUsuario, setLoadingUsuario] = useState(false);


  // ✅ Todos los Hooks siempre van arriba
  useEffect(() => {
    if (userLoading) return; // aún no sabemos si hay usuario

    if (!user) {
      navigate("/login");
      return;
    }

    const fetchDetalle = async () => {
      setLoadingUsuario(true);
      try {
        const res = await fetch(`http://localhost:3000/api/usuario/${user.id}`, {
          method: "GET",
        });
        if (!res.ok) {
          navigate("/login"); // si no está existe el usuario lo enviamos de vuelta a la pagina busqueda profesionales
          return;
        }
        const data = await res.json();
        setUsuario(data.data);
      } catch (err) {
        console.error("Error al obtener detalle:", err);
      } finally {
        setLoadingUsuario(false);
      }
    };

    fetchDetalle();
  }, [user, userLoading, navigate]);

  // ✅ A partir de acá, retornos normales
  if (userLoading || loadingUsuario) return <div>Cargando perfil...</div>;
  if (!user) return null; // en teoría ya redirigió

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
          {usuario && (
            <ProfileCard
              nombre={usuario.nombre}
              apellido={usuario.apellido}
              email={usuario.email}
              localidad={usuario.localidad}
              provincia={usuario.provincia}
              fotoUrl={usuario.fotoUrl}
              tipoPage="miPerfil"
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Perfil;
