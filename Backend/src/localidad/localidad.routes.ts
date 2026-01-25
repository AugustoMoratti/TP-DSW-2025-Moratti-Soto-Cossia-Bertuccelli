import { Router } from "express"
import { findOne, findAll, add, update, remove, sanitizeLocalidadInput, buscarLocalidades } from "./localidad.controler.js"

export const localidadesRouter = Router()

localidadesRouter.get('/', findAll)
localidadesRouter.get('/buscar', buscarLocalidades)
localidadesRouter.get('/:nombre', findOne)
localidadesRouter.post('/', sanitizeLocalidadInput, add)
localidadesRouter.put('/:nombre', sanitizeLocalidadInput, update)
localidadesRouter.patch('/:nombre', sanitizeLocalidadInput, update)
localidadesRouter.delete('/:nombre', remove)