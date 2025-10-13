import { useNavigate } from "react-router-dom";
import './notFound.css';
import Header from "../../components/header/header.tsx";

export default function NotFound() {
  const navigate = useNavigate();

  return (

    <section className="notfound-bg">
      <Header />
      <div className="notfound-card">
        <p className="notfound-error">404 Error</p>
        <h1 className="notfound-title">No pudimos encontrar la pagina</h1>
        <p className="notfound-desc">
          Perdon, la pagina que esta buscando no existe o tiene otro link.
        </p>
        <button
          className="notfound-btn"
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </button>
      </div>
    </section>
  );
}