import { Request, Response, NextFunction } from 'express'
import { Trabajo } from './trabajos.entity.js'
import { Resenia } from '../resenia/resenia.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { orm } from '../../DB/orm.js';


const em = orm.em.fork();


function sanitizeTrabajoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    montoTotal: req.body.montoTotal,
    cliente: req.body.cliente,
    profesional: req.body.profesional,
    fechaPago: req.body.fechaPago,
    fechaSolicitud: req.body.fechaSolicitud,
    fechaFinalizado: req.body.fechaFinalizado,
    resenia: req.body.resenia
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined || req.body.sanitizedInput[key] === null) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const trabajos = await em.find(Trabajo, {}, { populate: ['cliente', 'profesional', 'resenia'] })
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
    /*
    Reglas de negocio = a tener en cuenta en la creacion de trabajos
     1) No debe haber fechaPago sin haber fechaFinalizado
     2) No debe haber fechaFinalizado sin haber resenia
     3) montoTotal, cliente, profesional, fechaSolicitud son campos obligatorios.
    */
    const { montoTotal, cliente, profesional, fechaPago, fechaSolicitud, fechaFinalizado, resenia } = req.body;

    if (!montoTotal || !cliente || !profesional || !fechaSolicitud) {
      res.status(400).json({ message: 'Faltan campos oblgiatorios' })
    };

    if (fechaFinalizado && !resenia) {
      res.status(400).json({ message: 'Se debe realizar la reseña antes de finalizar el trabajo' })
    };

    if (fechaPago && !fechaFinalizado) {
      res.status(400).json({ message: 'Se debe finalizar un trabajo antes de ser pagado' })
    };

    const trabajo = new Trabajo();

    trabajo.montoTotal = Number(montoTotal);
    trabajo.cliente = em.getReference(Usuario, cliente);
    trabajo.profesional = em.getReference(Usuario, profesional);
    trabajo.fechaSolicitud = fechaSolicitud;


    if (fechaPago) {
      trabajo.fechaPago = fechaPago
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

async function update(req: Request, res: Response) { //NO UTILIZAR PUT , SIEMPRE PATCH PARA UPDATE DE TRABAJOS
  try {
    const id = Number.parseInt(req.params.id)
    const trabajo = em.getReference(Trabajo, id)
    /*
    Reglas de negocio = a tener en cuenta en la modificacion de trabajos
     1) No debe haber fechaPago sin haber fechaFinalizado
     2) No debe haber fechaFinalizado sin haber resenia
     3) montoTotal, cliente, profesional, fechaSolicitud son campos obligatorios.
    */

    // Solo usamos los campos que vienen del sanitized
    const {
      montoTotal,
      cliente,
      profesional,
      fechaPago,
      fechaSolicitud,
      fechaFinalizado,
      resenia
    } = req.body.sanitizedInput || {};

    // Reglas de negocio
    if (fechaFinalizado && !resenia) {
      return res.status(400).json({ message: 'La reseña es obligatoria cuando se finaliza el trabajo' });
    }

    if (fechaPago && !fechaFinalizado) {
      return res.status(400).json({ message: 'No puede haber fecha de pago sin fecha de finalización' });
    }

    // Asignación de valores con conversión de tipos
    if (montoTotal) trabajo.montoTotal = Number(montoTotal);
    if (cliente) trabajo.cliente = em.getReference(Usuario, cliente);
    if (profesional) trabajo.profesional = em.getReference(Usuario, profesional);
    if (fechaSolicitud) trabajo.fechaSolicitud = fechaSolicitud;
    if (fechaFinalizado) trabajo.fechaFinalizado = fechaFinalizado;
    if (fechaPago) trabajo.fechaPago = fechaPago;
    if (resenia) trabajo.resenia = em.getReference(Resenia, Number(resenia));

    await em.flush();

    await em.flush();
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
