import React from "react";
import "./ProfileCard.css";

const ProfileCard: React.FC = () => {
  return (
    <div className="profile-container">
      <section className="profile-header">
        <div className="avatar"></div>
        <div className="profile-info">
          <h3>Nombre Apellido</h3>
          <p>Ubicación: Disponible</p>
          <button className="btn-secondary">Soy profesional</button>
        </div>
        <button className="btn-primary">Solicitar profesión</button>
      </section>

      <section className="profile-section">
        <h4>Sobre mí</h4>
        <p>Breve descripción profesional...</p>
      </section>

      <section className="profile-section">
        <h4>Habilidades & Servicios</h4>
        <div className="skills">
          {["React", "TypeScript", "Diseño UI", "Prototipado", "Figma", "Node"].map(skill => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </section>

      <section className="profile-section">
        <h4>Educación</h4>
        <p>Institución: Título / Año</p>
      </section>

      <section className="profile-section">
        <h4>Reseñas por servicio</h4>
        <div className="reviews">
          <div className="review-item">
            <span>Diseño landing</span>
            <span className="stars">★★★★☆</span>
          </div>
          <div className="review-item">
            <span>Implementación React</span>
            <span className="stars">★★★★★</span>
          </div>
          <div className="review-item">
            <span>Auditoría UX</span>
            <span className="stars">★★★★☆</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileCard;
