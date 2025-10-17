import { Router } from 'express'
import { sanitizeAdministradorInput, findAll, findOne, add } from './admin.controler.js'
import { loginAdmin, registerAdmin } from '../auth/authAdmin.controller.js'
import { authAdminMiddleware, refreshAdminCookieMiddleware } from '../middleware/authAdminMiddleware.js'
import { meAdmin } from '../auth/authAdmin.controller.js'

export const administradorRouter = Router()

administradorRouter.get('/', findAll)
administradorRouter.get('/:id', findOne)
administradorRouter.get('/login', loginAdmin)
administradorRouter.get('/me', authAdminMiddleware, refreshAdminCookieMiddleware, meAdmin)
administradorRouter.post('/', sanitizeAdministradorInput, add)
administradorRouter.post('/register', sanitizeAdministradorInput, registerAdmin)

/*administradorRouter.put('/:id', sanitizeAdministradorInput, update)
administradorRouter.patch('/:id', sanitizeAdministradorInput, update)
administradorRouter.delete('/:id', remove)*/

export default administradorRouter;