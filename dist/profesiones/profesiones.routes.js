import { Router } from "express";
import { sanitizeProfesionesInput, findAll, findOne, add, update, remove } from './profesiones.controler.js'; //Si sale error, es porque todavia no se han definido las funciones en el controlador
export const profesionesRouter = Router();
profesionesRouter.get('/', findAll);
profesionesRouter.get('/:id', findOne);
profesionesRouter.post('/', sanitizeProfesionesInput, add);
profesionesRouter.put('/:id', sanitizeProfesionesInput, update);
profesionesRouter.patch('/:id', sanitizeProfesionesInput, update);
profesionesRouter.delete('/:id', remove);
export default profesionesRouter;
//# sourceMappingURL=profesiones.routes.js.map