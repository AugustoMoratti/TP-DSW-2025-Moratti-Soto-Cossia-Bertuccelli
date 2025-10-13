import React, { useState, useEffect } from "react";
import StandardInput, { Button } from '../../components/Form';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";
import './login.css';
import "../..//components/Button.css";
import "../..//components/Form.css";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [recuerdame, setRecuerdame] = useState(false);
  const navigate = useNavigate();

  // Al montar, intenta cargar los datos guardados
  useEffect(() => {
    const savedUser = localStorage.getItem("usuario");
    const savedRecuerdame = localStorage.getItem("recuerdame") === "true";
    if (savedRecuerdame && savedUser) {
      setUsuario(savedUser);
      setRecuerdame(true);
    }
  }, []);

  // Función para manejar el login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (recuerdame) {
      localStorage.setItem("usuario", usuario);
      localStorage.setItem("recuerdame", "true");
    } else {
      localStorage.removeItem("usuario");
      localStorage.removeItem("clave");
      localStorage.setItem("recuerdame", "false");
    }
    // Aca va la lógica de autenticación
  };

  return (
    <section className="main-bg">
      <img src="../assets/conect_1.png" alt="Logo" className='logo' />
      <div className="card">
        <form onSubmit={handleLogin}>
          <div className="card-header">
            <span className="card-title">INICIE SESIÓN</span>
          </div>
          <div className="card-content">
            <StandardInput label="Usuario" value={usuario} onChange={setUsuario} />
            <StandardInput label="Clave" value={clave} onChange={setClave} type="password" />
            <div className="recuerdame-container">
              <input
                type="checkbox"
                id="recuerdame"
                checked={recuerdame}
                onChange={() => setRecuerdame(!recuerdame)}
              />
              <label htmlFor="recuerdame">Recuérdame</label>
            </div>
            <div className="card-actions">
              <button
                className="cta-link"
                type="button"
                onClick={() => navigate("/register")}
              >
                ¿No tiene cuenta? Cree una ahora mismo
              </button>
              <Button type="submit" variant="contained" icon={<CheckIcon />}>
                Enviar
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

