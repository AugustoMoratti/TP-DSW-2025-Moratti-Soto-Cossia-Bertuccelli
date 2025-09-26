import { Request, Response, NextFunction } from 'express';
import { Usuario } from './usuario.entity.js';
import { Provincia } from '../provincia/provincia.entity.js';
import { Localidad } from '../localidad/localidades.entity.js';
import { Profesiones } from '../profesion/profesion.entity.js';
import { orm } from '../../DB/orm.js';

const em = orm.em

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    clave: req.body.clave,
    email: req.body.email,
    descripcion: req.body.descripcion,
    contacto: req.body.contacto,
    horarios: req.body.horarios,
    provincia: req.body.provincia,
    localidad: req.body.localidad,
    profesiones: req.body.profesiones
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
    const usuarios = await em.find(Usuario, {}, { populate: ['profesiones'] })
    res
      .status(200)
      .json({ message: 'found all Usuarios', data: usuarios })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const usuario = await em.findOneOrFail(Usuario, { id }, { populate: ['profesiones'] })
    res
      .status(200)
      .json({ message: 'found Usuario', data: usuario })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    //const usuario = em.create(Usuario, req.body)
    const { nombre, apellido, clave, email, descripcion, contacto, horarios, provincia, localidad, profesiones } = req.body.sanitizedInput
    /*if (!nombre || !apellido || !clave || !email || !provincia || !localidad) {
      return res.status(400).json({ message: 'Faltan campos requeridos: nombre, apellido, clave, email, provincia o localidad' })
    }*/
    const provinciaRef = em.getReference(Provincia, Number(provincia))
    const localidadRef = em.getReference(Localidad, Number(localidad))

    const profesionesIds: number[] = Array.isArray(req.body.sanitizedInput.profesiones)
      ? req.body.sanitizedInput.profesiones.map((x: any) => Number(x)).filter((n: number) => Number.isFinite(n))
      : []

    let profesionesRef: Profesiones[] = []

    if (Array.isArray(profesionesIds) && profesionesIds.length > 0) {
      profesionesRef = await em.find(Profesiones, {
        id: { $in: profesionesIds },
        estado: true
      })
    }
    const usuario = em.create(Usuario, {
      nombre,
      apellido,
      provincia: provinciaRef,
      localidad: localidadRef,
      clave,
      email,
      descripcion,
      contacto,
      horarios,
      profesiones: profesionesRef
    })
    await em.flush()
    res
      .status(201)
      .json({ message: 'Usuario class created', data: usuario })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    /*const id = Number.parseInt(req.params.id)
    const usuario = em.getReference(Usuario, id)*/

    const id = Number.parseInt(req.params.id)
    const usuario = await em.findOneOrFail(Usuario, { id }, { populate: ['profesiones'] })

    const { nombre, apellido, provincia, localidad, clave, email, descripcion, contacto, horarios, profesiones } = req.body

    if (provincia) usuario.provincia = em.getReference(Provincia, Number(provincia))
    if (localidad) usuario.localidad = em.getReference(Localidad, Number(localidad))

    if (nombre) usuario.nombre = nombre
    if (apellido) usuario.apellido = apellido
    if (clave) usuario.clave = clave
    if (email) usuario.email = email
    if (descripcion) usuario.descripcion = descripcion
    if (contacto) usuario.contacto = contacto.toString()
    if (horarios) usuario.horarios = horarios

    if (Array.isArray(profesiones)) {
      if (profesiones.length > 0) {
        // Asignar solo profesiones activas enviadas
        const profesionesIds = profesiones.map((x: any) => Number(x)).filter((n: number) => Number.isFinite(n))
        const profesionesRef = await em.find(Profesiones, { id: { $in: profesionesIds }, estado: true })
        usuario.profesiones.set(profesionesRef)
      } else {
        // Si se envía array vacío, eliminar todas las profesiones
        usuario.profesiones.removeAll()
      }
    }

    em.assign(usuario, req.body)
    await em.flush()
    res.status(200).json({ message: 'Usuario class updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const usuario = em.getReference(Usuario, id)
    await em.removeAndFlush(usuario)
    res.status(200).send({ message: 'Usuario deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove, sanitizeUsuarioInput }
