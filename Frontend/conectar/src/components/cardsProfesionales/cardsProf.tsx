import type { Usuario } from "../../interfaces/usuario.ts";
import "./cardsProf.css"
interface UsuarioCardProps {
  usuarios: Usuario[];
}
import PerfilCard from "./perfilCard.tsx";
import { useState, useEffect } from "react";
import { fetchMe } from "../../services/auth.services.ts";

interface UsuarioCardProps {
  usuarios: Usuario[];
}


export default function CardProfesional({ usuarios }: UsuarioCardProps) {
  const [user, setUser] = useState<Usuario | null>(null)

  useEffect(() => {
    (async () => {
      const u = await fetchMe()
      setUser(u)
    })()
  }, []);

  return (
    <div className="profs-container">
      {usuarios
        .filter(us => us.id !== user!.id)
        .map(us => (
          <PerfilCard key={us.id} usuario={us} />
        ))}
    </div>
  );
}