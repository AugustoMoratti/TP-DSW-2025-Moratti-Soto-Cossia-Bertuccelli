import { useEffect, useState } from "react";
import style from "./ProfileCard/ProfileCard.module.css";

type Profesion = {
  id?: number | string;
  nombreProfesion: string;
  descripcionProfesion?: string;
  fechaSolicitud?: string;
  estado?: string;
};

export default function ManageProf() {
  const [profesiones, setProfesiones] = useState<Profesion[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set()); 
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const ac = new AbortController();

    const fetchProfesiones = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:3000/api/profesion/", {
          method: "GET",
          credentials: "include",
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("JSON recibido (profesiones):", data);

        const lista: Profesion[] =
          Array.isArray(data) ? data :
          Array.isArray(data?.profesiones) ? data.profesiones :
          Array.isArray(data?.data) ? data.data : [];

        setProfesiones(lista);

      } catch (e: any) {
        if (e.name !== "AbortError") setError("No se pudieron cargar las profesiones");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfesiones();
    return () => ac.abort();  
  }, []);

  const getItemKey = (p: Profesion) =>
    String(p.id ?? `${p.nombreProfesion}-${p.fechaSolicitud ?? ""}-${p.estado ?? ""}`);

  const toggleSeleccion = (key: string) => {
    setSeleccionadas((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleGuardar = async () => {


    if (seleccionadas.size === 0) {
      setError("Seleccioná al menos una profesión.");
      return;
    }

    setSaving(true);
    setError(null);

    try {

      const res = await fetch("http://localhost:3000/api/usuario/profesiones", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try { msg = (await res.json())?.message || msg; } catch {}
        throw new Error(msg);
      }

      // Si el backend devuelve algo, podés usarlo:
      // const result = await res.json().catch(() => null);

      console.log("Profesiones guardadas con éxito");
      // Opcional: toast, cerrar modal, refetch, etc.
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "No se pudieron guardar las profesiones");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Gestión de Profesiones</h3>

      {loading && <p>Cargando profesiones…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <>
          {profesiones.length === 0 ? (
            <p>No hay profesiones disponibles.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {profesiones.map((p) => {
                const key = getItemKey(p);
                const inputId = `prof-${key}`;
                const isChecked = seleccionadas.has(key);

                return (
                  <li key={key} style={{ marginBottom: 12 }}>
                    <label htmlFor={inputId} style={{ display: "grid", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input
                          id={inputId}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSeleccion(key)}
                          disabled={saving}
                        />
                        <strong>{p.nombreProfesion}</strong>
                      </div>
                      {p.descripcionProfesion && (
                        <small style={{ opacity: 0.8 }}>{p.descripcionProfesion}</small>
                      )}
                    </label>
                  </li>
                );
              })}
            </ul>
          )}

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button
              type="button"
              className={style.btn_direccion}
              onClick={() => setSeleccionadas(new Set())}
              disabled={saving}
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={handleGuardar}
              className={style.btn_direccion}
              disabled={saving || seleccionadas.size === 0}
            >
              {saving ? "Guardando..." : `Guardar selección (${seleccionadas.size})`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}