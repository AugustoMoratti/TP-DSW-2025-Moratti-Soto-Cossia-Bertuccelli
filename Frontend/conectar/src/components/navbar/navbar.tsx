import { useRef, useEffect } from "react";
import { animate } from "animejs";
import { Button } from "../button/Button";
import { useNavigate } from "react-router";
import { useUser } from "../../Hooks/useUser.tsx";
import { handleLogout } from "../../utils/logout.ts";
import logo from "../../../assets/conect_2_1.png";
import "./navbar.css";

const Navbar: React.FC = () => {
  const logoRef = useRef<HTMLImageElement | null>(null);

  const navigate = useNavigate();

  const { user } = useUser();

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
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="logo_container">
        <img ref={logoRef} src={logo} alt="Conectar Logo" className="logo" />
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

              <Button
                variant="contained"
                onClick={() => navigate("/loginAdmin")}
              >
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
