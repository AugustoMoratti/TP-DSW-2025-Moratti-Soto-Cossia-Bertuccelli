import { Request, Response, NextFunction } from 'express'
import { Provincia } from './provincia.entity.js'
import { orm } from '../../DB/orm.js';
import { HttpError } from '../types/HttpError.js';

const em = orm.em.fork();

function sanitizeProvinciaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
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
    const provincia = await em.find(
      Provincia,
      {},
    )
    if (provincia.length > 0) {
      res.status(200).json({ message: 'Todas Las Provincias', data: provincia })
    } else {
      res.status(200).json({ message: 'No hay Provincias aun', data: [] })
    }
  } catch (error: any) {
    next(error)
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const nombre = req.params.nombre
    const provincia = await em.findOne(
      Provincia,
      { nombre },
    )
    if (!provincia) {
      throw new HttpError(404, 'PROVINCIA_NOT_FOUND', 'Provincia no encontrada');
    }
    res.status(200).json({ message: 'Provincia encontrada', data: provincia })
  } catch (error: any) {
    next(error)
  }
}

async function add(req: Request, res: Response, next: NextFunction) {
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
    next(error)
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const nombre = req.params.nombre
    const { nombreNuevo } = req.body.sanitizedInput
    if (typeof nombreNuevo !== 'string' || nombreNuevo === "") {
      throw new HttpError(400, 'INVALID_INPUT', 'El nombre nuevo es obligatorio y debe ser un string')
    }
    const provinciaToUpdate = await em.findOne(Provincia, { nombre })
    if (!provinciaToUpdate) {
      throw new HttpError(404, 'PROVINCIA_NOT_FOUND', 'Provincia no encontrada')
    }
    em.assign(provinciaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'Provincia actualizada', data: provinciaToUpdate })
  } catch (error: any) {
    next(error)
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
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
    next(error)
  }
}

export { findAll, findOne, add, update, remove, sanitizeProvinciaInput }

