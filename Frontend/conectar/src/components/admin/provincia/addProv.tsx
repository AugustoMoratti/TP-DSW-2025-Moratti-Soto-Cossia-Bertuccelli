import { useState } from "react";
import StandardInput from "../../form/Form.tsx";
import type { Provincia } from "../../../interfaces/provincia.ts";

export default function AddProv () {

  const [nombreProv, setNombreProv] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [provincia, setProvincia] = useState<Provincia[]>([]);
  const [reload, setReload] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreProv.trim()) {
      setError("El nombre no puede estar vacío");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/provincia", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombreProv.trim(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const response = await res.json();

      if (Array.isArray(response.data)) {
        setProvincia(response.data);
      } else if (response.data) {
        setProvincia((prev) => [...prev, response.data]);
      } else {

        setReload((r) => r + 1);
      }

      setNombreProv("");
      console.log("✅ Solicitud enviada");
      alert("✅ Solicitud enviada correctamente");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      } else {
        console.error("Error con provincias: ", err);
        setError("Error al guardar la provincia");
      }
    } finally {
      setLoading(false);
    }
  };

  return(
    <>
      <h2>Agregar Provincias</h2>
        <form onSubmit={handleSubmit}>
          <StandardInput
            label="Nombre"
            value={nombreProv}
            onChange={(v: string) => setNombreProv(v)}
          />
          <div className="card-actions">
            <button type="submit" className="notfound-btn" disabled={loading}>
              {loading ? "Enviando..." : "Enviar Solicitud"}
            </button>
          </div>
          {error && (
            <div style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
              {error}
            </div>
          )}
        </form>

        <br />
    </>
  )};