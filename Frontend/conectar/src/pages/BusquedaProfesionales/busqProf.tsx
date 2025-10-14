import { useState } from "react";
import Header from "../../components/header/header"
import type { Usuario } from "../interfaces/usuario.ts";
import CardProfesional from "./cardsProf.tsx";
import "./busqProf.css";

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
    <div className="busprof-page">
      <Header>
        <button className="header-btn">Mi Perfil</button>
        <button className="header-btn">Admin</button>
      </Header>
      <div className='main-container'>
        <input
          type="text"
          className="buscador"
          placeholder=" Busque su profesional adecuado"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleBuscar()} />


        {cargando && <p>cargando...</p>}

        <div className="container-perfiles">
          <CardProfesional usuarios={usuarios} />
        </div>
      </div>
    </div>
  )
}