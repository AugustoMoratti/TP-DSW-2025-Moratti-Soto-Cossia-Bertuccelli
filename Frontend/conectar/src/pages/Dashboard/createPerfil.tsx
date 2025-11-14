import "./createPerfil.css"
import { useState } from "react"


export default function CreatePerfilAdmin() {

  const [clave, setClave] = useState('');
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const addAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!email || !clave || !user) {
      setError("⚠️ Por favor, completa todos los campos antes de continuar.");
      return;
    }
    console.log("✅ Enviando formulario...");

    try {
      const response = await fetch(`http://localhost:3000/api/admin/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user,
          email,
          clave
        })
      })
      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (!response.ok) {
        setError(data.error || "❌ Error en el registro.");
        return;
      }

      setUser("");
      setEmail("");
      setClave("");
      setShowModal(true);

    } catch (err) {
      console.error(err);
      setError("⚠️ Error de conexión con el servidor.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <h2 className="title-createAdmin">Crear perfil de administrador</h2>
      <div className="container-formAdmin">
        <form action="donde va la info" method="POST" className="formularioCreateAdmin" onSubmit={addAdmin}>
          <div className="container-inputsCreateAdmin">
            <input className='input_dashboard' type="text" name="Username" value={user} id="" placeholder="Username" onChange={(e) => setUser(e.target.value)} required />
            <input className='input_dashboard' type="email" name="Email" value={email} id="" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input className='input_dashboard' type="password" name="Clave" value={clave} id="" placeholder="Clave" onChange={(e) => setClave(e.target.value)} required />
          </div>
          <button type="submit" className="createAdmin">Crear Adminsitrador</button>
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-card">
                <h2>✅ Administrador registrada</h2>
                <p>El admin fue creado con exito.</p>
                <button className="notfound-btn" onClick={handleCloseModal}>
                  Volver
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  ) 
}