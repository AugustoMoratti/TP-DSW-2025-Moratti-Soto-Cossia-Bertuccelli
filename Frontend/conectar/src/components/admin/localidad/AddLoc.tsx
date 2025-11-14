import { useState } from "react";
import StandardInput from "../../form/Form.tsx";
import type { Localidad } from "../../../interfaces/localidad.ts";

export default function AddLoc() {

  const [nombreLoc, setNombreLoc] = useState<string>("");
  const [codPostal, setCodPostal] = useState<string>("");
  const [prov, setProv] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [localidad, setLocalidad] = useState<Localidad[]>([]);
  const [reload, setReload] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!nombreLoc.trim()) {
      setError("El nombre no puede estar vacío");
      return;
    }

    if (!codPostal.trim()) {
      setError("El código postal no puede estar vacío");
      return;
    }

    /*if (!/^\d+$/.test(codPostal)) {
      setError("El código postal debe contener solo números");
      return;
    }*/

    if (codPostal.length < 4) {
      setError("El código postal no es valido");
      return;
    }

    if (!prov.trim()) {
      setError("La provincia no puede estar vacía");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        nombre: nombreLoc.trim(),
        codPostal,
        provincia: prov.trim(),
      };
      console.log("Enviando payload:", payload);

      const res = await fetch("http://localhost:3000/api/localidad", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      let responseJson: any = null;
      try {
        responseJson = raw ? JSON.parse(raw) : null;
      } catch {
        console.warn("La respuesta no es JSON parseable:", raw);
      }

      if (!res.ok) {
        const serverMsg =
          responseJson?.message ||
          responseJson?.error ||
          `Error HTTP ${res.status}`;
        throw new Error(serverMsg);
      }

      if (Array.isArray(responseJson?.data)) {
        setLocalidad(responseJson.data);
      } else if (responseJson?.data) {
        setLocalidad((prev) => [...prev, responseJson.data]);
      } else {
        setReload((r) => r + 1);
      }

      setNombreLoc("");
      console.log("✅ Localidad creada");
      setShowModal(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error al crear localidad:", err.message);
        setError(err.message);
      } else {
        console.error("Error al crear localidad (desconocido):", err);
        setError("Error al guardar la localidad");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <h2>Agregar Localidades</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="input-col">
            <StandardInput
              label="Nombre"
              value={nombreLoc}
              onChange={(v: string) => setNombreLoc(v)}
            />
          </div>
          <div className="input-col">
            <StandardInput
              label="Codigo Postal"
              value={codPostal}
              onChange={(v: string) => setCodPostal(v)}
            />
          </div>
          <div className="input-col">
            <StandardInput
              label="Provincia"
              value={prov}
              onChange={(v: string) => setProv(v)}
            />
          </div>
        </div>
        <div className="card-actions">
          <button type="submit" className="notfound-btn" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Solicitud"}
          </button>
        </div>
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h2>✅ Localidad registrada</h2>
              <p>Tu localidad ha sido creada exitosamente.</p>
              <button className="notfound-btn" onClick={handleCloseModal}>
                Volver
              </button>
            </div>
          </div>
        )}
        {error && (
          <div style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
            No se pudo cargar correctamente la Localidad!
          </div>
        )}
      </form>

      <br />
    </>
  )
};