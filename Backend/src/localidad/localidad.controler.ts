import { Request, Response, NextFunction } from 'express';
import { Localidad } from './localidades.entity.js';
import { Provincia } from '../provincia/provincia.entity.js';
import { orm } from '../../DB/orm.js';

const em = orm.em.fork();

function sanitizeLocalidadInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    codPostal: req.body.codPostal,
    provincia: req.body.provincia
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
      { populate: ['provincia'] }
    )
    res.status(200).json({ message: 'found all localidades', data: localidad })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const nombre = req.params.nombre
    const localidad = await em.findOneOrFail(
      Localidad,
      { nombre },
      { populate: ['provincia'] }
    )
    res.status(200).json({ message: 'found localidad', data: localidad })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const { nombre, codPostal, provincia } = req.body.sanitizedInput

    if (!nombre || !codPostal || !provincia) {
      return res.status(400).json({ message: 'Faltan campos requeridos' })
    };
    if (typeof nombre !== 'string' || nombre === "") {
      return res.status(400).json({ message: 'El nombre debe ser un string' })
    };
    if (typeof codPostal !== 'string' || codPostal === "") {
      return res.status(400).json({ message: 'El codigo postal debe ser un string' })
    };
    const provinciaRef = em.getReference(Provincia, provincia)

    const localidad = em.create(Localidad, {
      nombre,
      codPostal,
      provincia: provinciaRef,
    })

    await em.flush()
    res.status(201).json({ message: 'Localidad creada', data: localidad })
    /*const localidad = em.create(Localidad, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'localidad created', data: localidad })*/
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const nombre = req.params.nombre;
    const { nombreNuevo, codPostal, provincia } = req.body.sanitizedInput;
    if (typeof nombreNuevo !== 'string' || nombreNuevo === "") {
      return res.status(400).json({ message: 'El nombre debe ser un string' })
    };
    if (typeof codPostal !== 'string' || codPostal === "") {
      return res.status(400).json({ message: 'El codigo postal debe ser un string' })
    };
    const provinciaRef = em.getReference(Provincia, provincia)
    const localidadToUpdate = await em.findOneOrFail(Localidad, { nombre })

    if (nombre) localidadToUpdate.nombre = nombre;
    if (codPostal) localidadToUpdate.codPostal = codPostal;
    if (provincia) localidadToUpdate.provincia = provinciaRef;

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
    const nombre = req.params.nombre
    const localidad = await em.findOne(Localidad, { nombre });
    if (!localidad) {
      return res.status(404).json({ message: "Provincia no encontrada" });
    }

    await em.removeAndFlush(localidad)
    res
      .status(200)
      .json({ message: 'Localidad deleted', data: localidad })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
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
