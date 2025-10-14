import StandardInput from '../components/form/Form.tsx';
import { Button } from '../components/button/Button.tsx';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import "../components/button/Button.css";
import "../components/form/Form.css";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apel, setApel] = useState("");
  const [dire, setDire] = useState("");
  const [telef, setTelef] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const navigate = useNavigate();

    return (
    <section className="main-bg">
      <img src="../assets/conect_1.png" alt="Logo" className='logo' />
      <div className="card">
        <div className="card-header">
          <span className="card-title">REGISTRO</span>
        </div>
        <div className="card-content">
          <StandardInput label="Nombre" value={nombre} onChange={setNombre} />
          <StandardInput label="Apellido" value={apel} onChange={setApel} />
          <StandardInput label="Direccion" value={dire} onChange={setDire} />
          <StandardInput label="Telefono" value={telef} onChange={setTelef} />
          <StandardInput label="Email" value={email} onChange={setEmail} />
          <StandardInput label="Clave" value={clave} onChange={setClave} type="password" />
          <StandardInput label="Confirmar clave" value={confirmarClave} onChange={setConfirmarClave} type="password" />
          {confirmarClave && clave !== confirmarClave && (
            <div style={{ color: 'red', fontSize: '0.95em', marginBottom: '0.5em' }}>
              Las claves no coinciden
            </div>
          )}
          <div className="card-actions">
            <button
              className="cta-link"
              type="button"
              onClick={() => navigate("/login")}
            >
              Ya tiene cuenta? Inicie sesión aquí
            </button>
            <Button
              variant="contained"
              icon={<CheckIcon />}
              disabled={!clave || clave !== confirmarClave}
            >
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}