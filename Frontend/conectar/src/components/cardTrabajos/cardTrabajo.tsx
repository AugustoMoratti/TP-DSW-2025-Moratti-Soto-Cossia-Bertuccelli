import type { Trabajo } from "../../interfaces/trabajo.ts";
import "./cardTrabajo.css"
import ModalTrabajos from "../Modal-trabajos/Modal.tsx";
import "../Modal-trabajos/Modal.css"
import type { FormEvent } from "react";
import { useState, useEffect } from "react";

interface TrabajoCardProps {
  trabajo: Trabajo;
  tipo: 'finalizado' | 'pendientes';
}

export default function TrabajoCard({ trabajo, tipo }: TrabajoCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [monto, setMonto] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [montoActual, setMontoActual] = useState<number | null>(trabajo.montoTotal ?? null);

  useEffect(() => {
    setMontoActual(trabajo.montoTotal ?? null);
  }, [montoActual, trabajo.montoTotal]);

  const handleMonto = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Formulario enviado");
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
        body: JSON.stringify({ montoTotal: monto }),
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

      setMonto(0);
    } catch (err: any) {
      console.error("Error guardando monto:", err);
      setError(err?.message ?? "Error al guardar");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container_trabajos_card">
      {tipo === "finalizado" ? (
        <div className="trabajos_container_finalizados">
          <div className="trabajos_info_container_finalizados">
            <p>Cliente : {trabajo.cliente.nombre}, {trabajo.cliente.apellido}</p>
            <p>Fecha Finalizado : {trabajo.fechaFinalizado}</p>
            <p>Fecha Pago : {trabajo.fechaPago}</p>
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
              <p>El monto actual es = ${trabajo.montoTotal ?? "Sin monto"}</p>
            )}
            <form onSubmit={handleMonto}>
              <label>
                Monto Nuevo
                <input
                  type="number"
                  value={monto === 0 ? "" : monto}
                  onChange={e => setMonto(Number(e.target.value))}
                  min={0}
                  required
                  style={{ marginLeft: "10px" }} />
              </label>
              {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
              <div style={{ marginTop: "10px" }}>
                <button type="submit" disabled={loading}>Enviar</button>
              </div>
            </form>
          </ModalTrabajos>
          <hr></hr>
        </div>
      )}
    </div>
  );
}