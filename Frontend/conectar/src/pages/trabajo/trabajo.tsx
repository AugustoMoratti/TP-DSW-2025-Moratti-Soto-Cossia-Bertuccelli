import type { Usuario } from "../../interfaces/usuario.ts";
import type { Trabajo } from "../../interfaces/trabajo.ts";
import { useNavigate } from "react-router-dom";;
import Header from "../../components/header/header";
import { useState, useEffect } from "react";
import { fetchMe } from "../../services/auth.services.ts";

export default function Trabajos() {
  const navigate = useNavigate();
  const [trabajosFinalizados, setTrabajosFinalizados] = useState<Trabajo[]>([])
  const [trabajosPendientes, setTrabajosPendientes] = useState<Trabajo[]>([])



  useEffect(() => {
    (async () => {
      const usuario = await fetchMe();
      const res = await fetch(`http://localhost:3000/api/trabajos/finalizados/${usuario.id}`, { method: "GET" })
      const data = await res.json()
      console.log(data.data)
      setTrabajosFinalizados(data.data)
    })()
  }, []);

  useEffect(() => {
    (async () => {
      const usuario = await fetchMe();
      const res = await fetch(`http://localhost:3000/api/trabajos/pendientes/${usuario.id}`, { method: "GET" })
      const data = await res.json()
      console.log(data.data)
      setTrabajosPendientes(data.data)
    })()
  }, []);

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
        <section className="trabajos_pendientes_container">

        </section>
        <section className="trabajos_finalizados_container">

        </section>
      </main>
    </div>
  )
}