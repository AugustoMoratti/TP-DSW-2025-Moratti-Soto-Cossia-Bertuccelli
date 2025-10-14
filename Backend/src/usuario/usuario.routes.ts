import { Router } from 'express'
import { findAll, findOne, add, update, remove, sanitizeUsuarioInput, buscarUsuarios } from './usuario.controler.js'
import { login, register, me } from '../auth/auth.controller.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)
usuarioRouter.get('/buscar', buscarUsuarios);
usuarioRouter.get('/:id', findOne)
usuarioRouter.get('/me', authMiddleware, me)
usuarioRouter.get('/login', login)
usuarioRouter.post('/register', sanitizeUsuarioInput, register)
usuarioRouter.post('/', sanitizeUsuarioInput, add)
usuarioRouter.put('/:id', sanitizeUsuarioInput, update)
usuarioRouter.patch('/:id', sanitizeUsuarioInput, update)
usuarioRouter.delete('/:id', remove)

export default usuarioRouter;