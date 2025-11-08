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

  // LOCAL PARA DESPUES GUARDAR
  const handleAddHabilidad = async () => {
    const nueva = inputHabilidad.trim();
    if (!nueva || habilidades.includes(nueva)) return;

    const nuevasHabs = [...habilidades, nueva];
    setHabilidades(nuevasHabs);
    setInputHabilidad("");


    await handleSave(nuevasHabs, "Habilidad agregada ✅");
  };

  // REMOVE
  const HendleRemove = async (hab: string) => {
    const nuevasHabs = habilidades.filter((h) => h !== hab);
    setHabilidades(nuevasHabs);

    await handleSave(nuevasHabs, `Habilidad "${hab}" eliminada`);
  };

  //SAVE
  const handleSave = async (lista: string[], msgOk: string) => {
    if (!user.id) return;
    try {
      setSaving(true);
      const res = await fetch(`http://localhost:3000/api/usuario/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ habilidades: lista }),
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      setMensajeOk(msgOk);
      setTimeout(() => setMensajeOk(null), 2000);
    } catch (e) {
      console.error(e);
      setError("No se pudieron guardar las habilidades");
    } finally {
      setSaving(false);
    }
  };

  const handleGuardar = async () => {
    await handleSave(habilidades, "Habilidades guardadas correctamente ✅");
  };

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
              <button className="remove-btn" onClick={() => HendleRemove(hab)}>
                <CloseIcon />
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
