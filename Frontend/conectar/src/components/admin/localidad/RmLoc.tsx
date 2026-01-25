import { useEffect, useState } from "react";
import type { Localidad } from "../../../interfaces/localidad.ts";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RmLoc() {
  const [localidad, setLocalidad] = useState<Localidad[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  const rowsPerPage = 5;
  const columns = 2;
  const itemsPerPage = rowsPerPage * columns;

  const totalPages = Math.max(1, Math.ceil(localidad.length / itemsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = localidad.slice(start, start + itemsPerPage);

  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil(localidad.length / itemsPerPage));
    if (page > newTotalPages) {
      setPage(newTotalPages);
    }
  }, [localidad.length, itemsPerPage, page]);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/api/localidad`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLocalidad(data.data ?? []);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Error cargando localidades');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, [reload]);

  const handleDelete = async (nombre: string) => {
    if (!confirm("¿Eliminar esta localidad?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/api/localidad/${encodeURIComponent(nombre)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setReload((r) => r + 1);
      console.log('✅ Localidad eliminada con exito')
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      } else {
        console.error("Error eliminando localidad: ", err);
        setError("Error al eliminar la localidad");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuscarLocal = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/api/localidad/buscar?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLocalidad(data.data ?? []);
      setPage(1);
    } catch (err: unknown) {
      console.error('Error buscando localidades:', err);
      if (err instanceof Error) setError(err.message);
      else setError('Error buscando localidades');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <br />
      <label htmlFor="buscador-localidad" style={{position: 'absolute', left: -10000}}>
        Buscar localidad
      </label>
      <input
        id="buscador-localidad"
        type="text"
        className="buscador"
        style={{ borderColor: 'black' }}
        placeholder="Busque una localidad"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleBuscarLocal()}
        aria-label="Buscar localidad"
      />

      {error && <p className="error">{error}</p>}

      <div>
        {loading && localidad.length === 0 && <p>Cargando...</p>}
        {!loading && localidad.length === 0 && <p>No hay localidades registradas.</p>}

        <ul className="provincia-list two-columns">
          {pageItems.map((p) => {
            const id = (p as any).id ?? (p as any)._id ?? (p as Localidad).nombre;
            const nombre = (p as any).nombre ?? (p as Localidad).nombre ?? "Sin nombre";
            return (
              <li key={id ?? nombre} className="provincia-item">
                <span className="prov-nombre">{nombre}</span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(nombre)}
                  disabled={loading}
                  aria-label={`Eliminar ${nombre}`}
                >
                  <DeleteIcon/>
                </button>
              </li>
            );
          })}
        </ul>

          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ← Anterior
            </button>

            <span className="page-info">
              Página {currentPage} / {totalPages}                                                       
            </span>

            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente →
            </button>
          </div>
      </div>
    </>
  )
}
