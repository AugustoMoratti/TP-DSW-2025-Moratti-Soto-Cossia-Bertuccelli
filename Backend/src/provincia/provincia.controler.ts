import { Request, Response, NextFunction } from 'express'
import { Provincia } from './provincia.entity.js'
import { orm } from '../../DB/orm.js';

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const provincia = await em.find(
      Provincia,
      {},
    )
    res.status(200).json({ message: 'found all Provincia', data: provincia })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const provincia = await em.findOneOrFail(
      Provincia,
      { id },
    )
    res.status(200).json({ message: 'found provincia', data: provincia })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const provincia = em.create(Provincia, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'provincia created', data: provincia })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const provinciaToUpdate = await em.findOneOrFail(Provincia, { id })
    em.assign(provinciaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'provincia updated', data: provinciaToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const provincia = em.getReference(Provincia, id)
    await em.removeAndFlush(provincia)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove }

