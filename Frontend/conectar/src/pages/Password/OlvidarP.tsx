import { useState } from "react";
import "./OlvidarCambiarP.css";
import { useNavigate } from "react-router-dom";
import FastRewindIcon from '@mui/icons-material/FastRewind';
import { animate } from "animejs/animation";
import ErrorModal from "../../components/ErrorModal/ErrorModal";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const Navigate = useNavigate();

  const send = async () => {
    if (loading) return;
    setLoading(true);
    if (!email) {
      setError("Por favor ingresa tu email");
      setShowError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al enviar el correo");
        setShowError(true);
        return;
      }

      if (data.message === "Mail enviado") {
        alert("Correo enviado correctamente");
        setEmail("");
      } else {
        // Si el email no existe, mostrar error
        setError("El email no está registrado en el sistema");
        setShowError(true);
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      setShowError(true);
    }
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
      <img src="../assets/conect_1.png" className="logo1" alt="Logo" style={{ height: '150px', cursor: 'pointer' }} onClick={() => Navigate("/")} onMouseEnter={handleEnter} onMouseLeave={handleLeave} />
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
              <FastRewindIcon />
            </button>
            <button className="btn-primaryo" onClick={send} disabled={loading}>
              {loading ? "Enviando..." : "Enviar Link"}
            </button>
          </div>

        </div>
      </div>
      <ErrorModal
        message={error || ""}
        isVisible={showError}
        onClose={() => setShowError(false)}
      />
    </div>
  );
}
