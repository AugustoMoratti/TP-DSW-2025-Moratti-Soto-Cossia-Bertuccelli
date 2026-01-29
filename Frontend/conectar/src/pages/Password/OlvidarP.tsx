import { useState } from "react";
import "./OlvidarCambiarP.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const send = async () => {
    await fetch("http://localhost:3000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    alert("Si el mail existe, se envió el correo");
  };

  return (
    <div className="main-bgg">
      <div className="cardd">
        <div className="card-headerr">
          <h2 className="card-titlee">Recuperar contraseña</h2>
        </div>

        <div className="card-contentt">
          <input
            className="input-fieldd"
            type="email"
            placeholder="Ingresá tu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <button className="btn-primaryo" onClick={send}>
            Enviar link
          </button>

          <p className="info-texto">
            Te enviaremos un link para cambiar tu contraseña
          </p>
        </div>
      </div>
    </div>
  );
}
