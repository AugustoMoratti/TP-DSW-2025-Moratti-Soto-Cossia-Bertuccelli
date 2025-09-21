import { Request, Response, NextFunction } from 'express';
import { Profesiones } from './profesion.entity.js';
import { orm } from '../../DB/orm.js';



function sanitizeProfesionesInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombreProf: req.body.nombreProf,
    descProf: req.body.descProf,
    estado: req.body.estado,
    codProf: req.body.codProf,
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

export {
  sanitizeProfesionesInput,
  findAll,
  findOne,
  add,
  update,
  remove
};