import "./createPerfil.css"

export default function CreatePerfilAdmin() {
  return (
    <>
      <h2 className="title-createAdmin">Crear perfil de administrador</h2>
      <div className="container-formAdmin">
        <form action="donde va la info" method="POST" className="formularioCreateAdmin">
          <div className="container-inputsCreateAdmin">
            <input type="text" name="Username" id="" placeholder="Username" />
            <input type="text" name="Email" id="" placeholder="Email" />
            <input type="password" name="Clave" id="" placeholder="clave" />
          </div>
          <button type="submit" className="createAdmin">Crear Adminsitrador</button>
        </form>
      </div>
    </>
  )
}