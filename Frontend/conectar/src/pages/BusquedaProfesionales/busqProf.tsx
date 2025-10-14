import { useState } from "react";
import Header from "../../components/header/header"
import type { Usuario } from "../interfaces/usuario.ts";

export default function BusquedaProfesionales() {
  const [query, setQuery] = useState('');
  const [cargando, setCargando] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const handleBuscar = () => {
    if (!query.trim()) return;

    setCargando(true);
    fetch(`http://localhost:3000/api/usuario/buscar?q=${encodeURIComponent(query)}`)//encode lo que hace es verificar la correcta escritura, y quitar espacio y poner otros caracteres
      .then(res => res.json())
      .then(data => {
        setUsuarios(data.data);
        setCargando(false);
      })
      .catch(err => {
        console.error('Error buscando usuarios:', err);
        setCargando(false);
      });
  };

  return (
    <>
      <Header>
        <button className="header-btn">Mi Perfil</button>
        <button className="header-btn">Admin</button>
      </Header>
      <main>
        <input
          type="text"
          placeholder="Busque su profesional adecuado"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleBuscar()}>
        </input>

        <button onClick={handleBuscar}>Buscar</button>

        {cargando && <p>cargando...</p>}

        <ul>
          {usuarios.map(u => (
            <li key={u.id}>
              {u.nombre}
            </li>
          ))}
        </ul>

      </main>
    </>
  )
}