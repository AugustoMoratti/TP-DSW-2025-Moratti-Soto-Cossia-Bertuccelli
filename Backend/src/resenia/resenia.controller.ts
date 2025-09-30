import { Request, Response, NextFunction } from 'express';
import { orm } from "../../DB/orm.js";
import { Resenia } from "./resenia.entity.js";
const em = orm.em

function sanitizeReseniaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    valor: req.body.valor,
    descripcion: req.body.descripcion,
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
    const resenia = await em.find(Resenia, {})
    res
      .status(200)
      .json({ message: 'found all Resenia', data: resenia })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const resenia = await em.findOneOrFail(Resenia, { id })
    res
      .status(200)
      .json({ message: 'found Resenia', data: resenia })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const resenia = em.create(Resenia, req.body)
    await em.flush()
    res
      .status(201)
      .json({ message: 'Resenia class created', data: resenia })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)

    const resenia = em.getReference(Resenia, id);
    const { valor, descripcion } = req.body.sanitizedInput || {};

    // Validaciones de tipo para campos opcionales
    if (valor !== undefined && typeof valor !== 'number') {
      return res.status(400).json({ message: 'valor debe ser un número' });
    }

    if (descripcion !== undefined && typeof descripcion !== 'string') {
      return res.status(400).json({ message: 'descripcion debe ser un string' });
    }

    // Asignación solo si viene definido
    if (valor !== undefined) resenia.valor = valor; // tu propiedad en la entidad es "number"
    if (descripcion !== undefined) resenia.descripcion = descripcion;

    // Guardar cambios
    await em.flush();

    res.status(200).json({ message: 'Resenia actualizada', data: resenia });
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const resenia = em.getReference(Resenia, id)
    em.removeAndFlush(resenia)
    res.status(200).send({ message: 'Resenia deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, remove, update, sanitizeReseniaInput }
