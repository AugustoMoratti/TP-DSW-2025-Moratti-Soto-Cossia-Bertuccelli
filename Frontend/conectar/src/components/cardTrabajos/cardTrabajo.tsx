import type { Trabajo } from "../../interfaces/trabajo.ts";
import "./cardTrabajo.css"
import ModalTrabajos from "../Modal-trabajos/Modal.tsx";
import "../Modal-trabajos/Modal.css"
import type { FormEvent } from "react";
import { useState } from "react";
import ModalDetalles from "./ModalDetalles.tsx";
import ModalExito from "./ModalExito.tsx";

interface TrabajoCardProps {
  trabajo: Trabajo;
  tipo: 'finalizado' | 'pendientes';
  onCancel?: (id: number) => void;
}

export default function TrabajoCard({ trabajo, tipo, onCancel }: TrabajoCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [monto, setMonto] = useState<number>(0);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
  const [canceled, setCanceled] = useState(false);


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
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `Error ${res.status}`);
      }

      const json = await res.json();
      console.log("data trabajos", json)
      const actualizado: Trabajo = json.data;

      trabajo.montoTotal = actualizado.montoTotal;
      setShowSuccess(true);
      setMonto(0);
    } catch (err: any) {
      console.error("Error guardando monto:", err);
      setError(err?.message ?? "Error al guardar");
    } finally {
      setLoading(false)
    }
  }

  const handleCancelTrabajo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCancelError(null);

    if (!cancelReason.trim()) {
      setCancelError("El motivo es obligatorio");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/trabajos/${trabajo.id}?motivo=${encodeURIComponent(cancelReason)}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `Error ${res.status}`);
      }

      setCanceled(true);
      setShowCancelSuccess(true);
      setCancelReason("");
      if (onCancel) onCancel(trabajo.id);
      setIsCancelOpen(false);
    } catch (err: any) {
      console.error("Error cancelando trabajo:", err);
      setCancelError(err?.message ?? "Error al cancelar el trabajo");
    } finally {
      setLoading(false);
    }
  }

  const handleCloseModal = () => {
    setShowSuccess(false);
  };

  const handleCloseCancelSuccess = () => {
    setShowCancelSuccess(false);
  };

  if (canceled) {
    return null;
  }

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
            <div>
              <p>Cliente : {trabajo.cliente.nombre}, {trabajo.cliente.apellido}</p>
              <p>Fecha Solicitud : {trabajo.fechaSolicitud}</p>
            </div>
            <div className="trabajo_botones_pendientes">
              <button className="btn_agregar_monto" onClick={() => setIsOpen(true)}>Modificar Monto del trabajo</button>
              <button className="btn_cancelar_trabajo" onClick={() => setIsCancelOpen(true)}>Cancelar trabajo</button>
            </div>
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
              {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
              <div style={{ marginTop: "10px" }}>
                <button className="btn" type="submit" disabled={loading}>Enviar</button>
              </div>
            </form>
          </ModalTrabajos>

          <ModalTrabajos isOpen={isCancelOpen} onClose={() => setIsCancelOpen(false)} title="Cancelar trabajo">
            <p>Indica el motivo por el cual quieres cancelar este trabajo.</p>
            <form onSubmit={handleCancelTrabajo}>
              <label>
                Motivo de cancelación:
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={4}
                  required
                  className="textarea_descripcion"
                  />
              </label>
              {cancelError && <p style={{ color: "red", marginTop: 8 }}>{cancelError}</p>}
              <div style={{ marginTop: "10px" }}>
                <button className="btn" type="submit" disabled={loading}>Cancelar trabajo</button>
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
    {showCancelSuccess && (
      <ModalTrabajos isOpen={showCancelSuccess} onClose={handleCloseCancelSuccess} title="Trabajo cancelado">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h2>✅ Trabajo cancelado</h2>
          <p>El trabajo fue cancelado correctamente.</p>
        </div>
      </ModalTrabajos>
    )}
    </div>
  );
}