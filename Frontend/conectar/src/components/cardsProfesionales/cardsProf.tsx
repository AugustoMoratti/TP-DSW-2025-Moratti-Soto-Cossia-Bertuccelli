import type { Usuario } from "../../interfaces/usuario.ts";
import "./cardsProf.css"
interface UsuarioCardProps {
  usuarios: Usuario[];
}
import PerfilCard from "./perfilCard.tsx";

interface UsuarioCardProps {
  usuarios: Usuario[];
}


export default function CardProfesional({ usuarios }: UsuarioCardProps) {
  return (
    <div className="profs-container">
      {usuarios.map(us => (
        <PerfilCard key={us.id} usuario={us} />
      ))}
    </div>
  );
}