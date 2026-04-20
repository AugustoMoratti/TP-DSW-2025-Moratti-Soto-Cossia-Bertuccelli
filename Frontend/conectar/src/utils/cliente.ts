export const busquedaCliente = async (idCliente: string) => {

  try {
    const res = await fetch(`http://localhost:3000/api/usuario/${idCliente}/busquedaCliente`, {
      method: "GET",
    });


    const cliente = await res.json();
    const nombre = cliente.nombre
    const apellido = cliente.apellido
    const nombreCompleto = `${nombre} + ${apellido}`

    return nombreCompleto

  } catch (err) {
    console.error("Error al obtener detalle:", err);
    return
  }

}