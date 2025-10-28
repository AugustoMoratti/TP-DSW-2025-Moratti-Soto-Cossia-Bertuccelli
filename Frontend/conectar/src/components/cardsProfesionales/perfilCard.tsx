import type { Usuario } from "../../interfaces/usuario";
import "./perfilCard.css";
import { useNavigate } from "react-router";

interface Props {
  usuario: Usuario;
}


export default function PerfilCard({ usuario }: Props) {
  const navigate = useNavigate();
  const estrellas = () => {
    if (usuario.trabajos.length === 0) {
      return ""
    }
    const sumaResenias = usuario.trabajos!.reduce(
      (acum, trabajo) => acum + trabajo.resenia.valor, 0
    );
    const promedio = sumaResenias / usuario.trabajos.length;

    const estrellasCompletas = Math.round(promedio);

    return '★'.repeat(estrellasCompletas) + '☆'.repeat(5 - estrellasCompletas);

  }
  return (
    <section className="card-user">
      <div className="user-info">
        <img
          src={`http://localhost:3000${usuario.fotoUrl}`}//porque está fuera del frontend, fuera del alcance de react
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
        <p className="resenia">{estrellas()}</p>
        <button className="ver-perfil-btn" onClick={() => navigate(`/SuPerfil/${encodeURIComponent(usuario.id)}`)}>Ver perfil</button>
      </div>
    </section>
  );
}