import { Request, Response, NextFunction } from 'express'
import { Trabajo } from './trabajos.entity.js'
import { orm } from '../../DB/orm.js';


const em = orm.em


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

async function findAll(req: Request, res: Response) {
  try {
    const trabajos = await em.find(Trabajo, {})
    res
      .status(200)
      .json({ message: 'found all Trabajos', data: trabajos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const trabajo = await em.findOneOrFail(Trabajo, { id })
    res
      .status(200)
      .json({ message: 'found Trabajo', data: trabajo })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const trabajo = em.create(Trabajo, req.body)
    await em.flush()
    res
      .status(201)
      .json({ message: 'Trabajo class created', data: trabajo })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const trabajo = em.getReference(Trabajo, id)
    em.assign(trabajo, req.body)
    await em.flush()
    res.status(200).json({ message: 'Trabajo class updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const trabajo = em.getReference(Trabajo, id)
    await em.removeAndFlush(trabajo)
    res.status(200).send({ message: 'Trabajo deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeTrabajoInput, findAll, findOne, add, update, remove }
