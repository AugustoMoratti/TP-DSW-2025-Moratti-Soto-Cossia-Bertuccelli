import type { Trabajo } from "../../interfaces/trabajo.ts";
import "./cardTrabajo.css"

interface TrabajoCardProps {
  trabajo: Trabajo;
  tipo: string;
}

export default function TrabajoCard({ trabajo, tipo }: TrabajoCardProps) {
  return (
    <div>
      {tipo === "finalizado" ? (
        <div>
          <p>Cliente : {trabajo.cliente.nombre}, {trabajo.cliente.apellido}</p>
          <p>Fecha Finalizado : {trabajo.fechaFinalizado}</p>
          <p>Fecha Pago : {trabajo.fechaPago}</p>
        </div>
      ) : (
        <div>
          <p>Cliente : {trabajo.cliente.nombre}, {trabajo.cliente.apellido}</p>
          <p>Fecha Solicitud : {trabajo.fechaFinalizado}</p>
          <button>Agregar Monto del trabajo</button>
        </div>
      )}
    </div>
  );
}