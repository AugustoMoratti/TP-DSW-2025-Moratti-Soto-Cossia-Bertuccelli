import "./createPerfil.css"
import { useState } from "react"


export default function CreatePerfilAdmin() {

  const [clave, setClave] = useState('');
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

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
      alert("Administrador creado correctamente!");

    } catch (err) {
      console.error(err);
      setError("⚠️ Error de conexión con el servidor.");
    }
  };

  return (
    <>
      <h2 className="title-createAdmin">Crear perfil de administrador</h2>
      <div className="container-formAdmin">
        <form action="donde va la info" method="POST" className="formularioCreateAdmin" onSubmit={addAdmin}>
          <div className="container-inputsCreateAdmin">
            <input type="text" name="Username" value={user} id="" placeholder="Username" onChange={(e) => setUser(e.target.value)} required />
            <input type="email" name="Email" value={email} id="" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" name="Clave" value={clave} id="" placeholder="clave" onChange={(e) => setClave(e.target.value)} required />
          </div>
          <button type="submit" className="createAdmin">Crear Adminsitrador</button>
        </form>
      </div>
    </>
  )
}