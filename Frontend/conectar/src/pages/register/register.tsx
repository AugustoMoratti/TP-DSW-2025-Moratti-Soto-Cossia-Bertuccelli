import StandardInput from '../../components/form/Form.tsx';
import { Button } from '../../components/button/Button.tsx';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import './register.css';

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [apel, setApel] = useState("");
  const [date, setDate] = useState<string>("")
  const [prov, setProv] = useState("");
  const [local, setLocal] = useState("");
  const [dire, setDire] = useState("");
  const [telef, setTelef] = useState("");
  const [telefonoError, setTelefonoError] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [term, setTerm] = useState(false);
  const [confirmarClave, setConfirmarClave] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const control = async () => {

    const now = new Date();
    const fechaMinima = new Date(
      now.getFullYear() - 18,
      now.getMonth(),
      now.getDate()
    );

    const fechaNacimiento = new Date(date);

    // Validaciones previas
    if (!nombre || !apel || !date || !prov || !local || !dire || !telef || !email || !clave || !confirmarClave) {
      setError("⚠️ Por favor, completa todos los campos antes de continuar.");
      return;
    }

    if (!email || !email.includes("@")) {
      setError("⚠️ Ingrese un email válido.");
      return;
    }

    const emailNorm = email.trim().toLowerCase();

    // si termina en algún dominio prohibido -> error
    const adminBlockedDomains = ["@admin.com"];
    if (adminBlockedDomains.some(d => emailNorm.endsWith(d))) {
      setError("⚠️ No está permitido registrarse con un email de administrador.");
      return;
    }

    if (fechaNacimiento > fechaMinima) {
      setError("⚠️ Necesitas ser mayor de 18 años.");
      return;
    }

    if (telef.length < 7 || telef.length > 15) {
      setError("⚠️ El número de teléfono debe tener entre 7 y 15 dígitos.");
      return;
    }

    if (clave !== confirmarClave) {
      setError("⚠️ Las claves no coinciden.");
      return;
    }

    if (!term) {
      setError("⚠️ Debes aceptar los términos antes de continuar.");
      return;
    }

    setError("");
    console.log("✅ Enviando formulario...");

    try {
      const response = await fetch('http://localhost:3000/api/usuario/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido: apel,
          direccion: dire,
          fechaNac: date,
          contacto: telef,
          email,
          clave,
          provincia: prov,
          localidad: local
        })
      });

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (!response.ok) {
        setError(data.error || "❌ Error en el registro.");
        return;
      }

      // Registro exitoso
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("⚠️ Error de conexión con el servidor.");
    }
  };

  return (
    <section className="main-bg">
      <img src="../assets/conect_1.png" alt="Logo" style={{ height: '150px' , cursor: 'pointer'}} onClick={() => navigate("/")}/>

      <div className="card">
        <div className="card-header">
          <span className="card-title">REGISTRO</span>
        </div>

        <div className="card-content">
          <StandardInput label="Nombre" value={nombre} onChange={setNombre} />
          <StandardInput label="Apellido" value={apel} onChange={setApel} />
          <StandardInput label="Fecha de nacimiento" value={date} onChange={setDate} type='date' />
          <StandardInput label="Provincia" value={prov} onChange={setProv} />
          <StandardInput label="Localidad" value={local} onChange={setLocal} />
          <StandardInput label="Direccion" value={dire} onChange={setDire} />
          <StandardInput
            label="Teléfono"
            value={telef}
            onChange={(val) => {
              if (/^\d*$/.test(val)) {
                setTelef(val);
                setTelefonoError("");
              } else {
                setTelefonoError("Solo se permiten números");
              }
            }}
            type="tel"
          />
          <StandardInput label="Email" value={email} onChange={setEmail} type="email" />
          <StandardInput label="Clave" value={clave} onChange={setClave} type="password" />
          <StandardInput label="Confirmar clave" value={confirmarClave} onChange={setConfirmarClave} type="password" />

          {telefonoError && (
            <div style={{ color: "red", fontSize: "0.9em" }}>{telefonoError}</div>
          )}

          {confirmarClave && clave !== confirmarClave && (
            <div style={{ color: 'red', fontSize: '0.95em', marginBottom: '0.5em' }}>
              Las claves no coinciden
            </div>
          )}

          <div className="term">
            <input
              type="checkbox"
              id="term"
              checked={term}
              onChange={() => setTerm(!term)}
            />
            <label htmlFor="term">
              Acepto los             <button
              className="cta-link"
              type="button"
              onClick={() => navigate("/terminos")}
            >
              terminos de Conectar
            </button>
            </label>
          </div>

          <div className="card-actions">
            <button
              className="cta-link"
              type="button"
              onClick={() => navigate("/login")}
            >
              ¿Ya tiene cuenta? Inicie sesión aquí
            </button>

            <Button
              variant="contained"
              icon={<CheckIcon />}
              onClick={control}
              type="button"
            >
              Enviar
            </Button>

            {error && (
              <div style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
