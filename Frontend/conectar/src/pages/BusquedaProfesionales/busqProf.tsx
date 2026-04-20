import { useState } from "react";
import Header from "../../components/header/header.tsx"
import type { Usuario } from "../../interfaces/usuario.ts";
import CardProfesional from "../../components/cardsProfesionales/cardsProf.tsx";
import "./busqProf.css";
import { useNavigate } from "react-router";


export default function BusquedaProfesionales() {
  const [query, setQuery] = useState('');
  const [cargando, setCargando] = useState(false);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const navigate = useNavigate();

  /*animate(".container-perfiles", {
    opacity: { from: 0, to: 1 },
    translateY: { from: "7rem", to: 0 },
  });*/

  const handleBuscarUsuarios = () => {
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

      <Header bgColor="#ffffff" logoSrc="/assets/conect_2_1.png">
        <button className="header-btn" onClick={() => navigate("/perfil")}>Mi Perfil</button>
        <button className="header-btn" onClick={() => navigate("/")}>Home</button>
      </Header>

      <div className='main-container'>
        <input
          type="text"
          className="buscador"
          placeholder=" Busque su profesional adecuado"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleBuscarUsuarios()} />


        {cargando && <div className="loading-container">
          <div className="spinner"></div>
        </div>
        }

        <div className="container-perfiles">
          <CardProfesional usuarios={usuarios} />
        </div>
      </div>
    </div>
  )
}