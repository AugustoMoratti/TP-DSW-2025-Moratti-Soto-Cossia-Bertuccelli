import { Router } from 'express'
import { reaccionar, getReacciones } from './reaccion.controller.js'

export const reaccionRouter = Router()

reaccionRouter.get('/:idPosteo', getReacciones)

reaccionRouter.post('/:idPosteo', reaccionar)
