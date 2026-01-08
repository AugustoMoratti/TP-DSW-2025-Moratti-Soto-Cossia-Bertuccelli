import { Request, Response, NextFunction } from 'express';
import { Profesiones } from './profesion.entity.js';
import { orm } from '../../DB/orm.js';
import { HttpError } from '../types/HttpError.js';



function sanitizeProfesionInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombreProfesion: req.body.nombreProfesion,
    descripcionProfesion: req.body.descripcionProfesion,
    fechaSolicitud: req.body.fechaSolicitud,
    estado: req.body.estado,
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined || req.body.sanitizedInput[key] === null) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}


async function findAllActive(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork();

  try {
    const profesiones = await em.find(Profesiones, { estado: true })//Agregue filtro para que solo muestre si esta activo
    if (profesiones.length === 0) {
      return res.status(200).json({ message: 'No se han encontrado profesiones activas', data: profesiones })
    }
    res
      .status(200)
      .json({ message: 'Profeciones activas encontradas', data: profesiones })
  } catch (error: any) {
    next(error)
  }
}

async function findAllInactive(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork();

  try {
    const profesiones = await em.find(Profesiones, { estado: false })//Agregue filtro para que solo muestre si esta activo
    if (profesiones.length === 0) { //find devuelve si o si un arreglo que puede estar vacio
      return res.status(200).json({ message: 'No se han encontrado profesiones inactivas', data: profesiones })
    }
    res
      .status(200)
      .json({ message: 'Profeciones inactivas encontradas', data: profesiones })
  } catch (error: any) {
    next(error)
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork();

  try {
    const nombreProfesion = (req.params.nombreProfesion).toLowerCase()
    const profesion = await em.findOne(Profesiones, { nombreProfesion })

    if (!profesion) { //findOrFail devuelve la profesion o false basicamente un error
      throw new HttpError(404, 'NOT_FOUND', 'No se ha encontrado la profesion')
    }

    if (!profesion.estado) {
      throw new HttpError(403, 'ACCESS_DENIED', 'La profesion existe pero aun no ha sido aceptada por el administrador')
    }

    res
      .status(200)
      .json({ message: 'Profesion encontrada', data: profesion })
  } catch (error: any) {
    next(error)
  }
}

async function busquedaProf(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork();

  try {
    const qRaw = String(req.params.query).trim().toLowerCase();

    if (!qRaw) {
      throw new HttpError(400, 'INVALID_INPUT', 'Debe ingresar un término de búsqueda.')
    }

    const qParam = `%${qRaw}%`;
    const profesiones = await em.find(Profesiones, {
      $or: [
        { nombreProfesion: { $like: `%${qParam}%` } },
        { descripcionProfesion: { $like: `%${qParam}%` } },
      ],
    }, {
      limit: 10,
    });

    return res.status(200).json({ data: profesiones });
  } catch (error: any) {
    next(error)
  }
}


async function add(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork();

  try {
    const { nombreProfesion, descripcionProfesion, estado } = req.body.sanitizedInput

    const profesion = new Profesiones()
    if (typeof nombreProfesion !== 'string' || nombreProfesion === "") {
      throw new HttpError(400, 'INVALID_INPUT', 'El nombre debe ser un string y no debe estar vacio')
    };
    if (typeof descripcionProfesion !== 'string' || descripcionProfesion === "") {
      throw new HttpError(400, 'INVALID_INPUT', 'La descripcion debe ser un string')
    };
    if (typeof estado !== 'boolean') {
      throw new HttpError(400, 'INVALID_INPUT', 'El estado debe ser un booleano')
    };

    const hoy = new Date();
    const fechaSolo = hoy.toISOString().split('T')[0];
    profesion.fechaSolicitud = fechaSolo
    profesion.nombreProfesion = nombreProfesion.toLowerCase()
    profesion.descripcionProfesion = descripcionProfesion
    profesion.estado = estado
    em.persist(profesion);
    await em.flush()
    res
      .status(201)
      .json({ message: 'Profesion creada', data: profesion })
  } catch (error: any) {
    next(error)
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork();

  try {
    const nombreProfesion = (req.params.nombreProfesion).trim().toLowerCase();
    const profesionToUpdate = await em.findOne(Profesiones, { nombreProfesion })
    if (!profesionToUpdate) {
      throw new HttpError(404, 'NOT_FOUND', 'No se encontro la profesion a actualizar')
    }
    if (req.body.descripcionProfesion !== undefined) {
      profesionToUpdate.descripcionProfesion = req.body.descripcionProfesion;
    }
    if (req.body.estado !== undefined) {
      profesionToUpdate.estado = req.body.estado;
    }
    if (req.body.fechaSolicitud !== undefined) {
      profesionToUpdate.fechaSolicitud = req.body.fechaSolicitud;
    }
    await em.persistAndFlush(profesionToUpdate);
    res.status(200).json({ message: 'Profesion class updated' })
  } catch (error: any) {
    next(error)
  }
}

async function remove(req: Request, res: Response, next: NextFunction) {
  const em = orm.em.fork();

  try {
    const nombreProfesion = (req.params.nombreProfesion).toLowerCase()
    const profesion = await em.findOne(Profesiones, { nombreProfesion });
    if (!profesion) {
      throw new HttpError(404, 'NOT_FOUND', 'No se encontro la profesion a eliminar')
    }
    await em.removeAndFlush(profesion)
    res.status(200).send({ message: 'Profesion deleted' })
  } catch (error: any) {
    next(error)
  }
}

export {
  sanitizeProfesionInput,
  findAllActive,
  findAllInactive,
  findOne,
  add,
  update,
  remove,
  busquedaProf,
};
