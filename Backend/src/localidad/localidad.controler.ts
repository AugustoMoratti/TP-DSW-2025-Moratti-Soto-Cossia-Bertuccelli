import { Request, Response, NextFunction } from 'express';
import { Localidad } from './localidades.entity.js';
import { Provincia } from '../provincia/provincia.entity.js';
import { orm } from '../../DB/orm.js';
import { HttpError } from '../types/HttpError.js';


const em = orm.em.fork();

function sanitizeLocalidadInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    provincia: req.body.provincia
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
    const localidad = await em.find(
      Localidad,
      {},
      { populate: ['provincia'] }
    )
    if (localidad.length > 0) {
      res.status(200).json({ message: 'Localidades encontradas', data: localidad })
    } else {
      res.status(200).json({ message: 'No hay localidades aun', data: [] })
    }

  } catch (error: any) {
    next(error)
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const nombre = req.params.nombre
    const localidad = await em.findOne(
      Localidad,
      { nombre },
      { populate: ['provincia'] }
    )
    if (!localidad) {
      throw new HttpError(404, 'LOCALIDAD_NOT_FOUND', 'Localidad no encontrada');
    }
    res.status(200).json({ message: 'Localidad encontrada', data: localidad })
  } catch (error: any) {
    next(error)
  }
}

async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const { nombre, id, provincia } = req.body.sanitizedInput

    if (!nombre || !id || !provincia) {
      throw new HttpError(400, 'INVALID_INPUT', 'La localidad debe tener nombre, id y una provincia asociada')
    };
    if (typeof nombre !== 'string' || nombre === "") {
      throw new HttpError(400, 'INVALID_INPUT', 'La localidad debe tener un nombre y debe ser un string')
    };
    /*if (typeof codPostal !== 'string' || codPostal === "") {
      return res.status(400).json({ message: 'El codigo postal debe ser un string' })
    };*/
    const provinciaRef = em.getReference(Provincia, provincia)

    const localidad = em.create(Localidad, {
      nombre,
      provincia: provinciaRef,
    })

    await em.flush()
    res.status(201).json({ message: 'Localidad creada', data: localidad })
    /*const localidad = em.create(Localidad, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'localidad created', data: localidad })*/
  } catch (error: any) {
    next(error)
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const nombre = req.params.nombre;
    const { nombreNuevo, id, provincia } = req.body.sanitizedInput;
    if (typeof nombreNuevo !== 'string' || nombreNuevo === "") {
      throw new HttpError(400, 'INVALID_INPUT', 'El nombre nuevo es obligatorio y debe ser un string')
    };
    /*if (typeof codPostal !== 'string' || codPostal === "") {
      return res.status(400).json({ message: 'El codigo postal debe ser un string' })
    };*/
    const provinciaRef = em.getReference(Provincia, provincia)
    const localidadToUpdate = await em.findOne(Localidad, { nombre })
    if (!localidadToUpdate) {
      throw new HttpError(404, 'NOT_FOUND', 'Localidad a actualizar no encontrada')
    }

    if (nombre) localidadToUpdate.nombre = nombre;
    if (provincia) localidadToUpdate.provincia = provinciaRef;

    await em.flush()
    res
      .status(200)
      .json({ message: 'Localidad updated', data: localidadToUpdate })
  } catch (error: any) {
    next(error)
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const nombre = req.params.nombre
    const localidad = await em.findOne(Localidad, { nombre });
    if (!localidad) {
      throw new HttpError(404, 'NOT_FOUND', 'Localidad a eliminar no encontrada')
    }
    await em.removeAndFlush(localidad)
    res
      .status(200)
      .json({ message: 'Localidad deleted', data: localidad })
  } catch (error: any) {
    next(error)
  }
}


export {
  findAll,
  findOne,
  add,
  update,
  remove,
  sanitizeLocalidadInput
};