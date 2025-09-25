import { Router } from "express"
import { findOne, findAll, add, update, remove, sanitizeLocalidadInput } from "./localidad.controler.js"
//import { removeListener } from "process"

export const localidadesRouter = Router()

localidadesRouter.get('/', findAll)
localidadesRouter.get('/:id', findOne)
localidadesRouter.post('/', sanitizeLocalidadInput, add)
localidadesRouter.put('/:id', sanitizeLocalidadInput, update)
localidadesRouter.patch('/;id', sanitizeLocalidadInput, update)
localidadesRouter.delete('/:id', remove)