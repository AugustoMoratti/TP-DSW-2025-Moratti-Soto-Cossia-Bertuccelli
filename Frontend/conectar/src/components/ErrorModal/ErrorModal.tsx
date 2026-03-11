import React, { useEffect, useState } from "react";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import "./ErrorModal.css";

interface ErrorModalProps {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
  duration?: number; // duración en ms antes de desaparecer automáticamente
}

export default function ErrorModal({
  message,
  isVisible,
  onClose,
  duration = 5000,
}: ErrorModalProps) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);

    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  return (
    <div className={`error-modal ${show ? "show" : ""}`}>
      <div className="error-modal-content">
        <div className="error-modal-header">
          <span className="error-icon"> <ReportGmailerrorredIcon/> </span>
          <button
            className="error-modal-close"
            onClick={handleClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="error-modal-body">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
