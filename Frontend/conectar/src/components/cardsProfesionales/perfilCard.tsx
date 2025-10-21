import type { Usuario } from "../../interfaces/usuario";
import "./perfilCard.css";
import { useNavigate } from "react-router";

interface Props {
  usuario: Usuario;
}

export default function PerfilCard({ usuario }: Props) {
  const navigate = useNavigate();
  return (
    <section className="card-user">
      <div className="user-info">
        <img
          src="/assets/OIP.webp"
          alt="imagen de perfil"
          className="img-perfil"
        />
        <div className="parrafos">
          <p className="name">{usuario.nombre} {usuario.apellido}</p>
          <p className="profesiones">
            Profesiones: {(usuario.profesiones ?? []).length > 0
              ? usuario.profesiones!.map(p => p.nombreProfesion).join(", ")
              : "Sin profesion"}
          </p>
          <p className="prov-localidad">
            {usuario.localidad?.nombre},{usuario.provincia?.nombre}
          </p>
        </div>
      </div>
      <div className="pie-card">
        <p className="resenia">★★★☆☆</p>
        <button className="ver-perfil-btn" onClick={() => navigate('/SuPerfil/:id')}>Ver perfil</button>
      </div>
    </section>
  );
}