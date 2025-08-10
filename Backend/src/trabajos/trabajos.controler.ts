import { Request, Response, NextFunction } from 'express'
import { TrabajosRepository } from './trabajos.repository.js'
import { Trabajo } from './trabajos.entity.js'

const repository = new TrabajosRepository()

function sanitizeTrabajoInput(req:Request, res:Response, next:NextFunction) {
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

function findAll(req:Request, res: Response) {
    res.json({ data: repository.findAll() })
}

function findOne(req: Request, res:Response){
    const id = req.params.id
    const trabajo = repository.findOne({ id })
    if (!trabajo) {
        res.status(404).send({ message: 'El trabajo no se encontro' })
        return
    }
    res.json({ data: trabajo })
}

function add(req: Request, res: Response) {
    const input = req.body.sanitizedInput

    const trabajoInput = new Trabajo(
        input.id,
        input.estado,
        input.fecha_solicitud,
        input.fecha_realizado,
        input.montoTotal,
    )

    const trabajo = repository.add(trabajoInput)
    if (trabajo) {
        res.status(201).send({ message: 'Trabajo creado', data: trabajo })
        return
    } else {
        res.status(404).send({ message: 'Trabajo ya existente' })
        return
    }
}

function update(req: Request, res: Response) {
    req.body.sanitizedInput.id = req.params.id
    const trabajo = repository.update(req.body.sanitizedInput)

    if (!trabajo) {
        res.status(404).send({ message: 'El trabajo no se encontro' })
        return
    }
    res.status(200).send({ message: 'Trabajo actualizado correctamente', data: trabajo })
}

function remove(req: Request, res: Response) {
    const id = req.params.id
    const trabajo = repository.delete({ id })

    if (!trabajo) {
        res.status(404).send({ message: 'El trabajo no se encontro' })
        return
    } else {
        res.status(200).send({ message: 'Trabajo borrado correctamente' })
    }
}

export { sanitizeTrabajoInput, findAll, findOne, add, update, remove }