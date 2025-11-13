import { useState } from "react";
import Header from "../../components/header/header.tsx";
import SolicProfesiones from "./profesiones.tsx";
import Provincias from "../../components/admin/provincia/provincia.tsx"
import Localidades from "../../components/admin/localidad/localidad.tsx"
import Usuarios from "../../components/admin/provincia/provincia.tsx"
import "./dashboard.css";

type Page = "provincias" | "localidades" | "usuarios" | "profesiones";

export default function Dashboard() {
  const [active, setActive] = useState<Page>("profesiones");

  const renderContent = () => {
    switch (active) {
      case "provincias":
        return <Provincias />;
      case "localidades":
        return <Localidades />;
      case "usuarios":
        return <Usuarios />;
      case "profesiones":
      default:
        return <SolicProfesiones />;
    }
  };

  return (
    <div className="dashboard-page">
      <Header bgColor="#ffffff" logoSrc="/assets/conect_2_1.png" />
      <div className="maindash-container">
        <div className="acciones-1">
          <button
            className={`action-btn ${active === "provincias" ? "active" : ""}`}
            onClick={() => setActive("provincias")}
            aria-pressed={active === "provincias"}
          >
            Provincias
          </button>

          <button
            className={`action-btn ${active === "localidades" ? "active" : ""}`}
            onClick={() => setActive("localidades")}
            aria-pressed={active === "localidades"}
          >
            Localidad
          </button>

          <button
            className={`action-btn ${active === "usuarios" ? "active" : ""}`}
            onClick={() => setActive("usuarios")}
            aria-pressed={active === "usuarios"}
          >
            Usuarios
          </button>

          <button
            className={`action-btn ${active === "profesiones" ? "active" : ""}`}
            onClick={() => setActive("profesiones")}
            aria-pressed={active === "profesiones"}
          >
            Profesiones
          </button>
        </div>

        <div className="acciones-2">
          <div className="container-solic">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}