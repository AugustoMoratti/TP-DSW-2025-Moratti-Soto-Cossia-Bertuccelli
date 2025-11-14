import React, { useState, useEffect, useMemo } from "react";
import Modal from "react-modal";
import styles from "./ProfileCard.module.css";
import { useNavigate } from "react-router-dom";
import type { ProfileCardProps } from "../../interfaces/profilaPropCard";
import { fetchMe } from "../../services/auth.services.ts";
import type { Usuario } from "../../interfaces/usuario.ts";


const ProfileCard: React.FC<ProfileCardProps> = ({
  id,
  nombre,
  apellido,
  email,
  localidad = "",
  provincia = "",
  fotoUrl,
  tipoPage,
  profesiones,
  habilidades,
  descripcion = "",
  onUpdateDescripcion,
}) => {
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [tempDesc, setTempDesc] = useState(descripcion);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  
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

  const provinciaNombre = useMemo(() => {
    return typeof provincia === "string" ? provincia : provincia?.nombre ?? "";
  }, [provincia]);

  const localidadNombre = useMemo(() => {
    return typeof localidad === "string" ? localidad : localidad?.nombre ?? "";
  }, [localidad]);

  const handleEmpezarTrabajo = async () => {
    setError(null);
    setLoading(true);

    const idProfesional = id;
    try {
      const cliente: Usuario = await fetchMe();
      const idCliente = cliente.id;

      const res = await fetch(`http://localhost:3000/api/trabajos`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cliente: idCliente,
          profesional: idProfesional,
          fechaSolicitud: fechaHoy,
          montoTotal: 0
        })
      });

      if (!res.ok) {
        const text = await res.text().catch(() => null);
        throw new Error(text || `Error ${res.status}`);
      }

      // Si todo salió bien, muestro el modal de confirmación
      setShowModal(true);
    } catch (err: any) {
      console.error("Error guardando trabajo:", err);
      setError(err?.message ?? "Error al solicitar el trabajo");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate(-1);
  };

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
                Argentina, {provinciaNombre}, {localidadNombre}
              </p>
            </div>
          </div>
          <p>Email: {email}</p>
        </div>
        {error && (
          <div style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            {error}
          </div>
        )}
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
              onClick={handleEmpezarTrabajo}
              disabled={loading}
            >
              Contratar
            </button>
          )}

          {/* Modal de confirmación (fuera del ternario) */}
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-card">
                <h2>✅ Usuario contratado</h2>
                <p>Haz contratado a este profesional!</p>
                <button className="notfound-btn" onClick={handleCloseModal}>
                  Ir atrás
                </button>
              </div>
            </div>
          )}

          {tipoPage !== 'suPerfil' && (
            <button
              type="button"
              className={styles.btn_direccion}
              onClick={() => navigate(`/trabajosContratados`)}
            >
              Trabajos Contratados
            </button>
          )}


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

        </div>
      </section>
    </div>
  );
};

export default ProfileCard;