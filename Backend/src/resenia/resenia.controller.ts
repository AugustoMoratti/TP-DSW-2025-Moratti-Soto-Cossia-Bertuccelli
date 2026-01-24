import { Request, Response, NextFunction } from 'express';
import { orm } from "../../DB/orm.js";
import { Resenia } from "./resenia.entity.js";
import { Trabajo } from '../trabajos/trabajos.entity.js';
import { HttpError } from '../types/HttpError.js'
const em = orm.em.fork();

function sanitizeReseniaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    valor: req.body.valor,
    descripcion: req.body.descripcion,
    trabajo: req.body.trabajo
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
    const resenia = await em.find(Resenia, {})
    if (resenia.length > 0) {
      res
        .status(200)
        .json({ message: 'Todas las resenias encontradas', data: resenia })
    } else {
      res
        .status(200)
        .json({ message: 'No hay resenias aun', data: resenia })
    }
  } catch (error: any) {
    next(error)
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id)
    const resenia = await em.findOne(Resenia, { id })
    if (!resenia) {
      throw new HttpError(404, 'NOT_FOUND', 'Resenia no encontrada')
    }
    res
      .status(200)
      .json({ message: 'Resenia encontrada', data: resenia })
  } catch (error: any) {
    next(error)
  }
}

async function add(req: Request, res: Response, next: NextFunction) {
  try {
    const { valor, descripcion, trabajo } = req.body.sanitizedInput

    const resenia = new Resenia();

    if (valor === undefined || valor === null || isNaN(valor)) {
      throw new HttpError(400, 'INVALID_INPUT', 'Valor es un campo obligatorio y debe ser un number')
    }

    if (descripcion === undefined || descripcion === null || typeof descripcion !== 'string') {
      throw new HttpError(400, 'INVALID_INPUT', 'Descripcion es un campo obligatorio y debe ser un string')
    };

    if (valor > 5 || valor < 0) {
      throw new HttpError(400, 'INVALID_INPUT', 'El valor debe ser mayo que cero y menor que cinco')
    }
    const trabajoEntero = em.getReference(Trabajo, trabajo)
    if (!trabajo) {
      throw new HttpError(400, 'INVALID_INPUT', 'La resenia debe estar vinculada a un trabajo')
    }
    resenia.valor = Number(valor);
    resenia.descripcion = descripcion;
    resenia.trabajo = trabajoEntero
    em.persist(resenia)
    await em.flush()
    res
      .status(201)
      .json({ message: 'Resenia creada', data: resenia })
  } catch (error: any) {
    next(error)
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id)

    const resenia = em.getReference(Resenia, id);
    const { valor, descripcion } = req.body.sanitizedInput || {};

    // Validaciones de tipo para campos opcionales
    if (valor && typeof valor !== 'number') {
      throw new HttpError(400, 'INVALID_INPUT', 'valor debe ser un número')
    }

    if (descripcion && typeof descripcion !== 'string') {
      throw new HttpError(400, 'INVALID_INPUT', 'descripcion debe ser un string')
    }

    // Asignación solo si viene definido
    if (valor) resenia.valor = valor; // tu propiedad en la entidad es "number"
    if (descripcion) resenia.descripcion = descripcion;

    // Guardar cambios
    await em.flush();

    res.status(200).json({ message: 'Resenia actualizada', data: resenia });
  } catch (error: any) {
    next(error)
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id)
    const resenia = em.getReference(Resenia, id)
    em.removeAndFlush(resenia)
    res.status(200).send({ message: 'Resenia eliminada' })
  } catch (error: any) {
    next(error)
  }
}

export { findAll, findOne, add, /*remove,*/ update, sanitizeReseniaInput }
