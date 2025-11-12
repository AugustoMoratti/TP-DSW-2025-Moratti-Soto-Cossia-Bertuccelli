import React, { useState, useEffect, useMemo } from "react";
import Modal from "react-modal";
import styles from "./ProfileCard.module.css";
import { useNavigate } from "react-router-dom";
import type { ProfileCardProps } from "../../interfaces/profilaPropCard";
import ModalTrabajos from "../Modal-trabajos/Modal.tsx";
import { fetchMe } from "../../services/auth.services.ts";
import type { Usuario } from "../../interfaces/usuario.ts";
import type { FormEvent } from "react";

const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  nombre,
  apellido,
  email,
  localidad,
  provincia,
  fotoUrl,
  tipoPage,
  profesiones,
  habilidades,
  trabajos,
  descripcion = "",
  onUpdateDescripcion,
}) => {
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [tempDesc, setTempDesc] = useState(descripcion);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [monto, setMonto] = useState<number>();
  const navigate = useNavigate();

  // Evitar error de accesibilidad de react-modal en SSR o tests
  useEffect(() => {
    try {
      Modal.setAppElement("#root");
    } catch {
      /* Ignorar errores en entornos sin DOM */
    }
  }, []);

  // Actualiza la descripción temporal cuando cambia la original
  useEffect(() => {
    setTempDesc(descripcion ?? "");
  }, [descripcion]);

  const hoy = new Date().toISOString().slice(0, 10);
  const fechaHoy = useMemo(() => {
    const [year, month, day] = hoy.split("-");
    return `${day}/${month}/${year}`;
  }, [hoy]);

  const handleEmpezarTrabajo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert("Formulario enviado");
    setIsOpen(false);
    setError(null);

    const idProfesional = id

    const cliente: Usuario = await fetchMe()

    const idCliente = cliente.id

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/trabajos`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          montoTotal: monto,
          cliente: idCliente,
          profesional: idProfesional,
          fechaSolicitud: fechaHoy
        })
      })

      if (!res.ok) {
        console.log("Ocurrio un error al cargar un trabajo")
        const text = await res.text().catch(() => null);
        throw new Error(text || `Error ${res.status}`);
      }
    } catch (err: any) {
      console.error("Error guardando monto:", err);
      setError(err?.message ?? "Error al guardar la resenia")
    } finally {
      setLoading(false)
    }
  }


  const handleSaveDesc = async () => {
    if (tempDesc.length > 250) return;
    setIsSaving(true);
    try {
      if (onUpdateDescripcion) await onUpdateDescripcion(tempDesc.trim());
      setIsEditingDesc(false);
    } catch (error) {
      console.error("Error al guardar descripción:", error);
      setIsEditingDesc(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setTempDesc(descripcion ?? "");
    setIsEditingDesc(false);
  };

  const fotoSrc = fotoUrl ? `http://localhost:3000${fotoUrl}` : "/default-avatar.png";

  return (
    <div className={styles.profile_container}>
      <h2 className={styles.saludo}>Hola {nombre} 👋!</h2>

      {/* Header */}
      <section className={styles.profile_header}>
        <div className={styles.profile_info}>
          <div className={styles.nombre_foto_perfil}>
            <img
              src={fotoSrc}
              alt={`Foto de perfil de ${nombre} ${apellido ?? ""}`}
              className={styles.foto_perfil}
            />
            <div className={styles.usuario_info}>
              <h3>
                {nombre} {apellido}
              </h3>
              <p className={styles.ubicacion}>
                Argentina, {provincia}, {localidad}
              </p>
            </div>
          </div>
          <p>Email: {email}</p>
        </div>

        <div className={styles.botones_verticales}>

          {tipoPage === "miPerfil" ? (
            <button
              type="button"
              className={styles.btn_direccion}
              onClick={() => navigate(`/ModPerfil/${id}`)}
            >
              Modificar Perfil
            </button>
          ) : (
            <button
              type="button"
              className={styles.btn_direccion}
              onClick={() => setIsOpen(true)}
            >
              Contratar
            </button>

          )}
          {tipoPage !== 'suPerfil' && (
            <button
              type="button"
              className={styles.btn_direccion}
              onClick={() => navigate(`/trabajosContratados/${id}`)}
            >
              Trabajos Contratados
            </button>
          )}

          <ModalTrabajos isOpen={isOpen} onClose={() => setIsOpen(false)} title="Finalizar Trabajo">
            <p>Ingresa datos para dar el trabajo como finalizado</p>
            <form onSubmit={handleEmpezarTrabajo} style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "300px" }}>
              <label>
                Monto
                <input
                  type="number"
                  onChange={(e) => setMonto(Number(e.target.value))}
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


          {tipoPage !== 'suPerfil' && (
            <button
              type="button"
              className={styles.btn_direccion}
              onClick={() => navigate("/trabajosPropios")}
            >
              Trabajos Propios
            </button>
          )}
        </div>
      </section>

      {/* Contenido expandible */}
      <section
        className={`${styles.slide_section} ${tipoPage === "miPerfil" || tipoPage === "suPerfil" || isEditingDesc ? styles.open : ""
          }`}
      >
        <div
          className={`${styles.slide_content} ${tipoPage === "miPerfil" || tipoPage === "suPerfil" || isEditingDesc ? styles.visible : ""
            }`}
        >
          {/* Sobre mí */}
          <section className={styles.profile_section}>
            <div className={styles.section_header}>
              <h4>Sobre mí</h4>
              {tipoPage === "miPerfil" && (
                <button
                  type="button"
                  className={styles.edit_btn}
                  onClick={isEditingDesc ? handleCancelEdit : () => setIsEditingDesc(true)}
                  disabled={isSaving}
                >
                  {isEditingDesc ? "Cancelar" : "Editar"}
                </button>
              )}
            </div>

            {isEditingDesc ? (
              <div className={styles.edit_desc}>
                <textarea
                  value={tempDesc}
                  onChange={(e) => setTempDesc(e.target.value)}
                  placeholder="Escribe una descripción sobre ti..."
                  rows={4}
                  disabled={isSaving}
                />
                <p style={{ color: tempDesc.length > 250 ? "red" : undefined }}>
                  {tempDesc.length}/250
                  {tempDesc.length > 250 ? " — Límite excedido" : ""}
                </p>
                <button
                  type="button"
                  className={styles.save_btn}
                  onClick={handleSaveDesc}
                  disabled={tempDesc.length > 250 || isSaving}
                >
                  {isSaving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            ) : (
              <p>{tempDesc || "No hay descripción"}</p>
            )}
          </section>

          {/* Profesiones */}
          <section className={styles.profile_section}>
            <h4>Profesiones</h4>
            {profesiones && profesiones.length > 0 ? (
              <ul>
                {profesiones.map((profesion) => (
                  <li key={profesion.nombreProfesion} className={styles.profesion_item}>
                    {profesion.nombreProfesion}
                    {profesion.descripcionProfesion && (
                      <small style={{ opacity: 0.7 }}> — {profesion.descripcionProfesion}</small>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay profesiones agregadas.</p>
            )}
          </section>

          {/* Habilidades */}
          <section className={styles.profile_section}>
            <h4>Habilidades</h4>
            {habilidades && habilidades.length > 0 ? (
              <ul>
                {habilidades.map((hab, index) => (
                  <li key={index} className={styles.profesion_item}>
                    {hab}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay habilidades agregadas.</p>
            )}
          </section>

          {/* Trabajos */}
          <section className={styles.profile_section}>
            <h4>{tipoPage === "miPerfil" ? "Historial de Trabajos Realizados" : "Trabajos Contratados"}</h4>

            {trabajos && trabajos.length > 0 ? (
              <ul className={styles.historial_trabajo}>
                {trabajos.map((trabajo, index) => (
                  <React.Fragment key={index}>
                    <li>
                      <strong>{trabajo.fechaFinalizado || "Fecha no disponible"}</strong> —{" "}
                      {trabajo.cliente?.nombre} {trabajo.cliente?.apellido} —{" "}
                      {trabajo.resenia
                        ? `"${trabajo.resenia.descripcion}" (${trabajo.resenia.valor}/5)`
                        : "Sin reseña"}
                    </li>
                    {index < trabajos.length - 1 && <div className={styles.divisor} />}
                  </React.Fragment>
                ))}
              </ul>
            ) : (
              <p className={styles.no_trabajo}>
                {tipoPage === "miPerfil"
                  ? "Todavía no contrataste a ningún profesional"
                  : "Todavía no realizó ningún trabajo"}
              </p>
            )}
          </section>
        </div>
      </section>
    </div>
  );
};

export default ProfileCard;
