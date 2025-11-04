import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Header from "../../components/header/header";
import { Button } from "../../components/button/Button";
import "./perfil.css";
import type { OtroUsuario } from "../../interfaces/otroUsuario.ts";
import { useUser } from "../../Hooks/useUser.tsx";
import SolicitarProf from "../../components/solicitarProf.tsx";

const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser(); // viene del UserProvider (me)
  const [usuario, setUsuario] = useState<OtroUsuario>();
  const [loadingUsuario, setLoadingUsuario] = useState(false);
  const [showSolicitar, setShowSolicitar] = useState(false);

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

  const ActDesc = async (newDesc: string) => {
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      const res = await fetch(`http://localhost:3000/api/usuario/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ descripcion: newDesc }),
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Error al actualizar descripción');
      
      setUsuario(prev => prev ? {...prev, descripcion: newDesc} : prev);
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  };

  // ✅ A partir de acá, retornos normales
  if (userLoading || loadingUsuario) return <div>Cargando perfil...</div>;
  if (!user) return null; // en teoría ya redirigió

  return (
    <div className="app-container">
      <Header bgColor="#ffffff" logoSrc="/assets/conect_2_1.png">
        {/* Abrir modal en vez de pasar el componente como handler */}
        <Button className="header-btn" onClick={() => setShowSolicitar(true)}>
          Quiero solicitar una nueva profesion
        </Button>
        <Button className="header-btn" onClick={() => navigate("/busqProfesionales")}>
          Quiero buscar un profesional
        </Button>
      </Header>

      {showSolicitar && (
        <SolicitarProf
          onClose={() => setShowSolicitar(false)}
          onSuccess={(value) => {
            // opcional: feedback, refresh, llamar API, etc.
            console.log("Solicitud enviada:", value);
            setShowSolicitar(false);
          }}
        />
      )}

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
              descripcion={usuario?.descripcion}
              onUpdateDescripcion={ActDesc}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Perfil;
