import { useNavigate } from "react-router-dom";
import "./app.css"

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenido a Conectar</h1>
        <p>Tu plataforma de conexión social.</p>
        <button onClick={() => navigate("/login")}>Iniciar Sesión</button>
        <button onClick={() => navigate("/register")}>Registrarse</button>
      </header>
    </div>
  );
}

