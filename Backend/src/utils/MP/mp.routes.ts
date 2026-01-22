import { Router } from 'express'
import { create_preference } from './mp.controler.js'


export const MPRouter = Router()

MPRouter.post('/create-preference', create_preference)

export default MPRouter;