import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './provincia.controler.js'

export const provinciaRouter = Router()

provinciaRouter.get('/', findAll)
provinciaRouter.get('/:id', findOne)
provinciaRouter.post('/', add)
provinciaRouter.put('/:id', update)
provinciaRouter.patch('/:id', update)
provinciaRouter.delete('/:id', remove)

export default provinciaRouter;