import { useEffect, useState } from "react";
import type { Provincia } from "../../../interfaces/provincia";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RmProv() {
  const [provincia, setProvincia] = useState<Provincia[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  const rowsPerPage = 5;
  const columns = 2;
  const itemsPerPage = rowsPerPage * columns;

  const totalPages = Math.max(1, Math.ceil(provincia.length / itemsPerPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * itemsPerPage;
  const pageItems = provincia.slice(start, start + itemsPerPage);

  const fetchProvincias = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/provincia", {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const response = await res.json();
      setProvincia(Array.isArray(response.data) ? response.data : []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      } else {
        console.error("Error con provincias: ", err);
        setError("Error al obtener las provincias");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvincias();
  }, [reload]);

  useEffect(() => {
    setPage(1);
  }, [provincia.length]);

  const handleDelete = async (id: number | string) => {
    if (!confirm("¿Eliminar esta provincia?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3000/api/provincia/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setReload((r) => r + 1);
      console.log('✅ Provincia eliminada con exito')
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      } else {
        console.error("Error eliminando provincia: ", err);
        setError("Error al eliminar la provincia");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && provincia.length === 0 ? (
        <p>Cargando...</p>
      ) : provincia.length === 0 ? (
        <p>No hay provincias registradas.</p>
      ) : (
        <>
          <ul className="provincia-list two-columns">
            {pageItems.map((p) => {
              const id = (p as any).id ?? (p as any)._id ?? (p as Provincia).id;
              const nombre = (p as any).nombre ?? (p as Provincia).nombre ?? "Sin nombre";
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