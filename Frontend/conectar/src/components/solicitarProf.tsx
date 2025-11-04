import React, { useState } from "react";
import StandardInput from "./form/Form";

interface SolicitarProfProps {
  onClose?: () => void;
  onSuccess?: (profesion: string) => void;
}

const SolicitarProf: React.FC<SolicitarProfProps> = ({ onClose, onSuccess }) => {
  const [profesion, setProfesion] = useState<string>("");

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const value = profesion.trim();
    if (!value) {
      alert("Ingrese una profesión");
      return;
    }

    try {
      // await fetch("/api/solicitar-profesion", { method: "POST", body: JSON.stringify({ profesion: value }), headers: { "Content-Type": "application/json" } });
      console.log("Solicitud enviada:", value);
      setProfesion("");
      alert("Solicitud enviada correctamente");
      onSuccess?.(value); // avisar al padre
      onClose?.(); // cerrar modal
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
          <div className="card-actions">
            <button type="submit" className="notfound-btn">
              Enviar Solicitud
            </button>
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