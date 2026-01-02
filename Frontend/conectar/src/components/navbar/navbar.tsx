import logo from "../../../assets/conect_2_1.png";
import { Button } from "../button/Button";
import { useNavigate } from "react-router";
import { useUser } from "../../Hooks/useUser.tsx";
import "./navbar.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const { user } = useUser();


  return (
    <nav className="navbar">
      <div className="logo_container">
        <img
          src={logo}
          alt="Conectar Logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className="right_section">
        <Button onClick={() => navigate("/contact")}>Contacto</Button>

        <div className="nav_buttons">

          {user ? (
            // LOGEADO
            <>
              <Button variant="contained" onClick={() => navigate("/perfil")}>
                Mi Perfil
              </Button>
              <Button variant="contained" onClick={() => navigate("/loginAdmin")}>
                Iniciar sesión Administrador
              </Button>
            </>
          ) : (
            // NO LOGEADO
            <>
              <Button variant="contained" onClick={() => navigate("/register")}>
                Registrarse
              </Button>
              <Button variant="contained" onClick={() => navigate("/login")}>
                Iniciar sesión
              </Button>
              <Button variant="contained" onClick={() => navigate("/loginAdmin")}>
                Iniciar sesión Administrador
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

