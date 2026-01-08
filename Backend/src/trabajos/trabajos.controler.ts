import { Request, Response, NextFunction } from 'express'
import { Trabajo } from './trabajos.entity.js'
import { Resenia } from '../resenia/resenia.entity.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { orm } from '../../DB/orm.js';
import { HttpError } from '../types/HttpError.js'


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

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const trabajos = await em.find(Trabajo, {}, { populate: ['cliente', 'profesional', 'resenia'] })
    if (trabajos.length > 0) {
      res
        .status(200)
        .json({ message: 'Todos los trabajos encontrados', data: trabajos })
    } else {
      res
        .status(200)
        .json({ message: 'No hay trabajos', data: trabajos })
    }
  } catch (error: any) {
    next(error)
  }
}

async function trabajosFinalizados(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const profRef = em.getReference(Usuario, id);
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const trabajos = await em.find(Trabajo, {
      profesional: profRef,
      $and: [{ fechaFinalizado: { $ne: null } }, { fechaFinalizado: { $ne: '' } }],
    },
      {
        populate: ['cliente', 'profesional', 'resenia'],
        limit,
        offset,
        orderBy: { fechaFinalizado: 'DESC' }
      });
    if (!trabajos) {
      res
        .status(200)
        .json({ message: 'No hay trabajos finalizados', data: trabajos })
    }
    res
      .status(200)
      .json({ message: 'Trabajos finalizados encontrados', data: trabajos })
  } catch (error: any) {
    next(error)
  }
}

async function trabajosFinalizadosContratados(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const cliRef = em.getReference(Usuario, id);
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const trabajos = await em.find(Trabajo, {
      cliente: cliRef,
      $and: [{ fechaFinalizado: { $ne: null } }, { fechaFinalizado: { $ne: '' } }],
    },
      {
        populate: ['cliente', 'profesional', 'resenia'],
        limit,
        offset,
        orderBy: { fechaFinalizado: 'DESC' }
      });
    if (!trabajos) {
      res
        .status(200)
        .json({ message: 'No hay trabajos contratados finalizados', data: trabajos })
    }
    res
      .status(200)
      .json({ message: 'Trabajos contratados finalizados encontrados', data: trabajos })
  } catch (error: any) {
    next(error)
  }
}

async function trabajosPendientes(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const trabajos = await em.find(Trabajo, {
      profesional: id,
      $or: [
        { fechaFinalizado: null },
        { fechaFinalizado: '' }
      ]
    },
      {
        populate: ['cliente', 'profesional', 'resenia'],
        limit,
        offset
      });
    if (!trabajos) {
      res
        .status(200)
        .json({ message: 'No hay trabajos pendientes', data: trabajos })
    }
    res
      .status(200)
      .json({ message: 'Trabajos pendientes encontrados', data: trabajos })
  } catch (error: any) {
    next(error)
  }
}

async function trabajosPendientesContratados(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;
    const trabajos = await em.find(Trabajo, {
      cliente: id,
      $or: [
        { fechaFinalizado: null },
        { fechaFinalizado: '' }
      ]
    },
      {
        populate: ['cliente', 'profesional', 'resenia'],
        limit,
        offset
      });
    if (!trabajos) {
      res
        .status(200)
        .json({ message: 'No hay trabajos contratados pendientes', data: trabajos })
    }
    res
      .status(200)
      .json({ message: 'Trabajos contratados pendientes encontrados', data: trabajos })
  } catch (error: any) {
    next(error)
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id)
    const trabajo = await em.findOne(Trabajo, { id }, { populate: ['cliente', 'profesional', 'resenia'] })
    if (!trabajo) {
      throw new HttpError(404, 'NOT_FOUND', 'No se encontró el trabajo')
    }
    res
      .status(200)
      .json({ message: 'Trabajo Encontrado', data: trabajo })
  } catch (error: any) {
    next(error)
  }
}

async function add(req: Request, res: Response, next: NextFunction) {
  try {
    /*
    Reglas de negocio = a tener en cuenta en la creacion de trabajos
     1) No debe haber fechaPago sin haber fechaFinalizado
     2) No debe haber fechaFinalizado sin haber resenia
     3) montoTotal, cliente, profesional, fechaSolicitud son campos obligatorios.
    */
    const { montoTotal, cliente, profesional, fechaPago, fechaSolicitud, fechaFinalizado, resenia } = req.body;
    console.log("Req body = ", req.body)

    if (!cliente || !profesional || !fechaSolicitud) {
      throw new HttpError(400, 'INVALID_INPUT', 'Faltan campos obligatorios')
    };

    if (fechaFinalizado && !resenia) {
      throw new HttpError(400, 'INVALID_INPUT', 'Se debe realizar la reseña antes de finalizar el trabajo')
    };

    if (fechaPago && !fechaFinalizado) {
      throw new HttpError(400, 'INVALID_INPUT', 'Se debe finalizar un trabajo antes de ser pagado')
    };

    const trabajo = new Trabajo();

    trabajo.montoTotal = Number(montoTotal);
    trabajo.cliente = em.getReference(Usuario, cliente);
    trabajo.profesional = em.getReference(Usuario, profesional);
    trabajo.fechaSolicitud = fechaSolicitud;

    if (fechaFinalizado) {
      trabajo.fechaFinalizado = fechaFinalizado
    };

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
      .json({ message: 'Trabajo creado correctamente', data: trabajo })
  } catch (error: any) {
    next(error)
  }
}

async function update(req: Request, res: Response, next: NextFunction) { //NO UTILIZAR PUT , SIEMPRE PATCH PARA UPDATE DE TRABAJOS
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
      throw new HttpError(400, 'INVALID_INPUT', 'La reseña es obligatoria cuando se finaliza el trabajo')
    }

    if (fechaPago && !fechaFinalizado) {
      throw new HttpError(400, 'INVALID_INPUT', 'No puede haber fecha de pago sin fecha de finalización')
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
    res.status(200).json({ message: 'Trabajo class updated', data: trabajo })
  } catch (error: any) {
    next(error)
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number.parseInt(req.params.id)
    const trabajo = em.getReference(Trabajo, id)
    await em.removeAndFlush(trabajo)
    res.status(200).send({ message: 'Trabajo deleted' })
  } catch (error: any) {
    next(error)
  }
}

export { sanitizeTrabajoInput, findAll, findOne, add, update, remove, trabajosPendientes, trabajosFinalizados, trabajosPendientesContratados, trabajosFinalizadosContratados }
