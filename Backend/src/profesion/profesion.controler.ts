import { Request, Response, NextFunction } from 'express';
import { Profesiones } from './profesion.entity.js';
import { orm } from '../../DB/orm.js';


const em = orm.em

function sanitizeProfesionInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombreProfesion: req.body.nombreProfesion,
    descripcionProfesion: req.body.descripcionProfesion,
    estado: req.body.estado,
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined || req.body.sanitizedInput[key] === null) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAllActive(req: Request, res: Response) {
  try {
    const profesiones = await em.find(Profesiones, { estado: true })//Agregue filtro para que solo muestre si esta activo
    if (profesiones.length === 0) {
      return res.status(404).json({ message: 'No se han encontrado profesiones activas' })
    }
    res
      .status(200)
      .json({ message: 'found all Profeciones', data: profesiones })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findAllInactive(req: Request, res: Response) {
  try {
    const profesiones = await em.find(Profesiones, { estado: false })//Agregue filtro para que solo muestre si esta activo
    if (profesiones.length === 0) { //find devuelve si o si un arreglo que puede estar vacio
      return res.status(404).json({ message: 'No se han encontrado profesiones inactivas' })
    }
    res
      .status(200)
      .json({ message: 'found all Profeciones', data: profesiones })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const nombreProfesion = req.params.nombreProfesion
    const profesion = await em.findOneOrFail(Profesiones, { nombreProfesion })

    if (!profesion) { //findOrFail devuelve la profesion o false basicamente un error
      return res.status(404).json({ message: 'No se ha encontrado la profesion' })
    }

    if (!profesion.estado) {
      return res.status(403).json({ message: 'La profesion existe pero aun no ha sido aceptada por el administrador' })
    }

    res
      .status(200)
      .json({ message: 'found Profesion', data: profesion })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const { nombreProfesion, descripcionProfesion, estado } = req.body.sanitizedInput

    const profesion = new Profesiones()
    if (typeof nombreProfesion !== 'string' || nombreProfesion === "") {
      return res.status(400).json({ message: 'El nombre debe ser un string y no debe estar vacio' })
    };
    if (typeof descripcionProfesion !== 'string' || descripcionProfesion === "") {
      return res.status(400).json({ message: 'La descripcion debe ser un string' })
    };
    if (typeof estado !== 'boolean') {
      return res.status(400).json({ message: 'El estado debe ser un booleano' })
    };

    profesion.nombreProfesion = nombreProfesion
    profesion.descripcionProfesion = descripcionProfesion
    profesion.estado = estado
    em.persist(profesion);
    await em.flush()
    res
      .status(201)
      .json({ message: 'Profesion class created', data: profesion })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const nombreProfesion = (req.params.nombreProfesion).trim();
    const profesionToUpdate = await em.findOneOrFail(Profesiones, { nombreProfesion })
    profesionToUpdate.descripcionProfesion = req.body.descripcionProfesion;
    profesionToUpdate.estado = req.body.estado;

    await em.persistAndFlush(profesionToUpdate);
    res.status(200).json({ message: 'Profesion class updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const nombreProfesion = req.params.nombreProfesion
    const profesion = await em.findOne(Profesiones, { nombreProfesion });
    if (!profesion) {
      return res.status(404).json({ message: "Profesion no encontrada" });
    }
    await em.removeAndFlush(profesion)
    res.status(200).send({ message: 'Profesion deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export {
  sanitizeProfesionInput,
  findAllActive,
  findAllInactive,
  findOne,
  add,
  update,
  remove
};
