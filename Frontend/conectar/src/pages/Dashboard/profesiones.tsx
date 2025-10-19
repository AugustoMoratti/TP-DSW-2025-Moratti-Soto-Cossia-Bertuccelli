import useProfesiones from "../../Hooks/useProfesiones.tsx"
import "./profesiones.css"

export default function SolicProfesiones() {
  const {
    profesiones,
    loading,
    error,
    aceptarProfesion,
    rechazarProfesion,
  } = useProfesiones();

  return (
    <>
      {loading && <p>Cargando profesiones...</p>}

      {error && (
        <>
          <h2 className="title-profesiones">{error}</h2>
          <div className="container-table">
            <table className="table-profesiones">
              <thead>
                <tr>
                  <th>Nombre Profesion</th>
                  <th>Descripcion</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Accion</th>
                </tr>
              </thead>
            </table>
          </div>
        </>
      )}


      {(!loading && profesiones.length < 1) && (
        <>
          <h2 className="title-profesiones">No hay profesiones pendientes para mostrar</h2>
          <div className="container-table">
            <table className="table-profesiones">
              <thead>
                <tr>
                  <th>Nombre Profesion</th>
                  <th>Descripcion</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Accion</th>
                </tr>
              </thead>
            </table>
          </div>
        </>
      )}

      {(!loading && profesiones.length > 0) && (
        <>
          <h2 className="title-profesiones">Solicitudes de profesiones</h2>
          <div className="container-table">
            <table className="table-profesiones">
              <thead>
                <tr>
                  <th>Nombre Profesion</th>
                  <th>Descripcion</th>
                  <th>Fecha</th>
                  <th>Accion</th>
                </tr>
              </thead>
              <tbody>
                {profesiones.map((p) =>
                  <tr key={p.nombreProfesion} className="tr-filas">
                    <td className="normal-td">{p.nombreProfesion} </td>
                    <td className="normal-td">{p.descripcionProfesion}</td>
                    <td className="normal-td">{p.fechaSolicitud}</td>
                    <td className="btn-td-container">
                      <button className="btn-rechazo" onClick={() => rechazarProfesion(p.nombreProfesion)}>Rechazar</button>
                      <button className="btn-aceptado" onClick={() => aceptarProfesion(p.nombreProfesion)}>Aceptar</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
};