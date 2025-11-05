import React, { useState } from "react";
import StandardInput from "./form/Form";

interface SolicitarProfProps {
  onClose?: () => void;
  onSuccess?: (profesion: string) => void;
}

const SolicitarProf: React.FC<SolicitarProfProps> = ({ onClose, onSuccess }) => {
  const [profesion, setProfesion] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [error, setError] = useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const value = profesion.trim();
    if (!value) {
      alert("Ingrese una profesión");
      return;
    }

    setError("");
    console.log("✅ Enviando solicitud...");

    try {
      const response = await fetch("http://localhost:3000/api/profesion/", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nombreProfesion: value, 
          descripcionProfesion: descripcion,  
          estado: false 
        }),
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (!response.ok) {
        setError(data.error || "❌ Error enviando la solicitud.");
        return;
      }

      console.log("Solicitud enviada:", value);
      setProfesion("");
      alert("Solicitud enviada correctamente");
      onSuccess?.(value);
      onClose?.();

    } catch (err) {
      console.error("Error al enviar solicitud:", err);
      alert("Ocurrió un error al enviar la solicitud");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Solicitar Profesion</h2>
        <p>¿Qué profesión quiere solicitar?</p>
        <form onSubmit={handleSubmit}>
          <StandardInput
            label="Profesión"
            value={profesion}
            onChange={(v: string) => setProfesion(v)}
          />
          <StandardInput
            label="Descripcion"
            value={descripcion}
            onChange={(v: string) => setDescripcion(v)}
          />
          <div className="card-actions">
            <button type="submit" className="notfound-btn">
              Enviar Solicitud
            </button>
            {error && (
              <div style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
                {error}
              </div>
            )}
            <button type="button" className="notfound-btn" onClick={() => onClose?.()}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolicitarProf;