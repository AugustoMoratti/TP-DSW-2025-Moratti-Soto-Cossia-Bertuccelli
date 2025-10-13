import "./header.css";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-container">
        <img src="../../assets/conect_2_1.png" alt="Logo" className="logo" /> 
        <nav className="header-btns">
          <button className="header-btn" type="button" onClick={() => navigate("/perfil")}>Mi Perfil</button>
          <button className="header-btn" type="button" onClick={() => navigate("/admin")}>Admin</button>
        </nav>
      </div>
    </header>

  )
};