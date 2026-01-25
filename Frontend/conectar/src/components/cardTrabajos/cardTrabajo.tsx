import type { Trabajo } from "../../interfaces/trabajo.ts";
import "./cardTrabajo.css"
import ModalTrabajos from "../Modal-trabajos/Modal.tsx";
import "../Modal-trabajos/Modal.css"
import type { FormEvent } from "react";
import { useState, useEffect } from "react";
import ModalDetalles from "./ModalDetalles.tsx";
import ModalExito from "./ModalExito.tsx";

interface TrabajoCardProps {
  trabajo: Trabajo;
  tipo: 'finalizado' | 'pendientes';
}

export default function TrabajoCard({ trabajo, tipo }: TrabajoCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [monto, setMonto] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [montoActual, setMontoActual] = useState<number | null>(trabajo.montoTotal ?? null);

  useEffect(() => {
    setMontoActual(trabajo.montoTotal ?? null);
  }, [montoActual, trabajo.montoTotal]);

  const handleMonto = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsOpen(false);
    setError(null);

    if (monto <= 0) {
      setError("El monto debe ser mayor que 0");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/trabajos/${trabajo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          montoTotal: monto,
          descripcion: trabajo.descripcion
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `Error ${res.status}`);
      }

      const json = await res.json();
      console.log("data trabajos", json)
      const actualizado: Trabajo = json.data;

        // 🔹 Actualizamos el monto del trabajo directamente (esto dispara el useEffect)
        trabajo.montoTotal = actualizado.montoTotal;
        // mostrar modal de éxito
        setShowSuccess(true);

        setMonto(0);
    } catch (err: any) {
      console.error("Error guardando monto:", err);
      setError(err?.message ?? "Error al guardar");
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowSuccess(false);
  };

  return (
    <div className="container_trabajos_card">
      {tipo === "finalizado" ? (
        <div className="trabajos_container_finalizados">
          <div className="trabajos_info_container_finalizados">
            <p>Profesional : {trabajo.profesional.nombre}, {trabajo.profesional.apellido}</p>
            <p>        </p>
            <p>Descripcion : {trabajo.descripcion}</p>
            <div style={{ marginLeft: "auto" }}>
            <button className="btn" onClick={() => setShowDetails(true)}>Ver más</button>
            </div>
          </div>
          <hr></hr>
        </div>
      ) : (
        <div className="trabajos_container_pendientes">
          <div className="trabajos_info_container_pendientes">
            <p>Cliente : {trabajo.cliente.nombre}, {trabajo.cliente.apellido}</p>
            <p>Fecha Solicitud : {trabajo.fechaSolicitud}</p>
            <button className="btn_agregar_monto" onClick={() => setIsOpen(true)}>Modificar Monto del trabajo</button>
          </div>
          <ModalTrabajos isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modificar Monto del trabajo">
            <p>Ingresa el nuevo monto</p>
            {trabajo.montoTotal !== null && (
              <p>El monto actual es ${trabajo.montoTotal ?? "Sin monto"}</p>
            )}
            <form onSubmit={handleMonto}>
              <label>
                Monto Nuevo:
                <input
                  type="number"
                  value={monto === 0 ? "" : monto}
                  onChange={e => setMonto(Number(e.target.value))}
                  min={0}
                  required
                  className="input_plata"
                  />
              </label>
              <label>
                <p>Que vas a hacer?</p>
                <input
                  type="text"
                  value={trabajo.descripcion}
                  placeholder="Descripcion del trabajo a realizar"
                  required
                  className="textarea_descripcion"
                />
              </label>
              {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
              <div style={{ marginTop: "10px" }}>
                <button className="btn" type="submit" disabled={loading}>Enviar</button>
              </div>
            </form>
          </ModalTrabajos>
          <hr></hr>
        </div>
      )}
    {showDetails && (
      <ModalDetalles trabajo={trabajo} isOpen={showDetails} onClose={() => setShowDetails(false)} />
    )}
    {showSuccess && (
      <ModalExito isOpen={showSuccess} onClose={handleCloseModal} />
    )}
    </div>
  );
}