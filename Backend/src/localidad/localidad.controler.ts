import { Request, Response, NextFunction } from 'express';
import { Localidad } from './localidades.entity.js';
import { orm } from '../../DB/orm.js';

const em = orm.em

function sanitizeLocalidadInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        codPostal: req.body.codPostal,
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
    const localidad = await em.find(
      Localidad,
      {},
    )
    res.status(200).json({ message: 'found all localidades', data: localidad })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const localidad = await em.findOneOrFail(
      Localidad,
      { id },
    )
    res.status(200).json({ message: 'found localidad', data: localidad })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const localidad = em.create(Localidad, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'localidad created', data: localidad })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const localidadToUpdate = await em.findOneOrFail(Localidad, { id })
    em.assign(localidadToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'Localidad updated', data: localidadToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const localidad = em.getReference(Localidad, id)
    await em.removeAndFlush(localidad)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


export {
  findAll,
  findOne,
  add,
  update,
  remove
};
