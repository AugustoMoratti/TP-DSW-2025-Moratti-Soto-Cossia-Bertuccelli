import { Router } from "express"
import { findOne, findAll, add, update, remove, sanitizeLocalidadInput } from "./localidad.controler.js"
//import { removeListener } from "process"

export const localidadesRouter = Router()

localidadesRouter.get('/', findAll)
localidadesRouter.get('/:nombre', findOne)
localidadesRouter.post('/', sanitizeLocalidadInput, add)
localidadesRouter.put('/:nombre', sanitizeLocalidadInput, update)
localidadesRouter.patch('/:nombre', sanitizeLocalidadInput, update)
localidadesRouter.delete('/:nombre', remove)