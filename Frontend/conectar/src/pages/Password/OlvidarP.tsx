import { useState } from "react";
import "./OlvidarCambiarP.css";
import { useNavigate } from "react-router-dom";
import FastRewindIcon from '@mui/icons-material/FastRewind';
import { animate } from "animejs/animation";

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

    const handleEnter = () => {
      animate(".logo1", {
        scale: 1.15,
        duration: 300,
        ease: "out(3)",
      });
    };

    const handleLeave = () => {
      animate(".logo1", {
        scale: 1,
        duration: 300,
        ease: "out(3)",
      });
    };

  return (
    <div className="main-bgg">
      <img src="../assets/conect_1.png" className="logo1" alt="Logo" style={{ height: '150px', cursor: 'pointer' }} onClick={() => Navigate("/")} onMouseEnter={handleEnter} onMouseLeave={handleLeave}/>
      <div className="cardd">
        <div className="card-headerr">
          <h2 className="card-titlee">RECUPERAR CONTRASEÑA</h2>
        </div>

        <p className="info-texto">
          Te enviaremos un link para cambiar tu contraseña
        </p>

        <div className="card-contentt">
          <input
            className="input-fieldd"
            type="email"
            placeholder="Ingresá tu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <div>
            <button onClick={() => Navigate("/-1")} className="btn-secondaryy" title="Volver atrás">
              <FastRewindIcon/>
            </button>
            <button className="btn-primaryo" onClick={send}>
              Enviar link
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
