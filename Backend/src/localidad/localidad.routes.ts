import { Router } from "express"
import { sanitizeLocalidadInput, findOneLocalidad, findAllLocalidad, addLocalidad, updateLocalidad, removeLocalidad } from "./localidad.controler.js" //Sale error pues no estan definidas

export const localidadesRouter = Router()

localidadesRouter.get('/', findAllLocalidad)
localidadesRouter.get('/:id', findOneLocalidad)
localidadesRouter.post('/', sanitizeLocalidadInput, addLocalidad)
localidadesRouter.put('/:id', sanitizeLocalidadInput, updateLocalidad)
localidadesRouter.patch('/;id', sanitizeLocalidadInput, updateLocalidad)
localidadesRouter.delete('/:id', removeLocalidad)