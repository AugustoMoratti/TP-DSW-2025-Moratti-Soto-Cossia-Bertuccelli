import { Router } from 'express'
import { findAll, findOne, add, update, remove, sanitizeUsuarioInput, buscarUsuarios } from './usuario.controler.js'
import { login, register, me, logout } from '../auth/auth.controller.js'
import { authMiddleware, refreshCookieMiddleware } from '../middleware/authMiddleware.js'
import { upload } from '../utils/upload.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)
usuarioRouter.get('/buscar', buscarUsuarios);
usuarioRouter.get('/me', authMiddleware, refreshCookieMiddleware, me)
usuarioRouter.get('/:id', findOne)
usuarioRouter.post('/login', login)
usuarioRouter.post('/register', sanitizeUsuarioInput, register)
usuarioRouter.post('/', sanitizeUsuarioInput, add)
usuarioRouter.put('/:id', sanitizeUsuarioInput, upload.single('imagen'), update)
usuarioRouter.patch('/:id', sanitizeUsuarioInput, upload.single('imagen'), update)
usuarioRouter.delete('/:id', remove)
usuarioRouter.post("/logout", logout);
export default usuarioRouter;