import { Request, Response, NextFunction } from 'express';
import { LocalicadRepository } from './localidades.repository.js';
import { Localidad } from './localidades.entity.js';

const repository = new LocalicadRepository();

function sanitizeProfesionesInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    codPostal: req.body.codPostal,
    nombre: req.body.nombre,
}
Object.keys(req.body.sanitizedInput).forEach((key) => {
  if (req.body.sanitizedInput[key] === undefined) {
    delete req.body.sanitizedInput[key]
  }
})
  next()
}

function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() });
}

function findOne(req:Request, res:Response) {
  const id = req.params.id;
  const localidad = repository.findOne({ id });
  if (!localidad){
    return res.status(404).send({ message: 'No se encontro la localidad' });
  }
  res.json({ data: localidad });
}

function add(req:Request, res:Response) {
  const input = req.body.sanitizedInput;
  const localidadInput = new Localidad(
    input.codPostal,
    input.nombre,
  );
  const localidad = repository.add (localidadInput)
  if (localidad){
    return res.status(201).send ({ message: 'La localidad fue creada con exito' });
  } else {
    return res.status(404).send ({ message: 'La localidad ya existe' });
  }
}

function update(req:Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id;
  const localidad = repository.update(req.body.sanitizedInput);
  if(!localidad){
    return res.status(200).send ({ message:'La localidad se actualizo con exito' });
  } else{
    return res.status(404).send ({ message:'No se encontro la localidad' });
  }
}

function remove(req:Request, res:Response) {
  const id = req.params.id;
  const localidad = repository.delete ({ id });
  if(!localidad){
    return res.status(200).send({ message:'La localidad se elimino con exito:', data: localidad });
  } else {
    return res.status(404).send({ message:'No se encontro la localidad' });
  }
}

export {
  sanitizeProfesionesInput,
  findAll,
  findOne,
  add,
  update,
  remove
};