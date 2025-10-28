import { Request, Response, NextFunction } from 'express';
import { orm } from "../../DB/orm.js";
import { Resenia } from "./resenia.entity.js";
import { Trabajo } from '../trabajos/trabajos.entity.js';
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
    const { valor, descripcion, trabajo } = req.body.sanitizedInput

    const resenia = new Resenia();

    if (valor === undefined || valor === null || isNaN(valor)) {
      return res.status(400).json({ message: 'Valor es un campo obligatorio y debe ser un number' });
    }

    if (descripcion === undefined || descripcion === null || typeof descripcion !== 'string') {
      return res.status(400).json({ message: 'Descripcion es un campo obligatorio y debe ser un string' });
    };

    if (valor > 5 || valor < 0) {
      return res.status(400).json({ message: 'El valor debe ser mayo que cero y menor que cinco' });
    }
    const trabajoEntero = em.getReference(Trabajo, trabajo)
    if (!trabajo) {
      return res.status(400).json({ message: 'La resenia debe estar vinculada a un trabajo' });
    }
    resenia.valor = Number(valor);
    resenia.descripcion = descripcion;
    resenia.trabajo = trabajoEntero
    em.persist(resenia)
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
    if (valor && typeof valor !== 'number') {
      return res.status(400).json({ message: 'valor debe ser un número' });
    }

    if (descripcion && typeof descripcion !== 'string') {
      return res.status(400).json({ message: 'descripcion debe ser un string' });
    }

    // Asignación solo si viene definido
    if (valor) resenia.valor = valor; // tu propiedad en la entidad es "number"
    if (descripcion) resenia.descripcion = descripcion;

    // Guardar cambios
    await em.flush();

    res.status(200).json({ message: 'Resenia actualizada', data: resenia });
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

/*async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const resenia = em.getReference(Resenia, id)
    em.removeAndFlush(resenia)
    res.status(200).send({ message: 'Resenia deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}*/

export { findAll, findOne, add, /*remove,*/ update, sanitizeReseniaInput }
