import { useEffect, useState } from "react";
import type { Localidad } from "../../../interfaces/localidad.ts";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RmProv() {
  const [localidad, setLocalidad] = useState<Localidad[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  const rowsPerPage = 5;
  const columns = 2;
  const itemsPerPage = rowsPerPage * columns;

  const totalPages = Math.max(1, Math.ceil(localidad.length / itemsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = localidad.slice(start, start + itemsPerPage);

  const fetchLocalidad = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/localidad", {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const response = await res.json();
      setLocalidad(Array.isArray(response.data) ? response.data : []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      } else {
        console.error("Error con las localidades: ", err);
        setError("Error al obtener las localidades");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalidad();
  }, [reload]);

  useEffect(() => {
    setPage(1);
  }, [localidad.length]);

  const handleDelete = async (nombre: string) => {
    if (!confirm("¿Eliminar esta localidad?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/api/localidad/${nombre}`, {
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


  if (loading && localidad.length === 0) return <p>Cargando...</p>;
  if (!loading && localidad.length === 0) return <p>No hay localidades registradas.</p>;


  return (
    <>
      {loading && localidad.length === 0 ? (
        <p>Cargando...</p>
      ) : localidad.length === 0 ? (
        <p>No hay localidades registradas.</p>
      ) : (
        <>
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
        </>
      )}
    </>
  );
}