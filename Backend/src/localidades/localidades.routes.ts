import { Router } from "express"
import { sanitizeLocalidadesInput, findAll, findAll, add, update, remove } from "./localidades/localidades.controler.js" //Sale error pues no estan definidas

export const localidadesRouter = Router()

localidadesRouter.get('/', findAll)
localidadesRouter.get('/:id', findOne)
localidadesRouter.post('/', sanitizeLocalidadesInput, add)
localidadesRouter.put('/:id', sanitizeLocalidadesInput, update)
localidadesRouter.patch('/;id', sanitizeLocalidadesInput, update)
localidadesRouter.delete('/:id', remove)