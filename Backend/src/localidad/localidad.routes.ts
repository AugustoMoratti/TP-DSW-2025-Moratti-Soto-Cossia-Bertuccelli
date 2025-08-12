import { Router } from "express"
import { findOne, findAll, add, update, remove } from "./localidad.controler.js" 
//import { removeListener } from "process"

export const localidadesRouter = Router()

localidadesRouter.get('/', findAll)
localidadesRouter.get('/:id', findOne)
localidadesRouter.post('/', add)
localidadesRouter.put('/:id', update)
localidadesRouter.patch('/;id', update)
localidadesRouter.delete('/:id', remove)