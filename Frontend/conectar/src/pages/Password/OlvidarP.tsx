import { useState } from "react";
import "./OlvidarCambiarP.css";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");

  const Navigate = useNavigate();

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
      <img src="../assets/conect_1.png" alt="Logo" style={{ height: '150px', cursor: 'pointer' }} onClick={() => Navigate("/")} />
      <div className="cardd">
        <div className="card-headerr">
          <h2 className="card-titlee"> RECUPERAR CONTRASEÑA</h2>
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
