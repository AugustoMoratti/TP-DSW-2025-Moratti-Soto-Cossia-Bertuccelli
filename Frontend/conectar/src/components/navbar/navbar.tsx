import React, { useEffect, useState } from "react";
import logo from "../../../assets/conect_2_1.png";
import type { ProfileCardProps as User } from "../../interfaces/profilaPropCard";
import { Button } from "../button/Button";
import { useNavigate } from "react-router";
import { fetchMe } from "../../services/auth.services.ts";
import "./navbar.css";

const Navbar: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await fetchMe();
        if (!me?.id) {
          setUser(null);
          return;
        }

        const res = await fetch(`http://localhost:3000/api/usuario/${me.id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Error al obtener datos del usuario");
        const data = await res.json();
        setUser(data.data);
      } catch {
        console.warn("Usuario no logueado o error al obtener datos");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return null;

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
            <Button variant="contained" onClick={() => navigate("/perfil")}>
              Mi Perfil
            </Button>
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

