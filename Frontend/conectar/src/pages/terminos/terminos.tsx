import "./terminos.css";
import { useNavigate } from "react-router-dom";

export default function Terminos({ blendText = false }) {
  const navigate = useNavigate();

  return (
    <main className="main-bg">
      <section className={`terms-card ${blendText ? "text-same-as-bg" : ""}`}>
        <header className="terms-header">
          <h1 className="terms-title">Términos y Condiciones</h1>
          <p className="terms-intro">
            Estos son nuestros Términos y Condiciones que rigen el uso de la
            plataforma Conectar, operada por Conectar S.A.
            Al acceder o utilizar la Plataforma, usted acepta cumplir con estos
            Términos en su totalidad. Si no está de acuerdo con estos Términos,
            no utilice la Plataforma.
          </p>
        </header>

        <div className="terms-content">
          <section>
            <h2>ACA VA TODO EL LORE VALEN</h2>
          </section>
        </div>
        <br />
        <button
          className="notfound-btn"
          onClick={() => navigate("/register")}
        >
          Volver al registro
        </button>
      </section>
    </main>
  );
}