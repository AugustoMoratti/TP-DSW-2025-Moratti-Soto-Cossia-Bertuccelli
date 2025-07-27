import { Router } from 'express'
import { sanitizeProvinciaInput, findAll, findOne, add, update, remove } from './provincia.controler.js'

export const provinciaRouter = Router()

provinciaRouter.get('/', findAll)
provinciaRouter.get('/:id', findOne)
provinciaRouter.post('/', sanitizeProvinciaInput, add)
provinciaRouter.put('/:id', sanitizeProvinciaInput, update)
provinciaRouter.patch('/:id', sanitizeProvinciaInput, update)
provinciaRouter.delete('/:id', remove)

export default provinciaRouter;