import type { Trabajo } from "../../interfaces/trabajo.ts";
import "./cardTrabajoContratados.css"
import ModalTrabajos from "../Modal-trabajos/Modal.tsx";
import "../Modal-trabajos/Modal.css"
import { useState, useMemo, useEffect } from "react";
import type { FormEvent } from "react";
import type { Resenia } from "../../interfaces/resenia.ts";

interface TrabajoCardProps {
  trabajo: Trabajo;
  tipo: 'finalizado' | 'pendientes';
}

export default function TrabajoCardContratados({ trabajo, tipo }: TrabajoCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fechaPago, setFechaPago] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valor, setValor] = useState(0);
  const [hover, setHover] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [actualizado, setActualizado] = useState<Trabajo>(trabajo);

  useEffect(() => {
    setActualizado(trabajo);
  }, [trabajo]);

  useEffect(() => {
    console.log("Trabajo actualizado:", actualizado);
  }, [actualizado]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // "2025-10-29"
    if (!value) return setFechaPago(""); // si está vacío
    const [year, month, day] = value.split("-"); // ["2025", "10", "29"]
    const fechaFormateada = `${day}/${month}/${year}`; // "29/10/2025"
    setFechaPago(fechaFormateada);
  };

  // fechaHoy en formato DD/MM/YYYY — calculada, no necesita estado
  const hoy = new Date().toISOString().slice(0, 10);
  const fechaHoy = useMemo(() => {
    const [year, month, day] = hoy.split("-");
    return `${day}/${month}/${year}`;
  }, [hoy]);

  const handleFinalizarTrabajo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert("Formulario enviado");
    setIsOpen(false);
    setError(null);
    setLoading(true);

    let resenia: Resenia | undefined;
    try {
      const res = await fetch(`http://localhost:3000/api/resenia`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ valor: valor, descripcion: descripcion, trabajo: trabajo.id }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `Error ${res.status}`);
      }

      const data = await res.json();
      resenia = data.data as Resenia
      console.log("Respuesta del servidor:", resenia);

    } catch (err: any) {
      console.error("Error guardando monto:", err);
      setError(err?.message ?? "Error al guardar la resenia")
    } finally {
      setLoading(false)
    }

    if (!resenia) {
      // no continuar si no hay resenia
      console.warn("No se creó la reseña, abortando la actualización del trabajo.");
      return; // o manejarlo de otra forma
    }

    setLoading(true)
    try {
      const resp = await fetch(`http://localhost:3000/api/trabajos/${trabajo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fechaFinalizado: fechaHoy, fechaPago: fechaPago, resenia: resenia.id }),
      })
      if (!resp.ok) {
        const text = await resp.text().catch(() => null);
        throw new Error(text || `Error ${resp.status}`);
      }
      const data = await resp.json();
      setActualizado(data.data as Trabajo);
    } catch (err: any) {
      console.error("Error guardando monto:", err);
      setError(err?.message ?? "Error al guardar la resenia")
    } finally {
      setLoading(false)
    }
  }

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
            {trabajo.montoTotal === undefined && (
              <button className="btn_finalizar_trabajo" onClick={() => alert("Aun no hay un monto Final")}>Finalizar Trabajo</button>
            )}
            {trabajo.montoTotal !== undefined && (
              <button className="btn_finalizar_trabajo" onClick={() => setIsOpen(true)}>Finalizar Trabajo</button>
            )}
          </div>

          <ModalTrabajos isOpen={isOpen} onClose={() => setIsOpen(false)} title="Finalizar Trabajo">
            <p>Ingresa datos para dar el trabajo como finalizado</p>
            <form onSubmit={handleFinalizarTrabajo} style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "300px" }}>
              <label>
                Fecha del Pago
                <input
                  type="date"
                  onChange={handleChange}
                  max={hoy}
                  required
                  style={{ marginLeft: "10px" }} />
              </label>
              <label>
                Valoración
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= (hover || valor) ? "filled" : "empty"}
                      onClick={() => setValor(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                    >
                      ★
                    </span>
                  ))}
                  {/* Campo oculto para enviar el valor dentro del form */}
                  <input type="hidden" name="rating" value={valor} />
                </div>
              </label>
              <label>
                Comentario:
                <textarea
                  name="comentario"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Escribe tu reseña..."
                  required
                  style={{ width: "100%", height: "80px", resize: "none" }}
                />
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