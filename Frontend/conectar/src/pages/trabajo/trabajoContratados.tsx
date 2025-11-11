import type { Trabajo } from "../../interfaces/trabajo.ts";
import { useNavigate } from "react-router-dom";;
import Header from "../../components/header/header.tsx";
import { useState, useEffect } from "react";
import { fetchMe } from "../../services/auth.services.ts";
import TrabajoCardContratados from "../../components/cardTrabajos/cardTrabajoContratados.tsx";
import "./trabajoContratados.css"
export default function TrabajosContratados() {
  const navigate = useNavigate();
  const [trabajosFinalizados, setTrabajosFinalizados] = useState<Trabajo[]>([])
  const [trabajosPendientes, setTrabajosPendientes] = useState<Trabajo[]>([])
  const [page, setPage] = useState(0);
  const [page2, setPage2] = useState(0);

  useEffect(() => {
    (async () => {
      const usuario = await fetchMe();
      const res = await fetch(`http://localhost:3000/api/trabajos/finalizados/contratados/${usuario.id}?limit=10&offset=${page * 10}`)
      const data = await res.json()
      console.log(data.data)
      setTrabajosFinalizados(data.data)
    })()
  }, [page]);

  useEffect(() => {
    (async () => {
      const usuario = await fetchMe();
      const res = await fetch(`http://localhost:3000/api/trabajos/pendientes/contratados/${usuario.id}?limit=10&offset=${page2 * 10}`)
      const data = await res.json()
      console.log(data.data)
      setTrabajosPendientes(data.data)
    })()
  }, [page2]);

  return (
    <div className="container_pagetrabajos">
      <Header bgColor="#ffffff" logoSrc="/assets/conect_2_1.png">
        <button className="header-btn" onClick={() => navigate("/perfil")}>
          Mi Perfil
        </button>
        <button className="header-btn" onClick={() => navigate("/busqProfesionales")}>
          Quiero buscar un profesional
        </button>
      </Header>

      <main className="container_trabajos">
        <section className="trabajos_pendientes_finalizados_container">
          <h2 className="titulo_trabajos">TRABAJOS PENDIENTES</h2>
          <hr></hr>
          {trabajosPendientes.length > 0 ? (trabajosPendientes.map(trabajo => (
            <TrabajoCardContratados key={trabajo.id} trabajo={trabajo} tipo={"pendientes"} />
          ))) : (
            <p className="parrafo_aviso">No hay trabajos pendientes</p>
          )}
          <div className="btns_adelantar_atrasar">
            <button
              disabled={page2 === 0}
              onClick={() => setPage2((p) => p - 1)}
              className="btn_atrasar"
            >
              ◀
            </button>

            <button
              disabled={trabajosPendientes.length < 10}
              onClick={() => setPage2((p) => p + 1)}
              className="btn_adelantar"
            >
              ▶
            </button>
          </div>
        </section>
        <section className="trabajos_pendientes_finalizados_container">
          <h2 className="titulo_trabajos" >TRABAJOS FINALIZADOS</h2>
          <hr></hr>
          {trabajosFinalizados.length > 0 ? (trabajosFinalizados.map(trabajo => (
            <TrabajoCardContratados key={trabajo.id} trabajo={trabajo} tipo={"finalizado"} />
          ))) : (
            <p className="parrafo_aviso">No hay trabajos finalizados</p>
          )}
          <div className="btns_adelantar_atrasar">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="btn_atrasar"
            >
              ◀
            </button>

            <button
              disabled={trabajosPendientes.length < 10}
              onClick={() => setPage((p) => p + 1)}
              className="btn_adelantar"
            >
              ▶
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}