import { Router } from "express"
import { sanitizeProfesionInput, findAllActive, findAllInactive, findOne, add, update, remove } from './profesion.controler.js'

export const profesionesRouter = Router()

profesionesRouter.get('/', findAllActive)
profesionesRouter.get('/inactive', findAllInactive)
profesionesRouter.get('/:id', findOne)
profesionesRouter.post('/', sanitizeProfesionInput, add)
profesionesRouter.put('/:id', sanitizeProfesionInput, update)
profesionesRouter.patch('/:id', sanitizeProfesionInput, update)
profesionesRouter.delete('/:id', remove)

export default profesionesRouter;