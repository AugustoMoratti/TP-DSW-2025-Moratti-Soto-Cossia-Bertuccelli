import { Request, Response, NextFunction } from 'express'
import { Administrador } from './admin.entity.js'
import { orm } from '../../DB/orm.js';

const em = orm.em

function sanitizeAdministradorInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    user: req.body.user,
    clave: req.body.clave,
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}


async function findAll(req: Request, res: Response) {
  try {
    const admin = await em.find(Administrador, {})
    res
      .status(200)
      .json({ message: 'found all Admins', data: admin })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const user = req.params.user
    const admin = await em.findOneOrFail(Administrador, { user })
    res
      .status(200)
      .json({ message: 'found Administrador', data: admin })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const admin = em.create(Administrador, req.body)
    await em.flush()
    res
      .status(201)
      .json({ message: 'Usuario class created', data: admin })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
/*
function update(req: Request, res: Response) {

}

function remove(req: Request, res: Response) {

}

Ya creados y se loguean aparte */

export { sanitizeAdministradorInput, findAll, findOne, add }

