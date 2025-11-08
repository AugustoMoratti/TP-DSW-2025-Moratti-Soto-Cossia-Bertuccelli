import { useEffect, useState } from "react";
import { fetchMe } from "../../services/auth.services";
import type { Profesion } from "../../interfaces/profesion";
import "./AddProf.css";

export default function RmProf() {
  const [user, setUser] = useState<{ id?: number; profesiones?: Profesion[] }>({});
  const [prof, setProf] = useState<Profesion[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [mensajeOk, setMensajeOk] = useState<string | null>(null);

  // 🔹 Cargar usuario y profesiones
  useEffect(() => {
    const ac = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const me = await fetchMe();

        // Traer usuario completo con profesiones
        const userRes = await fetch(`http://localhost:3000/api/usuario/${me.id}`, {
          method: "GET",
          credentials: "include",
          signal: ac.signal,
        });
        const userData = await userRes.json();
        setUser(userData.data);

        // Traer lista de profesiones
        const profRes = await fetch("http://localhost:3000/api/profesion/", {
          method: "GET",
          credentials: "include",
          signal: ac.signal,
        });
        const profData = await profRes.json();
        const lista: Profesion[] =
          Array.isArray(profData)
            ? profData
            : Array.isArray(profData?.profesiones)
            ? profData.profesiones
            : Array.isArray(profData?.data)
            ? profData.data
            : [];
        setProf(lista);
      } catch (e: any) {
        if (e.name !== "AbortError") {
          console.error(e);
          setError("No se pudieron cargar los datos.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => ac.abort();
  }, []);

  // 🔹 Alternar selección
  const toggleSeleccion = (nombre: string) => {
    setSeleccionadas((prev) => {
      const next = new Set(prev);
      if (next.has(nombre)) next.delete(nombre);
      else next.add(nombre);
      return next;
    });
  };

  // 🔹 Guardar (remover profesiones)
  const handleGuardar = async () => {
    try {
      if (!user.id) {
        setError("Usuario no encontrado.");
        return;
      }
      if (seleccionadas.size === 0) {
        setError("Seleccioná al menos una profesión a quitar.");
        return;
      }

      setSaving(true);
      setError("");
      setMensajeOk(null);

      // Filtrar las profesiones que NO están seleccionadas → mantenerlas
      const profesRestantes = user.profesiones?.filter(
        (p) => !seleccionadas.has(p.nombreProfesion)
      ) ?? [];

      const res = await fetch(`http://localhost:3000/api/usuario/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          profesiones: profesRestantes.map((p) => p.nombreProfesion),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar profesiones");

      setUser((prev) => ({ ...prev, profesiones: profesRestantes }));
      setSeleccionadas(new Set());
      setMensajeOk("✅ Profesiones quitadas correctamente.");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Error al actualizar profesiones.");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Renderizado
  if (loading) return <p>Cargando profesiones...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="rmprof-container">
      <h3>Quitar Profesiones</h3>

      {user.profesiones?.length ? (
        <ul className="prof-list">
          {user.profesiones.map((p) => (
            <li key={p.nombreProfesion}>
              <label>
                <input
                  type="checkbox"
                  checked={seleccionadas.has(p.nombreProfesion)}
                  onChange={() => toggleSeleccion(p.nombreProfesion)}
                />
                {p.nombreProfesion}
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes profesiones asignadas.</p>
      )}

      <button
        className="btn_modPerf danger"
        onClick={handleGuardar}
        disabled={saving}
      >
        {saving ? "Guardando..." : "Quitar seleccionadas"}
      </button>

      {mensajeOk && <p className="ok">{mensajeOk}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
