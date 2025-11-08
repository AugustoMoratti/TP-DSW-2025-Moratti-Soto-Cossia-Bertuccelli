import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./ProfileCard.module.css";
import { useNavigate } from "react-router-dom";
import type { ProfileCardProps } from "../../interfaces/profilaPropCard";

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
              onClick={() => navigate("/empezarTrabajo")}
            >
              Contratar
            </button>
          )}
        </div>
      </section>

      {/* Contenido expandible */}
      <section
        className={`${styles.slide_section} ${
          tipoPage === "miPerfil" || isEditingDesc ? styles.open : ""
        }`}
      >
        <div
          className={`${styles.slide_content} ${
            tipoPage === "miPerfil" || isEditingDesc ? styles.visible : ""
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

          {/* Botón inferior */}
          <div className={styles.bottom_section}>
            <button
              type="button"
              className={styles.btn_contratado}
              onClick={() => navigate("/trabajos")}
            >
              Mis Trabajos
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileCard;
