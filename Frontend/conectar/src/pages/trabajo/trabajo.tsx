import type { Usuario } from "../../interfaces/usuario.ts";
import type { Trabajo } from "../../interfaces/trabajo.ts";
import { useNavigate } from "react-router-dom";;
import Header from "../../components/header/header";
import { useState } from "react";

export default function Trabajos() {
  const navigate = useNavigate();
  const [trabajosFinalizados, setTrabajosFinalizados] = useState<Trabajo[]>([])
  const [trabajosPendientes, setTrabajosPendientes] = useState<Trabajo[]>([])

  useEffect() => {
    const res = await fetch("http://localhost:3000/api/trabajo/")
  }

  return (
    <div>
      <Header bgColor="#ffffff" logoSrc="/assets/conect_2_1.png">
        <button className="header-btn" onClick={() => navigate("/miPerfil")}>
          Mi perfil
        </button>
        <button className="header-btn" onClick={() => navigate("/busqProfesionales")}>
          Quiero buscar un profesional
        </button>
      </Header>

      <main>
        <section>

        </section>
      </main>
    </div>
  )
}