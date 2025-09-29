import { Request, Response, NextFunction } from 'express'
import { Trabajo } from './trabajos.entity.js'
import { Resenia } from '../resenia/resenia.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { orm } from '../../DB/orm.js';


const em = orm.em


function sanitizeTrabajoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    fecha_solicitud: req.body.fecha_solicitud,
    fecha_realizado: req.body.fecha_realizado,
    montoTotal: req.body.montoTotal,
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
    const trabajos = await em.find(Trabajo, {}, { populate: ['cliente', 'profesional'] })
    res
      .status(200)
      .json({ message: 'found all Trabajos', data: trabajos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const trabajo = await em.findOneOrFail(Trabajo, { id }, { populate: ['cliente', 'profesional', 'resenia'] })
    res
      .status(200)
      .json({ message: 'found Trabajo', data: trabajo })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const { montoTotal, cliente, profesional, pagado, fechaPago, fechaSolicitud, fechaFinalizado, resenia } = req.body;

    if (!montoTotal || !cliente || !profesional || !fechaSolicitud) {
      res.status(400).json({ message: 'Faltan campos oblgiatorios' })
    };

    if (fechaFinalizado && !resenia) {
      res.status(400).json({ message: 'Se debe realizar la reseña antes de finalizar el trabajo' })
    };

    const trabajo = new Trabajo();

    trabajo.montoTotal = Number(montoTotal);
    trabajo.cliente = em.getReference(Usuario, Number(cliente));
    trabajo.profesional = em.getReference(Usuario, Number(profesional));
    trabajo.fechaSolicitud = new Date(fechaSolicitud);

    if (pagado !== undefined) {
      trabajo.pagado = true
    };

    if (fechaPago) {
      trabajo.fechaPago = new Date(fechaPago)
    };

    if (resenia) {
      trabajo.resenia = em.getReference(Resenia, Number(resenia))
    };

    em.persist(trabajo);
    await em.flush()
    res
      .status(201)
      .json({ message: 'Trabajo class created', data: trabajo })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const trabajo = em.getReference(Trabajo, id)

    const { montoTotal, cliente, profesional, pagado, fechaPago, fechaSolicitud, fechaFinalizado, resenia } = req.body

    // Validación: si hay fechaFinalizado debe venir reseña (id o objeto)
    if (fechaFinalizado !== undefined && (resenia === undefined || resenia === null || resenia === '')) {
      return res.status(400).json({ message: 'La reseña es obligatoria cuando se finaliza el trabajo' });
    }

    if (resenia) trabajo.resenia = em.getReference(Resenia, Number(resenia));
    if (cliente) trabajo.cliente = em.getReference(Usuario, Number(cliente));
    if (profesional) trabajo.profesional = em.getReference(Usuario, Number(profesional));
    if (fechaFinalizado) trabajo.fechaFinalizado = new Date(fechaFinalizado);
    if (montoTotal !== undefined) trabajo.montoTotal = Number(montoTotal);
    if (pagado !== undefined) trabajo.pagado = pagado;
    if (fechaPago) trabajo.fechaPago = new Date(fechaPago);
    if (fechaSolicitud) trabajo.fechaSolicitud = new Date(fechaSolicitud);


    em.assign(trabajo, req.body)
    await em.flush()
    res.status(200).json({ message: 'Trabajo class updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const trabajo = em.getReference(Trabajo, id)
    await em.removeAndFlush(trabajo)
    res.status(200).send({ message: 'Trabajo deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeTrabajoInput, findAll, findOne, add, update, remove }
