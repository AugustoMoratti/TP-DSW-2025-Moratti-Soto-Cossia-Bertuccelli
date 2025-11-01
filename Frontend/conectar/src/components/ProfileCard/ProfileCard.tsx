import React, { useState, useEffect } from "react";
import styles from "./ProfileCard.module.css";
import { useNavigate } from "react-router";

interface ProfileCardProps {
  nombre: string;
  apellido: string;
  email: string;
  imagenPerfil?: string;
  localidad?: string;
  provincia?: string;
  fotoUrl?: string;
  tipoPage?: "miPerfil" | "suPerfil"
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  nombre,
  apellido,
  email,
  localidad,
  provincia,
  fotoUrl,
  tipoPage
}) => {
  const [profesional, setProfesional] = useState<boolean>(false);
  const Navigate = useNavigate()

  useEffect(() => {
    const saved = localStorage.getItem("esProfesional");
    if (saved) setProfesional(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("esProfesional", String(profesional));
  }, [profesional]);

  return (
    <div className={styles.profile_container}>
      <h2 className={styles.saludo}>Hola {nombre} 👋!</h2> 
      <section className={styles.profile_header}>
        <div className={styles.profile_info}>
          <div className={styles.nombre_foto_perfil}>
            <img src={`http://localhost:3000${fotoUrl}`} alt="" className={styles.foto_perfil} />
            <div className={styles.usuario_info}>
              <h3>{nombre} {apellido}</h3>
              <p className={styles.ubicacion}>Argentina, {provincia}, {localidad}</p>
            </div>
          </div>
          <p>Email: {email}</p>
        </div>
        <div className={styles.botones_verticales}>
          {tipoPage === "miPerfil"
            ? <button className={styles.btn_direccion} onClick={() => Navigate("/modificarPerfil")}>Modificar Perfil</button>
            : <button className={styles.btn_direccion} onClick={() => Navigate("/empezarTrabajo")}>Ver Trabajos / Contratar</button>
          }
          <button
            className={`${styles.btn_direccion} ${profesional ? "active" : ""}`}
            onClick={() => setProfesional(!profesional)}
          >
            {profesional ? "Soy profesional ✅" : "Soy profesional"}
          </button>
        </div>
      </section>

      <section className={styles.profile_section}>
        <h4>Sobre mí</h4>
        <p>Breve descripción profesional...</p>
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
        <h4>Educación</h4>
        <p>Institución: Título / Año</p>
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
  );
};

export default ProfileCard;
