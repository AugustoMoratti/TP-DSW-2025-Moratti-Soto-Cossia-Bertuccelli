import { Router } from "express"
import { sanitizeProfesionInput, findAllActive, findAllInactive, findOne, add, update, remove } from './profesion.controler.js'

export const profesionesRouter = Router()

profesionesRouter.get('/', findAllActive)
profesionesRouter.get('/inactive', findAllInactive)
profesionesRouter.get('/:nombreProfesion', findOne)
profesionesRouter.post('/', sanitizeProfesionInput, add)
profesionesRouter.put('/:nombreProfesion', sanitizeProfesionInput, update)
profesionesRouter.patch('/:nombreProfesion', sanitizeProfesionInput, update)
profesionesRouter.delete('/:nombreProfesion', remove)

export default profesionesRouter;