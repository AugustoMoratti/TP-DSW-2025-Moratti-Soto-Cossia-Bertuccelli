import Header from "../../components/header/header.tsx";
import CreatePerfilAdmin from "./createPerfil.tsx";
import SolicProfesiones from "./profesiones.tsx";
import "./dashboard.css";


export default function Dashboard() {

  return (
    <div className="dashboard-page">
      <Header bgColor="#ffffff" logoSrc="/assets/conect_2_1.png" >
        <button className="header-btn">Home</button>
      </Header>
      <div className="maindash-container">
        <div className="acciones-1">
          <button className="action-btn">Provincias</button>
          <button className="action-btn">Localidad</button>
          <button className="action-btn">Usuarios</button>
          <button className="action-btn">Profesiones</button>
        </div>
        <div className="acciones-2">
          <div className="container-solic">
            <SolicProfesiones />
          </div>
          <div className="container-createperfiles">
            <CreatePerfilAdmin />
          </div>
        </div>
      </div>
    </div>
  )
};