import { Request, Response, NextFunction } from 'express'
import { Administrador } from './admin.entity.js'
import { orm } from '../../DB/orm.js';
import { HttpError } from '../types/HttpError.js';
import { Http } from '@mui/icons-material';
//terminado
const em = orm.em.fork();

function sanitizeAdministradorInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    user: req.body.user,
    clave: req.body.clave,
    email: req.body.email
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}


async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const admin = await em.find(Administrador, {})
    if (admin.length > 0) {
      res
        .status(200)
        .json({ message: 'Admins encontrados', data: admin })
    } else {
      res
        .status(200)
        .json({ message: 'No hay admins aun', data: admin })
    }
  } catch (error: any) {
    next(error)
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id
    const admin = await em.findOne(Administrador, { id })
    if (!admin) {
      throw new HttpError(404, 'NOT_FOUND', 'Admin no encontrado')
    }
    res
      .status(200)
      .json({ message: 'Administrador encontrado', data: admin })
  } catch (error: any) {
    next(error)
  }
}

/*async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const admin = em.create(Administrador, req.body)
    await em.flush()
    res
      .status(201)
      .json({ message: 'Administrador creado', data: admin })
  } catch (error: any) {
    next(error)
  }
}*/


/*
function update(req: Request, res: Response) {

}

function remove(req: Request, res: Response) {

}

Ya creados y se loguean aparte */

export { sanitizeAdministradorInput, findAll, findOne, /*add*/ }

