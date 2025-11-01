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
  trabajos?: string[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  nombre,
  apellido,
  email,
  localidad,
  provincia,
  fotoUrl,
  tipoPage,
  trabajos
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
            : <button className={styles.btn_direccion} onClick={() => Navigate("/empezarTrabajo")}>Contratar</button>
          }
          {tipoPage === "miPerfil"
            ? <button
              className={`${styles.btn_direccion} ${profesional ? "active" : ""}`}
              onClick={() => setProfesional(!profesional)}>
              {profesional ? "Soy profesional ✅" : "Soy profesional"}
            </button>
            : <button className={styles.btn_direccion} onClick={() => Navigate("/verTrabajos")}>Ver trabajos</button>
          }
        </div>
      </section>

      <section className={`${styles.slide_section} ${profesional ? styles.open : ''}`}>
        <div className={`${styles.slide_content} ${profesional ? styles.visible : ''}`}>
          <section className={styles.profile_section}>
            <h4>Sobre mí</h4>
            <p>Danos una breve descripción profesional de ti!</p>
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
        <button className={styles.btn_contratado} onClick={() => Navigate("/misTrabajos")}> Mis Trabajos </button>
      </div>
    </div>
  );
};

export default ProfileCard;
