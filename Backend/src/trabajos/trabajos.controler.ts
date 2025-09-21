import { Request, Response, NextFunction } from 'express'
import { Trabajo } from './trabajos.entity.js'
import { orm } from '../../DB/orm.js';




function sanitizeTrabajoInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        fecha_solicitud: req.body.fecha_solicitud,
        fecha_realizado: req.body.fecha_realizado,
        montoTotal: req.body.montoTotal,
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

export { sanitizeTrabajoInput, findAll, findOne, add, update, remove }