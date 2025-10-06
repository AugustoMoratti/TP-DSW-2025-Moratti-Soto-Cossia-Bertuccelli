import React, { useState } from 'react';
import './app.css';
import StandardInput, { Button } from './components/Form';
import CheckIcon from '@mui/icons-material/Check';

export default function App() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");

  return (
    <section className="main-bg">
      <div className="card">
        <div className="card-header">
          <span className="card-title">CONECTAR</span>
        </div>
        <div className="card-content">
          <StandardInput label="Usuario" value={usuario} onChange={setUsuario} />
          <StandardInput label="Clave" value={clave} onChange={setClave} type="password" />
          <Button variant="contained" icon={<CheckIcon />}>
            Enviar
          </Button>
        </div>
      </div>
    </section>
  );
}