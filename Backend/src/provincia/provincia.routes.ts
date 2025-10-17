import { Router } from 'express'
import { findAll, findOne, add, update, remove, sanitizeProvinciaInput } from './provincia.controler.js'

export const provinciaRouter = Router()

provinciaRouter.get('/', findAll)
provinciaRouter.get('/:nombre', findOne)
provinciaRouter.post('/', sanitizeProvinciaInput, add)
provinciaRouter.put('/:nombre', sanitizeProvinciaInput, update)
provinciaRouter.patch('/:nombre', sanitizeProvinciaInput, update)
provinciaRouter.delete('/:nombre', remove)

export default provinciaRouter;