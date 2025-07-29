import { Request, Response, NextFunction } from 'express';
import { ProfesionRepository } from './profesion.repository.js';
import { Profesion } from './profesion.entity.js';

const repository = new ProfesionRepository();

function sanitizeProfesionesInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombreProf: req.body.nombreProf,
    descProf: req.body.descProf,
    estado: req.body.estado,
    codProf: req.body.codProf,
}
Object.keys(req.body.sanitizedInput).forEach((key) => {
  if (req.body.sanitizedInput[key] === undefined) {
    delete req.body.sanitizedInput[key]
  }
})
  next()
}

function findAll(req:Request, res: Response) {
  res.json({ data: repository.findAll() });
}

function findOne(req:Request, res: Response) {
  const id = req.params.id;
  const profesion = repository.findOne({ id });
  if (!profesion) {
    res.status(404).send({ message: 'No se encontro la profesion' });
    return;
  }
  res.json({ data: profesion });
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput;
  const profesionInput = new Profesion(
    input.nombreProf,
    input.descProf,
    input.estado,
  );
  const profesion = repository.add(profesionInput)
  if (profesion) {
    res.status(201).send({ message: 'Profesion creada con exito', data: profesion });
    return;
  } else {
    res.status(404).send({ message: 'La profesion ya existe' });
    return;
  }
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const profesion = repository.update(req.body.sanitizedInput);
  if (!Profesion){
    return res.status(404).send({ message: 'No se encontro la profesion' });
  } else {
    return res.status(200).send({ message: 'Profesion actualizada con exito', });
  }
}

function remove(req: Request, res: Response) {
  const id = req.params.id;
  const profesion = repository.delete({ id });
  if (!profesion) {
    res.status(404).send({ message: 'No se encontro la profesion' });
    return;
  }
  res.status(200).send({ message: 'Profesion eliminada con exito', data: profesion }); //Se pone return?
}

export {
  sanitizeProfesionesInput,
  findAll,
  findOne,
  add,
  update,
  remove
};