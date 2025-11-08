import type { Trabajo } from "../../interfaces/trabajo.ts";
import "./cardTrabajoContratados.css"

interface TrabajoCardProps {
  trabajo: Trabajo;
  tipo: 'finalizado' | 'pendientes';
}

export default function TrabajoCardContratados({ trabajo, tipo }: TrabajoCardProps) {
  return (
    <div className="container_trabajos_card">
      {tipo === "finalizado" ? (
        <div className="trabajos_container_finalizados">
          <div className="trabajos_info_container_finalizados">
            <p>Profesional : {trabajo.profesional.nombre}, {trabajo.profesional.apellido}</p>
            <p>Fecha Finalizado : {trabajo.fechaFinalizado}</p>
            <p>Fecha Pago : {trabajo.fechaPago}</p>
            <p>Monto Final : ${trabajo.montoTotal}</p>
          </div>
          <hr></hr>
        </div>
      ) : (
        <div className="trabajos_container_pendientes">
          <div className="trabajos_info_container_pendientes">
            <p>Profesional : {trabajo.profesional.nombre}, {trabajo.profesional.apellido}</p>
            <p>Fecha Solicitud : {trabajo.fechaSolicitud}</p>
            <p>Monto Actualizado : ${trabajo.montoTotal}</p>
            <button className="btn_finalizar_trabajo">Finalizar Trabajo</button>
          </div>
          <hr></hr>
        </div>
      )}
    </div>
  );
}