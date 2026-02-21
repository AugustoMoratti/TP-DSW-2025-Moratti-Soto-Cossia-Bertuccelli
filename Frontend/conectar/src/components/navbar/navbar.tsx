import { useRef, useEffect } from "react";
import { animate } from "animejs";
import { Button } from "../button/Button";
import { useNavigate } from "react-router";
import { useUser } from "../../Hooks/useUser";
import { handleLogout } from "../../utils/logout";
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import logo from "../../../assets/conect_2_1.png";
import "./navbar.css";

const Navbar: React.FC = () => {
  const logoRef = useRef<HTMLImageElement | null>(null);
  const errorTimerRef = useRef<number | null>(null);

  const navigate = useNavigate();
  const { user } = useUser();

  // 🔹 Animación del logo
  useEffect(() => {
    const logoEl = logoRef.current;
    if (!logoEl) return;

    const handleEnter = () => {
      animate(logoEl, {
        scale: 1.15,
        duration: 300,
        ease: "out(3)",
      });
    };

    const handleLeave = () => {
      animate(logoEl, {
        scale: 1,
        duration: 300,
        ease: "out(3)",
      });
    };

    logoEl.addEventListener("mouseenter", handleEnter);
    logoEl.addEventListener("mouseleave", handleLeave);

    return () => {
      logoEl.removeEventListener("mouseenter", handleEnter);
      logoEl.removeEventListener("mouseleave", handleLeave);

      // limpiar timer si existe
      if (errorTimerRef.current) {
        window.clearTimeout(errorTimerRef.current);
      }
    };
  }, []);


  const handlerLogout = async () => {
    try {
      const logout = await handleLogout();

      if (!logout) {
        console.error("Error al cerrar sesión");
        return;
      }

      navigate("/login");
    } catch (error) {
      console.error("Error inesperado:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo_container">
        <img ref={logoRef} src={logo} alt="Conectar Logo" className="logo" />
      </div>

      <div className="right_section">
        <Button onClick={() => navigate("/contact")} >
          <ContactPageIcon style={{ marginRight: "10px"}}/> Contacto
        </Button>

        <div className="nav_buttons">
          {user ? (
            // LOGEADO
            <>
              <Button variant="contained" onClick={() => navigate("/perfil")}>
                Mi Perfil
              </Button>

              <Button
                style={{ backgroundColor: "#e74c3c", color: "#fff", border: "none" }}
                onClick={handlerLogout}
              >
                Cerrar Sesión
              </Button>
            </>
          ) : (
            // NO LOGEADO
            <>
              <Button variant="contained" onClick={() => navigate("/register")} >
                <HowToRegIcon style={{ marginRight: "10px"}}/> Registrarse
              </Button>
              <Button variant="contained" onClick={() => navigate("/login")}>
                <LoginIcon style={{ marginRight: "10px"}}/> Iniciar sesión
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/loginAdmin")}
              >
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