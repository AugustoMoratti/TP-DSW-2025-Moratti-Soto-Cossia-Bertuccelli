import React, { useState, useEffect } from "react";
import styles from "./ProfileCard.module.css";
import { useNavigate } from "react-router-dom";
import type { ProfileCardProps } from "../../interfaces/profilaPropCard.ts";

const ProfileCard: React.FC<ProfileCardProps> = ({
  nombre,
  apellido,
  email,
  localidad,
  provincia,
  fotoUrl,
  tipoPage,
  trabajos,
  descripcion = '',
  onUpdateDescripcion,
}) => {
  const [profesional, setProfesional] = useState<boolean>(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [tempDesc, setTempDesc] = useState(descripcion);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const saved = localStorage.getItem("esProfesional");
    if (saved) setProfesional(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("esProfesional", String(profesional));
  }, [profesional]);

  useEffect(() => {
    if (descripcion !== undefined) { 
      setTempDesc(descripcion);
    }
  }, [descripcion]);

  const handleSaveDesc = async () => {
    if (tempDesc.length > 250) return;
    
    setIsSaving(true);
    try {
      if (onUpdateDescripcion) {
        await onUpdateDescripcion(tempDesc);
        setTempDesc(tempDesc);
        setIsEditingDesc(false); 
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      setIsEditingDesc(true);
    } finally {
      setIsSaving(false);
    }
    setIsEditingDesc(false);
  };

  const handleCancelEdit = () => {
    setTempDesc(descripcion ?? ''); 
    setIsEditingDesc(false);
  };

  return (
    <div className={styles.profile_container}>
      <h2 className={styles.saludo}>Hola {nombre} 👋!</h2>
      <section className={styles.profile_header}>
        <div className={styles.profile_info}>
          <div className={styles.nombre_foto_perfil}>
            <img 
              src={fotoUrl ? `http://localhost:3000${fotoUrl}` : '/default-avatar.png'} 
              alt={`Foto de perfil de ${nombre}`} 
              className={styles.foto_perfil} 
            />
            <div className={styles.usuario_info}>
              <h3>{nombre} {apellido}</h3>
              <p className={styles.ubicacion}>Argentina, {provincia}, {localidad}</p>
            </div>
          </div>
          <p>Email: {email}</p>
        </div>
        <div className={styles.botones_verticales}>
          {tipoPage === "miPerfil"
            ? <button className={styles.btn_direccion} onClick={() => navigate("/modificarPerfil")}>Modificar Perfil</button>
            : <button className={styles.btn_direccion} onClick={() => navigate("/empezarTrabajo")}>Contratar</button>
          }
          {tipoPage === "miPerfil"
            ? <button
              className={`${styles.btn_direccion} ${profesional ? "active" : ""}`}
              onClick={() => setProfesional(!profesional)}>
              {profesional ? "Soy profesional ✅" : "Soy profesional"}
            </button>
            : <button className={styles.btn_direccion} onClick={() => navigate("/verTrabajos")}>Ver trabajos</button>
          }
        </div>
      </section>

      <section className={`${styles.slide_section} ${(profesional || isEditingDesc) ? styles.open : ''}`}>
        <div className={`${styles.slide_content} ${(profesional || isEditingDesc) ? styles.visible : ''}`}>
          <section className={styles.profile_section}>
            <div className={styles.section_header}>
              <h4>Sobre mí</h4>
              {tipoPage === "miPerfil" && (
                <button 
                  className={styles.edit_btn}
                  onClick={isEditingDesc ? handleCancelEdit : () => setIsEditingDesc(true)}
                >
                  {isEditingDesc ? 'Cancelar' : 'Editar'}
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
                <p style={{ color: tempDesc.length > 250 ? 'red' : undefined }}>
                  {tempDesc.length}/250
                  {tempDesc.length > 250 ? ' — Límite excedido' : ''}
                </p>
                <button 
                  className={styles.save_btn}
                  onClick={handleSaveDesc}
                  disabled={tempDesc.length > 250 || isSaving}
                >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            ) : (
              <p>{tempDesc || 'No hay descripción'}</p>
            )}
          </section>

          <section className={styles.profile_section}>
            <h4>Habilidades & Servicios</h4>
            <div className={styles.skills}>
              {["React", "TypeScript", "Diseño UI", "Prototipado", "Figma", "Node"].map(
                (skill) => (
                  <span key={skill} className={styles.skill_tag}>
                    {skill}
                  </span>
                )
              )}
            </div>
          </section>

          <section className={styles.profile_section}>
            <h4>Reseñas por servicio</h4>
            <div className={styles.reviews}>
              <div className={styles.review_item}>
                <span>Diseño landing</span>
                <span className={styles.stars}>★★★★☆</span>
              </div>
              <div className={styles.review_item}>
                <span>Implementación React</span>
                <span className={styles.stars}>★★★★★</span>
              </div>
              <div className={styles.review_item}>
                <span>Auditoría UX</span>
                <span className={styles.stars}>★★★★☆</span>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className={styles.profile_section}>
        {profesional ? <h4>Historial de Trabajos Realizados</h4> : <h4>Trabajos Contratados</h4>}
        
        {trabajos && trabajos.length > 0 ? (
          <ul className={styles.historial_trabajo}>
            {trabajos.map((trabajo, index) => (
              <React.Fragment key={index}>
                <li>{trabajo}</li>
                {index < trabajos.length - 1 && <div className={styles.divisor}></div>}
              </React.Fragment>
            ))}
          </ul>
        ) : (
          <p className={styles.no_trabajo}>
            {profesional 
              ? "Todavía no realizó ningún trabajo" 
              : "Todavía no contrataste a ningún profesional"}
          </p>
        )}
      </section>
      <div>
        <button className={styles.btn_contratado} onClick={() => navigate("/misTrabajos")}> Mis Trabajos </button>
      </div>
    </div>
  );
};

export default ProfileCard;
