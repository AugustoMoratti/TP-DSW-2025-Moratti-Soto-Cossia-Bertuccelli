import { Request, Response, NextFunction } from 'express'
import { administrador } from './admin.entity.js'
import { administradorRepository } from './admin.respository.js'

const repository = new administradorRepository()

function sanitizeAdministradorInput(req: Request, res: Response, next: NextFunction) {
    req.body.sanitizedInput = {
    user: req.body.user,
    clave: req.body.clave,
    estado: req.body.clave,
    idAdmin: req.body.idAdmin,
}
Object.keys(req.body.sanitizedInput).forEach((key) => {
  if (req.body.sanitizedInput[key] === undefined) {
    delete req.body.sanitizedInput[key]
  }
})
  next()
}

function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() })
}

function findOne(req: Request, res: Response) {
  const id = req.params.id
  const provincia = repository.findOne({ id })
  if (!provincia) {
    res.status(404).send({ message: 'Provincia not found' })
    return
  }
  res.json({ data: provincia })
}

function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const administradorInput = new administrador(
    input.user,
    input.clave,
    input.estado
  )

  const admin = repository.add(administradorInput)
  if (admin) {
    res.status(201).send({ message: 'Administrador creado', data: admin })
    return
  } else {
    res.status(404).send({ message: 'Administrador existente' })
    return
  }
}

function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const admin = repository.update(req.body.sanitizedInput)

  if (!admin) {
    res.status(404).send({ message: 'Provincia not found' })
    return
  }

  res.status(200).send({ message: 'Administrador actualizado correctamente', data: admin })
}

function remove(req: Request, res: Response) {
  const id = req.params.id
  const admin = repository.delete({ id })

  if (!admin) {
    res.status(404).send({ message: 'Administrador not found' })
  } else {
    res.status(200).send({ message: 'Administrador borrado correctamente' })
  }
}

export { sanitizeAdministradorInput, findAll, findOne, add, update, remove }
