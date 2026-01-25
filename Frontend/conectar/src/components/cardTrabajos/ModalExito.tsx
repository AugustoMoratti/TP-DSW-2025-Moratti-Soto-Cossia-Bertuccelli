import React from "react";
import ModalTrabajos from "../Modal-trabajos/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalExito: React.FC<Props> = ({ isOpen, onClose }) => {
  
  return (
    <ModalTrabajos isOpen={isOpen} onClose={onClose} title="Formulario enviado">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h2>✅ Formulario enviado</h2>
        <p>Se ha registrado y enviado el formulario.</p>

      </div>
    </ModalTrabajos>
  );
};

export default ModalExito;
