import React, { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Header from "../../components/header/header";
import { Button } from "../../components/button/Button";
import "./perfil.css";
import type { OtroUsuario } from "../../interfaces/otroUsuario.ts";
import { useUser } from "../../Hooks/useUser.tsx";
import SolicitarProf from "../../components/solicitarProf.tsx";
import { handleLogout } from "../../utils/logout.ts";

const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser(); // viene del UserProvider (me)
  const [usuario, setUsuario] = useState<OtroUsuario>();
  const [loadingUsuario, setLoadingUsuario] = useState(false);
  const [showSolicitar, setShowSolicitar] = useState(false);
  const [sesionError, setSesionError] = useState('');
  const errorTimerRef = useRef<number | null>(null);
  const { refreshUser } = useUser();


  useEffect(() => {
    if (userLoading) { return }; // aún no sabemos si hay usuario 

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
          navigate("/login"); // si no existe lo enviamos al login
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

  const showError = (msg: string, ms = 5000) => {
    // limpia timer anterior si existe
    if (errorTimerRef.current) {
      window.clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }

    setSesionError(msg);

    // autoocultar error después de ms
    errorTimerRef.current = window.setTimeout(() => {
      errorTimerRef.current = null;
    }, ms);
  };



  const handlerLogout = async () => {
    try {
      await handleLogout();

      await refreshUser(); // 🔥 vuelve a consultar /me

      navigate('/login');
    } catch {
      showError('Error al cerrar sesión');
    }
  };

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

      const actualizado = await res.json();
      setUsuario(prev => prev ? { ...prev, ...actualizado } : prev);
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  };
  // ✅ A partir de acá, retornos normales
  if (userLoading || loadingUsuario) return <div>Cargando perfil...</div>;
  if (sesionError) return <div>{sesionError}...</div>;
  if (!user) {
    return <Navigate to="/login" replace />;
  }; // en teoría ya redirigió

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
        <Button className="header-btn-logout" onClick={() => handlerLogout()}>
          Cerrar Sesion
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
              id={user.id}
              nombre={usuario.nombre}
              apellido={usuario.apellido}
              email={usuario.email}
              contacto={usuario.contacto}
              localidad={usuario.localidad.nombre}
              provincia={usuario.provincia.nombre}
              profesiones={usuario.profesiones ?? []}
              habilidades={usuario.habilidades ?? []}
              fotoUrl={usuario.fotoUrl}
              tipoPage="miPerfil"
              trabajos={usuario.trabajos ?? []}
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
