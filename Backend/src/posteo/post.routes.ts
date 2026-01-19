import { Router } from 'express'
import { sanitizePosteoInput, findAll, findOne, add, findAllForUser, update, remove } from './post.controler.js'

export const postRouter = Router()


postRouter.get('/', findAll)
postRouter.get('/:id', findOne)
postRouter.get('/:emailUser', findAllForUser)
postRouter.post('/', sanitizePosteoInput, add)
postRouter.put('/:id', sanitizePosteoInput, update)
postRouter.patch('/:id', sanitizePosteoInput, update)
postRouter.delete('/:id', remove)


export default postRouter;