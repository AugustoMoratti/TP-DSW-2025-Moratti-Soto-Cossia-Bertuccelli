import { useState } from "react";
import CreatePerfilAdmin from "../../pages/Dashboard/createPerfil";
import CardProfesional from "../cardsProfesionales/cardsProf.tsx";
import type { Usuario } from "../../interfaces/usuario";
import './usuario.css'

export default function Usuarios() {
  const [query, setQuery] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuscarUsuarios = async () => {

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:3000/api/usuario/buscar?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        }
      );

      const raw = await res.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        console.warn("Respuesta no JSON:", raw);
      }

      if (!res.ok) {
        throw new Error(
          data?.message || data?.error || `Error HTTP ${res.status}`
        );
      }

      setUsuarios(Array.isArray(data?.data) ? data.data : []);
    } catch (err: unknown) {
      console.error("Error buscando usuarios:", err);
      setError(
        err instanceof Error ? err.message : "No se pudo buscar usuarios"
      );
    } finally {
      setLoading(false);
    }
  };

  const usuario = usuarios[0];

  return (
    <div className="container-createperfiles">
      <h2>Lista de Usuarios</h2>

      <div className="search-row" style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          className="buscador"
          placeholder="Busque un usuario"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscarUsuarios()}
          aria-label="Buscar usuarios"
          style={{ flex: 1 }}
        />
      </div>
        <button
          className="btn-buscar"
          onClick={handleBuscarUsuarios}
          disabled={loading || !query.trim()}
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>

      {error && (
        <p style={{ color: "red", marginTop: 8, textAlign: "center" }}>
          {error}
        </p>
      )}

      {loading && usuarios.length === 0 ? (
        <p>Cargando...</p>
      ) : !usuario ? (
        <p>No hay resultados para mostrar.</p>
      ) : (
        <div className="container-perfiles">
          <CardProfesional usuarios={usuarios}/>
        </div>
      )}

      <div className="divisor"></div>

      <div className="container-createperfiles">
        <CreatePerfilAdmin />
      </div>
    </div>
  );
}
