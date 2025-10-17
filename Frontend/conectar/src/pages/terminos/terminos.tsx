import styles from "./terminos.module.css";
import { useNavigate } from "react-router-dom";

export default function Terminos({ blendText = false }) {
  const navigate = useNavigate();

  return (
    <main className={styles.mainBg}>
      <section className={`${styles.termsCard} ${blendText ? styles.textSameAsBg : ""}`}>
        <header className={styles.termsHeader}>
          <h1 className={styles.termsTitle}>Términos y Condiciones</h1>
          <p className={styles.termsIntro}>
            Estos son nuestros Términos y Condiciones que rigen el uso de la
            plataforma Conectar, operada por Conectar S.A. Al acceder o
            utilizar la Plataforma, usted acepta cumplir con estos Términos en su
            totalidad. Si no está de acuerdo con estos Términos, no utilice la
            Plataforma.
          </p>
        </header>

        <div className={styles.termsContent}>
          <section>
            <h2>ACA VA TODO EL LORE VALEN</h2>
          </section>
        </div>

        <br />
        <button className={styles.btn} onClick={() => navigate("/register")}>
          Volver al registro
        </button>
      </section>
    </main>
  );
}