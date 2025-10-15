import "./profesiones.css"

export default function SolicProfesiones() {
  return (
    <>
      <h2 className="title-profesiones">Solicitudes de profesiones</h2>
      <div className="container-table">
        <table className="table-profesiones">
          <thead>
            <tr>
              <th>Nombre Profesion</th>
              <th>Descripcion</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Profesion 1</td>
              <td>Descripcion...</td>
              <td>10/7/2025</td>
              <td>Pendiente</td>
              <td className="btn-td">
                <button className="btn-rechazo">Rechazar</button>
                <button className="btn-aceptado">Aceptar</button>
              </td>
            </tr>
            <tr>
              <td>Profesion 2</td>
              <td>Descripcion...</td>
              <td>10/8/2025</td>
              <td>Pendiente</td>
              <td className="btn-td">
                <button className="btn-rechazo">Rechazar</button>
                <button className="btn-aceptado">Aceptar</button>
              </td>
            </tr>
            <tr>
              <td>Profesion 3 </td>
              <td>Descripcion...</td>
              <td>10/9/2025</td>
              <td>Pendiente</td>
              <td className="btn-td">
                <button className="btn-rechazo">Rechazar</button>
                <button className="btn-aceptado">Aceptar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
};