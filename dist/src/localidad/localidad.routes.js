import { Router } from "express";
import { sanitizeLocalidadInput, findOne, findAll, add, update, remove } from "./localidad.controler.js";
export const localidadesRouter = Router();
localidadesRouter.get('/', findAll);
localidadesRouter.get('/:id', findOne);
localidadesRouter.post('/', sanitizeLocalidadInput, add);
localidadesRouter.put('/:id', sanitizeLocalidadInput, update);
localidadesRouter.patch('/;id', sanitizeLocalidadInput, update);
localidadesRouter.delete('/:id', remove);
//# sourceMappingURL=localidad.routes.js.map