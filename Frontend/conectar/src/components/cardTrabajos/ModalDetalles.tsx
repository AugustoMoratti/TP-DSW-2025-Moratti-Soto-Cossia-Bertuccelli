import React from "react";
import ModalTrabajos from "../Modal-trabajos/Modal";
import type { Trabajo } from "../../interfaces/trabajo";

interface Props {
  trabajo: Trabajo;
  isOpen: boolean;
  onClose: () => void;
  isSuccess?: boolean;
  successMessage?: string;
}

const ModalDetalles: React.FC<Props> = ({ trabajo, isOpen, onClose, isSuccess = false, successMessage }) => {
  const msg = successMessage ?? "¡Trabajo finalizado exitosamente!";

  if (isSuccess) {
    return (
      <ModalTrabajos isOpen={isOpen} onClose={onClose} title={`Trabajo #${trabajo.id} — Éxito`}>
        <div style={{ padding: 10, background: "#d4edda", color: "#155724", borderRadius: 6 }}>
          {msg}
        </div>
      </ModalTrabajos>
    );
  }

  return (
    <ModalTrabajos isOpen={isOpen} onClose={onClose} title={`Trabajo #${trabajo.id} — Detalles`}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <p><strong>Profesional:</strong> {trabajo.profesional?.nombre} {trabajo.profesional?.apellido}</p>
        <p><strong>Cliente:</strong> {trabajo.cliente?.nombre} {trabajo.cliente?.apellido}</p>
        <p><strong>Descripción del trabajo por el profesional:</strong> {trabajo.descripcion ?? "—"}</p>
        <p><strong>Reseña del cliente:</strong> {trabajo.resenia?.descripcion ?? "—"}</p>
        <p><strong>Monto total:</strong> ${trabajo.montoTotal ?? 0}</p>
        <p><strong>Fecha solicitud:</strong> {trabajo.fechaSolicitud ?? "—"}</p>
        <p><strong>Fecha finalizado:</strong> {trabajo.fechaFinalizado ?? "—"}</p>
        <p><strong>Fecha pago:</strong> {trabajo.fechaPago ?? "—"}</p>
      </div>
    </ModalTrabajos>
  );
};

export default ModalDetalles;
