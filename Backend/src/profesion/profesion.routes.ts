import { Router } from "express"
import { sanitizeProfesionesInput, findAllActive, findAllInactive, findOne, add, update, remove } from './profesion.controler.js'

export const profesionesRouter = Router()

profesionesRouter.get('/', findAllActive)
profesionesRouter.get('/inactive', findAllInactive)
profesionesRouter.get('/:id', findOne)
profesionesRouter.post('/', sanitizeProfesionesInput, add)
profesionesRouter.put('/:id', sanitizeProfesionesInput, update)
profesionesRouter.patch('/:id', sanitizeProfesionesInput, update)
profesionesRouter.delete('/:id', remove)

export default profesionesRouter;