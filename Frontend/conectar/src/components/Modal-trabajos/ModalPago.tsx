import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import type { Trabajo } from "../../interfaces/trabajo.ts";

interface PaymentModalProps {
  trabajo: Trabajo;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (fechaPago: string) => Promise<void> | void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ trabajo, isOpen, onClose, onConfirm }) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY as string | undefined;

  const hoyISO = new Date().toISOString().slice(0, 10);
  const [dateInput, setDateInput] = useState<string>(hoyISO);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [fechaPago, setFechaPago] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (publicKey) initMercadoPago(publicKey);
  }, [publicKey]);

  useEffect(() => {
    if (!isOpen) return;
    // inicializar fecha por defecto cuando se abre
    setDateInput(hoyISO);
    const [y, m, d] = hoyISO.split("-");
    setFechaPago(`${d}/${m}/${y}`);
  }, [isOpen, hoyISO]);

  useEffect(() => {
    if (!isOpen) return;
    if (!trabajo?.id) return;
    if (!trabajo.montoTotal || trabajo.montoTotal <= 0) return;
    if (preferenceId) return;

    let mounted = true;
    const createPreference = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/mp/create-preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trabajoId: trabajo.id }),
        });

        if (!response.ok) {
          const text = await response.text().catch(() => null);
          throw new Error(text || `Error ${response.status}`);
        }

        const data = await response.json();
        if (mounted) setPreferenceId(data.preferenceId ?? data.preference_id ?? null);
      } catch (err) {
        console.error("Error creando la preferencia:", err);
        if (mounted) setError(String(err));
      }
    };

    createPreference();
    return () => {
      mounted = false;
    };
  }, [isOpen, trabajo?.id, preferenceId]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  };

  useEffect(() => {
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      if (onConfirm) {
        await onConfirm(fechaPago);
      } else {
        // fallback: update trabajo fechaPago directly
        const resp = await fetch(`http://localhost:3000/api/trabajos/${trabajo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fechaPago }),
        });
        if (!resp.ok) {
          const text = await resp.text().catch(() => null);
          throw new Error(text || `Error ${resp.status}`);
        }
      }
      onClose();
    } catch (err: any) {
      console.error("Error al confirmar pago:", err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="overlay" ref={overlayRef} onMouseDown={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h3>Pago</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div style={{ padding: 12 }}>
          <p>Fecha seleccionada: <strong>{dateInput}</strong></p>
          <div style={{ marginTop: 12 }}>
            {preferenceId ? (
              <Wallet initialization={{ preferenceId }} />
            ) : (
              <p>Preparando la preferencia de pago...</p>
            )}
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        <div className="modal-footer">
          <button onClick={handleConfirm} className="btn" disabled={loading} style={{ marginLeft: 8 }}>
            {loading ? "Confirmando..." : "Confirmar pago"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PaymentModal;