import { useEffect, useState } from "react";
import { fetchMe } from "../../services/auth.services";
import CloseIcon from '@mui/icons-material/Close';
import "./HandleHabi.css";

export default function HandleHabi() {
  const [user, setUser] = useState<{ id?: string; habilidades?: string[] }>({});
  const [inputHabilidad, setInputHabilidad] = useState("");
  const [habilidades, setHabilidades] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [mensajeOk, setMensajeOk] = useState<string | null>(null);

  // USUARIO
  useEffect(() => {
    const ac = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const me = await fetchMe();

        const userRes = await fetch(`http://localhost:3000/api/usuario/${me.id}`, {
          method: "GET",
          credentials: "include",
          signal: ac.signal,
        });

        const userData = await userRes.json();
        if (userData?.data) {
          setUser(userData.data);
          setHabilidades(userData.data.habilidades || []);
        }
      } catch (e: any) {
        if (e.name !== "AbortError") {
          console.error(e);
          setError("No se pudo cargar el usuario");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => ac.abort();
  }, []);

  // SAVE LOCAL PARA DESPUES GUARDAR EN SERVER
  const handleAddHabilidad = () => {
    const nueva = inputHabilidad.trim();
    if (!nueva) return;
    if (habilidades.includes(nueva)) return;
    setHabilidades([...habilidades, nueva]);
    setInputHabilidad("");
  };

  // DELETE
  const handleRemoveHabilidad = (hab: string) => {
    setHabilidades(habilidades.filter((h) => h !== hab));
  };

  // SAVE
  const handleGuardar = async () => {
    if (!user.id) return;

    try {
      setSaving(true);
      const res = await fetch(`http://localhost:3000/api/usuario/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ habilidades }),
      });

      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

      setMensajeOk("Habilidades guardadas correctamente ✅");
      setTimeout(() => setMensajeOk(null), 2500);
    } catch (e) {
      console.error(e);
      setError("No se pudieron guardar las habilidades");
    } finally {
      setSaving(false);
    }
  };

  // RENDER
  if (loading) return <p>Cargando usuario...</p>;
  if (error) return <p style={{ color: '#dc2626' }}>{error}</p>;

  return (
    <div className="rmprof-container">
      <h3>Gestionar Habilidades</h3>

      {/* INPUT */}
      <div className="input-row">
        <input
          type="text"
          value={inputHabilidad}
          onChange={(e) => setInputHabilidad(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddHabilidad()}
          placeholder="Escribe una habilidad y presiona Enter"
        />
        <button className='btn-ok' onClick={handleAddHabilidad} disabled={!inputHabilidad.trim()}>
          Agregar
        </button>
      </div>

      {/* LISTA */}
      <div className="chips-container">
        {habilidades.length > 0 ? (
          habilidades.map((hab) => (
            <span key={hab} className="chip">
              {hab}
              <button className="remove-btn" onClick={() => handleRemoveHabilidad(hab)}>
                <CloseIcon/>
              </button>
            </span>
          ))
        ) : (
          <p className="no-habilidades">No hay habilidades cargadas.</p>
        )}
      </div>

      {/* GUARDAR */}
      <button onClick={handleGuardar} disabled={saving} className="btn-ok">
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>

      {mensajeOk && <p style={{ color: '#16a34a' }}>{mensajeOk}</p>}
    </div>
  );
}
