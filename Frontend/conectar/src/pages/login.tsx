import StandardInput, { Button } from '../components/Form';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import "../../components/Button.css";
import "../../components/Form.css";

export default function Login() { 
  const [usuario, setUsuario] = useState("");
const [clave, setClave] = useState("");
const navigate = useNavigate();

  return (
    <section className="main-bg">
      <img src="../assets/conect_1.png" alt="Logo" className='logo'/>
    <div className="card">
      <div className="card-header">
        <span className="card-title">INICIE SESIÓN </span>
      </div>
      <div className="card-content">
        <StandardInput label="Usuario" value={usuario} onChange={setUsuario} />
        <StandardInput label="Clave" value={clave} onChange={setClave} type="password" />
        <div className="card-actions">
          <button
            className="cta-link"
            type="button"
            onClick={() => navigate("/registro")}
          >
            ¿No tiene cuenta? Cree una ahora mismo
          </button>
          <Button variant="contained" icon={<CheckIcon />}>
            Enviar 
          </Button> 
          </div>
      </div>
    </div>
    </section>
  );
}


//CAMBIAR COLOR DEL BOTON