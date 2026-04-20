import { Router } from 'express'
import { findAll, findOne, findOne2, add, update, remove, sanitizeUsuarioInput, buscarUsuarios, addProfesiones, deleteProfesion, banUsuario, unbanUsuario } from './usuario.controler.js'
import { login, register, me, logout } from '../auth/auth.controller.js'
import { authMiddleware, refreshCookieMiddleware } from '../middleware/authMiddleware.js'
import { upload } from '../utils/upload.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)
usuarioRouter.get('/buscar', buscarUsuarios);
usuarioRouter.get('/me', authMiddleware, refreshCookieMiddleware, me)
usuarioRouter.get('/:id', findOne)
usuarioRouter.get('/:id/busquedaCliente', findOne2)
usuarioRouter.post('/logout', logout)
usuarioRouter.post('/login', login)
usuarioRouter.post('/register', sanitizeUsuarioInput, register)
usuarioRouter.post('/', sanitizeUsuarioInput, add)
usuarioRouter.post('/profesiones', authMiddleware, addProfesiones)
usuarioRouter.put('/:id', sanitizeUsuarioInput, upload.single('imagen'), update)
usuarioRouter.put('/deletedProfesiones/:id', sanitizeUsuarioInput, deleteProfesion)
usuarioRouter.put('/:id/ban', banUsuario)
usuarioRouter.put('/:id/unban', unbanUsuario)
usuarioRouter.patch('/:id', sanitizeUsuarioInput, upload.single('imagen'), update)
usuarioRouter.delete('/:id', remove)

export default usuarioRouter;