import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./OlvidarCambiarP.css";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const reset = async () => {
    const res = await fetch("http://localhost:3000/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      alert("Contraseña cambiada");
      nav("/login");
    } else {
      alert("Token inválido o vencido");
    }
  };

  return (
    <div className="main-bgg">
      <div className="cardd">
        <div className="card-headerr">
          <h2 className="card-titlee">Nueva contraseña</h2>
        </div>

        <div className="card-contentt">
          <input
            className="input-fieldd"
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button className="btn-primaryo" onClick={reset}>
            Cambiar contraseña
          </button>

          <p className="info-texto">
            El link es válido por tiempo limitado
          </p>
        </div>
      </div>
    </div>
  );
}
