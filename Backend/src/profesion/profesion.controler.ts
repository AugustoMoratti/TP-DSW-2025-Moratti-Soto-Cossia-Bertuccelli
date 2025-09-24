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
  try {
    const profesiones = await em.find(Profesiones, {})
    res
      .status(200)
      .json({ message: 'found all Profeciones', data: profesiones })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const profesiones = await em.findOneOrFail(Profesiones, { id })
    res
      .status(200)
      .json({ message: 'found Profesion', data: profesiones })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

function add(req: Request, res: Response) {
  try {
    const profesion = em.create(Profesiones, req.body)
    await em.flush()
    res
      .status(201)
      .json({ message: 'Profesion class created', data: profesion })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const profesion = em.getReference(Profesiones, id)
    em.assign(profesion, req.body)
    await em.flush()
    res.status(200).json({ message: 'Profesion class updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const profesion = em.getReference(Profesiones, id)
    await em.removeAndFlush(Profesiones)
    res.status(200).send({ message: 'Profesion deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export {
  sanitizeProfesionesInput,
  findAll,
  findOne,
  add,
  update,
  remove
};
