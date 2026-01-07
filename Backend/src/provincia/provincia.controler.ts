import { Request, Response, NextFunction } from 'express'
import { Provincia } from './provincia.entity.js'
import { orm } from '../../DB/orm.js';
import { HttpError } from '../types/HttpError.js';

const em = orm.em.fork();

function sanitizeProvinciaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    id: req.body.id
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
    const provincia = await em.find(
      Provincia,
      {},
    )
    if (provincia.length === 0) {
      res.status(200).json({ message: 'Todas Las Provincias', data: provincia })
    } else {
      res.status(200).json({ message: 'No hay Provincias aun', data: [] })
    }
  } catch (error: any) {
    throw new HttpError(500, 'INTERNAL_SERVER_ERROR', error.message)
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const nombre = req.params.nombre
    const provincia = await em.findOneOrFail(
      Provincia,
      { nombre },
    )
    if (!provincia) {
      throw new HttpError(404, 'PROVINCIA_NOT_FOUND', 'Provincia no encontrada')
    }
    res.status(200).json({ message: 'Provincia encontrada', data: provincia })
  } catch (error: any) {
    throw new HttpError(500, 'INTERNAL_SERVER_ERROR', error.message)
  }
}

async function add(req: Request, res: Response) {
  try {
    const { nombre } = req.body.sanitizedInput
    if (typeof nombre !== 'string' || nombre === "") {
      throw new HttpError(400, 'INVALID_INPUT', 'El nombre es obligatorio y debe ser un string')
    };
    const provincia = new Provincia();
    provincia.nombre = nombre;
    em.persist(provincia);
    await em.flush();
    res.status(201).json({ message: 'Provincia creada', data: provincia })
  } catch (error: any) {
    throw new HttpError(500, 'INTERNAL_SERVER_ERROR', error.message)
  }
}

async function update(req: Request, res: Response) {
  try {
    const nombre = req.params.nombre
    const { nombreNuevo } = req.body.sanitizedInput
    if (typeof nombreNuevo !== 'string' || nombreNuevo === "") {
      throw new HttpError(400, 'INVALID_INPUT', 'El nombreNuevo es obligatorio y debe ser un string')
    }
    const provinciaToUpdate = await em.findOneOrFail(Provincia, { nombre })
    if (!provinciaToUpdate) {
      throw new HttpError(404, 'PROVINCIA_NOT_FOUND', 'Provincia no encontrada')
    }
    em.assign(provinciaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'Provincia actualizada', data: provinciaToUpdate })
  } catch (error: any) {
    throw new HttpError(500, 'INTERNAL_SERVER_ERROR', error.message)
  }
}

async function remove(req: Request, res: Response) {
  try {
    const nombre = req.params.nombre;
    // buscar la entidad primero
    const provincia = await em.findOne(Provincia, { nombre });
    if (!provincia) {
      throw new HttpError(404, 'PROVINCIA_NOT_FOUND', 'Provincia no encontrada');
    }
    await em.removeAndFlush(provincia);
    res.status(200).json({ message: "Provincia eliminada", data: provincia });
  } catch (error: any) {
    throw new HttpError(500, 'INTERNAL_SERVER_ERROR', error.message);
  }
}

export { findAll, findOne, add, update, remove, sanitizeProvinciaInput }

