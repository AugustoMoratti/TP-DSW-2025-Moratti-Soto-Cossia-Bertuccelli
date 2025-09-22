import { Request, Response, NextFunction } from 'express'
import { administrador } from './admin.entitya.js'
import { orm } from '../../DB/orm.js';

const em = orm.em

function sanitizeAdministradorInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    user: req.body.user,
    clave: req.body.clave,
    estado: req.body.clave,
    idAdmin: req.body.idAdmin,
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

function findAll(req: Request, res: Response) {

}

function findOne(req: Request, res: Response) {

}

function add(req: Request, res: Response) {

}

function update(req: Request, res: Response) {

}

function remove(req: Request, res: Response) {

}

export { sanitizeAdministradorInput, findAll, findOne, add, update, remove }
