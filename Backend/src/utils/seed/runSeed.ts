import { orm } from "../../../DB/orm.js";
import { cargarUbicaciones } from "./cargarUbicaciones.js";

(async () => {
  try {
    await orm.connect();
    await cargarUbicaciones();
  } catch (err) {
    console.error(err);
    console.log("Error al correr el seed de ubicaciones");
  } finally {
    await orm.close(true);
    process.exit(0);
  }
})();