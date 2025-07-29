import { Router } from "express"
import { sanitizeProfesionesInput, findAll, findOne, add, update, remove } from './profesion.controler.js' 

export const profesionesRouter = Router()

profesionesRouter.get('/', findAll)
profesionesRouter.get('/:id', findOne)
profesionesRouter.post('/', sanitizeProfesionesInput, add)
profesionesRouter.put('/:id', sanitizeProfesionesInput, update)
profesionesRouter.patch('/:id', sanitizeProfesionesInput, update)
profesionesRouter.delete('/:id', remove)

export default profesionesRouter;