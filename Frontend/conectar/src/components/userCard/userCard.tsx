import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Hooks/useUser.tsx";
import type { Usuario } from "../../interfaces/usuario.ts";
import type { OtroUsuario } from "../../interfaces/otroUsuario.ts";
import "./userCard.css";

type UserCardData = Usuario | OtroUsuario;

interface Props {
  small?: boolean;
  usuario?: UserCardData;
}

export default function UserCard({ small, usuario: usuarioProp }: Props) {
  const { user, loading: userLoading } = useUser();
  const [usuario, setUsuario] = useState<UserCardData | undefined>(usuarioProp);
  const navigate = useNavigate();

  useEffect(() => {
    if (usuarioProp) {
      setUsuario(usuarioProp);
      return;
    }

    if (userLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    const fetchDetalle = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/usuario/${user.id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUsuario(data.data);
      } catch (err) {
        console.error("Error al obtener detalle:", err);
      }
    };

    fetchDetalle();
  }, [usuarioProp, user, userLoading, navigate]);

  const usuarioConDescripcion = usuario as UserCardData & { descripcion?: string };
  const fotoSrc = usuario?.fotoUrl ? `http://localhost:3000${usuario.fotoUrl}` : "/default-avatar.png";

  return ( //!AGREGAR HEADER
    <div className={`user-card ${small ? "small" : ""}`}>
      <img
        src={fotoSrc}
        alt={"Foto de perfil del usuario"}
        className={"avatarr"}
      />
      <div className="user-infoo">
        {usuario ? <h4>{usuario.nombre} {usuario.apellido}</h4> : <h4>Cargando...</h4>}
        {usuario ? <p>{usuario.email}</p> : <p>Cargando...</p>}
        {usuario && (
          <p className="ubicacion">{usuario.provincia.nombre}, {usuario.localidad.nombre}</p>
        )}
        {!small && usuarioConDescripcion?.descripcion && <p className="descripcion">{usuarioConDescripcion.descripcion}</p>}
        {!small && usuario?.profesiones && usuario.profesiones.length > 0 && (
          <div className="profesiones">
            <span>Profesiones:</span>
            <p>{usuario.profesiones.map(p => p.nombreProfesion).join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

