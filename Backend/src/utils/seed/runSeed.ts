import { orm } from "../../../DB/orm.js";
import { cargarUbicaciones } from "./cargarUbicaciones.js";

(async () => {
  try {
    await orm.connect(); //necesario ya que no se esta ejecutando en el servidor,sino que es un script de una sola ejecucion.
    await cargarUbicaciones();
  } catch (err) {
    console.error(err);
    console.log("Error al correr el seed de ubicaciones");
  } finally {
    await orm.close(true);
    process.exit(0); // para que node termine el proceso, sino puede que quede la terminal colgada (no es divertido)
  }
})();