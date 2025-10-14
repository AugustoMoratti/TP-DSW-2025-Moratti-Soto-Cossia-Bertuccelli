import { useNavigate } from "react-router-dom";
import './InternalServerError.css';
import Header from "../../components/header/header.tsx";

export default function InternalServerError() {
  const navigate = useNavigate();

  return (

    <section className="notfound-bg">
      <Header bgColor="#ffffffff" logoSrc="/assets/conect_2_1.png" />
      <div className="notfound-card">
        <p className="notfound-error">500 Error</p>
        <h1 className="notfound-title">Internal Server Error</h1>
        <p className="notfound-desc">
          Perdon, tuvimos un problema con el servidor
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