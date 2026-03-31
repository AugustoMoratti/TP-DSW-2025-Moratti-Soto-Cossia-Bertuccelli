import { useEffect, useState } from "react";
import "./usuariosList.css"

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);

  const cargarUsuarios = async () => {
    try {
      console.log("LLAMANDO API...");

      const res = await fetch("http://localhost:3000/api/usuario");
      console.log("STATUS:", res.status);

      const data = await res.json();
      console.log("DATA COMPLETA:", data);

      setUsuarios(data.data || []);
    } catch (error) {
      console.error("ERROR:", error);
      console.error(error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const banUsuario = async (id: string) => {
    const motivo = prompt("Motivo del baneo:");
    if (!motivo) return;

    await await fetch(`http://localhost:3000/api/usuario/${id}/ban`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motivo }),
    });

    cargarUsuarios();
  };

  const unbanUsuario = async (id: string) => {
    await await fetch(`http://localhost:3000/api/usuario/${id}/unban`, {
      method: "PUT",
    });

    cargarUsuarios();
  };

  return (
  <div className="usuarios-container">
    <h2 className="usuarios-title">Usuarios</h2>

    {usuarios.map((u: any) => (
      <div key={u.id} className="usuario-row">
        
        <div className="usuario-info">
          <span className="usuario-nombre">
            {u.nombre} {u.apellido}
          </span>

          {u.baneado ? (
            <span className="usuario-estado baneado">
              Baneado ({u.motivoBaneo})
            </span>
          ) : (
            <span className="usuario-estado activo">
              Activo
            </span>
          )}
        </div>

        <div className="usuario-actions">
          {u.baneado ? (
            <button
              className="btn-unban"
              onClick={() => unbanUsuario(u.id)}
            >
              Desbanear
            </button>
          ) : (
            <button
              className="btn-ban"
              onClick={() => banUsuario(u.id)}
            >
              Banear
            </button>
          )}
        </div>

      </div>
    ))}
  </div>
);
}