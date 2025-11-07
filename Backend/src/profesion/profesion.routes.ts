import { Router } from "express"
import { sanitizeProfesionInput, findAllActive, findAllInactive, findOne, add, update, remove, busquedaProf } from './profesion.controler.js'
import { authAdminMiddleware, refreshAdminCookieMiddleware } from "../middleware/authAdminMiddleware.js"
import { buscarUsuarios } from "../usuario/usuario.controler.js"

export const profesionesRouter = Router()

profesionesRouter.get('/', /*authAdminMiddleware, refreshAdminCookieMiddleware,*/ findAllActive) //agregarlo a la hora de probar la pagina de admin
profesionesRouter.get('/inactive', findAllInactive)
profesionesRouter.get('/:nombreProfesion', findOne)
profesionesRouter.get('/busqueda', busquedaProf)
profesionesRouter.post('/', sanitizeProfesionInput, add)
profesionesRouter.put('/:nombreProfesion', sanitizeProfesionInput, update)
profesionesRouter.patch('/:nombreProfesion', sanitizeProfesionInput, update)
profesionesRouter.delete('/:nombreProfesion', remove)

export default profesionesRouter;