import { Router } from 'express'
import { findAll, findOne, add, update, remove, sanitizeUsuarioInput } from './usuario.controler.js'
import { login, register, me } from '../auth/auth.controller.js'

export const usuarioRouter = Router()

usuarioRouter.get('/', findAll)
usuarioRouter.get('/:id', findOne)
usuarioRouter.get('/login', login)
usuarioRouter.post('/register', sanitizeUsuarioInput, register)
usuarioRouter.post('/', sanitizeUsuarioInput, add)
usuarioRouter.put('/:id', sanitizeUsuarioInput, update)
usuarioRouter.patch('/:id', sanitizeUsuarioInput, update)
usuarioRouter.delete('/:id', remove)

export default usuarioRouter;