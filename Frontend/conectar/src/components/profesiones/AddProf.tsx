import { useState } from "react";
import { fetchMe } from "../../services/auth.services";
import type { Profesion } from "../../interfaces/profesion";
import "./AddProf.css";

export default function AddProf() {
  const [prof, setProf] = useState<Profesion[]>([]);
  const [query, setQuery] = useState("");
  const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [mensajeOk, setMensajeOk] = useState<string | null>(null);

  // Buscar profesiones
  /*const handleBuscarProf = async () => {
    if (!query.trim().toLowerCase()) return;
    try {
      setLoading(true);
      setError("");
      fetch(`http://localhost:3000/api/profesion/busqueda?q=${encodeURIComponent(query)}`)//encode lo que hace es verificar la correcta escritura, y quitar espacio y poner otros caracteres
        .then(res => res.json())
        .then(data => {
          console.log(`http://localhost:3000/api/profesion/busqueda?q=${encodeURIComponent(query)}`)
          setProf(data.profesiones);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error buscando profesiones:', err);
          setLoading(false);
        });
    } catch (err) {
      console.error("Error buscando profesiones:", err);
      setError("Error al buscar profesiones.");
    } finally {
      setLoading(false);
    }
  };*/
  const handleBuscarProf = () => {
    setLoading(true);
    fetch(`http://localhost:3000/api/profesion/busqueda/${encodeURIComponent(query)}`)//encode lo que hace es verificar la correcta escritura, y quitar espacio y poner otros caracteres
      .then(res => res.json())
      .then(data => {
        setProf(data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error buscando profesiones:', err);
        setLoading(false);
      });
  };

  const toggleSeleccion = (nombre: string) => {
    setSeleccionadas((prev) => {
      const next = new Set(prev);
      if (next.has(nombre)) next.delete(nombre);
      else next.add(nombre);
      return next;
    });
  };

  const handleGuardar = async () => {
    try {
      const user = await fetchMe();
      if (seleccionadas.size === 0) {
        setError("Seleccioná al menos una profesión.");
        return;
      }
      setSaving(true);
      setError("");
      setMensajeOk(null);

      const nombres = Array.from(seleccionadas);

      const res = await fetch(`http://localhost:3000/api/usuario/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          profesiones: nombres,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar profesiones");

      setMensajeOk("✅ Profesiones guardadas con éxito");
      setSeleccionadas(new Set());
    } catch (e: any) {
      console.error(e);
      setError(e.message || "No se pudieron guardar las profesiones.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="manage-prof">
      <h2 className="manage-prof__title">Gestionar Profesiones</h2>

      <div className="manage-prof__search">
        <input
          type="text"
          className="manage-prof__input"
          placeholder="Busque una profesión..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscarProf()}
        />
        <button
          className="manage-prof__btn"
          disabled={loading}
          onClick={handleBuscarProf}
        >
          Buscar
        </button>
      </div>

      {loading && <p className="loading">Cargando profesiones...</p>}
      {error && <p style={{ color: '#c00' }}>{error}</p>}
      {mensajeOk && <p style={{ color: '#2ab1b8' }}>{mensajeOk}</p>}

      <div className="manage-prof__list">
        {!prof && !loading && (
          <p className="no-results">No hay resultados</p>
        )}
        {prof.map((p) => {
          const selected = seleccionadas.has(p.nombreProfesion);
          return (
            <div
              key={p.nombreProfesion}
              className={`manage-prof__item ${selected ? "selected" : ""}`}
              onClick={() => toggleSeleccion(p.nombreProfesion)}
            >
              <span>{p.nombreProfesion}</span>
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggleSeleccion(p.nombreProfesion)}
              />
            </div>
          );
        })}
      </div>

      <button
        className="manage-prof__save"
        disabled={saving || seleccionadas.size === 0}
        onClick={handleGuardar}
      >
        {saving ? "Guardando..." : "Guardar profesiones seleccionadas"}
      </button>
    </div>
  );
}
