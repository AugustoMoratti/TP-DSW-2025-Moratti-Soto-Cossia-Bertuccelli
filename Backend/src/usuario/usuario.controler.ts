import { Request, Response, NextFunction } from 'express';
import { Usuario } from './usuario.entity.js';
import { Provincia } from '../provincia/provincia.entity.js';
import { Localidad } from '../localidad/localidades.entity.js';
import { Profesiones } from '../profesion/profesion.entity.js';
import { orm } from '../../DB/orm.js';
import { upload, UPLOADS_DIR } from '../utils/upload.js';

const em = orm.em

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    clave: req.body.clave,
    email: req.body.email,
    descripcion: req.body.descripcion,
    direccion: req.body.direccion,
    contacto: req.body.contacto,
    horarios: req.body.horarios,
    provincia: req.body.provincia,
    localidad: req.body.localidad,
    profesiones: req.body.profesiones,
    fechaNac: req.body.fechaNac,
    trabajos: req.body.trabajos
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined || req.body.sanitizedInput[key] === null) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function buscarUsuarios(req: Request, res: Response) {
  const em = orm.em.fork();

  try {
    const qRaw = String(req.query.q ?? '').trim().toLowerCase();


    const qParam = `%${qRaw}%`;

    const usuarios = await em.find(Usuario, {
      $or: [
        { nombre: { $like: qParam } },
        { apellido: { $like: qParam } },
        { provincia: { nombre: { $like: qParam } } },
        { localidad: { nombre: { $like: qParam } } },
        { profesiones: { nombreProfesion: { $like: `%${qParam}%` } } } // ManyToMany
      ]
    }, {
      populate: ['provincia', 'localidad', 'profesiones'],
      limit: 10
    });

    return res.json({ data: usuarios });
  } catch (err) {
    console.error('Error en buscarUsuarios:', err);
    return res.status(500).json({ message: 'Error al buscar usuarios' });
  }
}

async function findAll(req: Request, res: Response) {
  try {
    const usuarios = await em.find(Usuario, {}, { populate: ['profesiones', 'localidad'] })
    res
      .status(200)
      .json({ message: 'found all Usuarios', data: usuarios })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id
    const usuario = await em.findOneOrFail(Usuario, { id }, { populate: ['profesiones', 'localidad', 'trabajos'] })
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
    const { nombre, apellido, clave, email, descripcion, contacto, horarios, provincia, localidad, profesiones, fechaNac, direccion } = req.body.sanitizedInput
    /*if (!nombre || !apellido || !clave || !email || !provincia || !localidad) {
      return res.status(400).json({ message: 'Faltan campos requeridos: nombre, apellido, clave, email, provincia o localidad' })
    }*/

    const provinciaRef = em.getReference(Provincia, provincia)
    const localidadRef = em.getReference(Localidad, localidad)

    const profesionesName: string[] = Array.isArray(req.body.sanitizedInput.profesiones)
      ? req.body.sanitizedInput.profesiones.map((p: string) => p.trim().toLowerCase())
      : []

    let profesionesRef: Profesiones[] = []

    if (Array.isArray(profesionesName) && profesionesName.length > 0) {
      profesionesRef = await em.find(Profesiones, {
        nombreProfesion: { $in: profesionesName },
        estado: true
      })
    };

    if (typeof nombre !== 'string' || nombre === "") {
      return res.status(400).json({ message: 'El nombre es obligatorio y debe ser un string' })
    };

    if (typeof apellido !== 'string' || apellido === "") {
      return res.status(400).json({ message: 'El apellido es obligatorio y debe ser un string' })
    };

    if (typeof clave !== 'string' || clave === "") {
      return res.status(400).json({ message: 'La clave es obligatoria y debe ser un string' })
    };

    if (typeof email !== 'string' || email === "") {
      return res.status(400).json({ message: 'El email es obligatorio y debe ser un string' })
    };

    if (typeof contacto !== 'string') {
      return res.status(400).json({ message: 'El numero de contacto es obligatorio y debe ser un string' })
    };

    if (typeof fechaNac !== 'string' || fechaNac === "") {
      return res.status(400).json({ message: 'El horario es obligatorio y debe ser un string' })
    };

    if (typeof horarios !== 'string' || horarios === "") {
      return res.status(400).json({ message: 'El horario es obligatorio y debe ser un string' })
    };

    if (descripcion && typeof descripcion !== 'string') {
      return res.status(400).json({ message: 'La descripcion debe ser un string' })
    };

    if (direccion && typeof direccion !== 'string') {
      return res.status(400).json({ message: 'La direccion debe ser un string' })
    };

    const usuario = new Usuario()

    usuario.nombre = nombre.trim();
    usuario.apellido = apellido.trim();
    usuario.clave = clave;
    usuario.email = email.trim().toLowerCase();
    usuario.contacto = contacto.trim();
    usuario.horarios = horarios.trim();
    usuario.direccion = direccion.trim();
    if (descripcion) usuario.descripcion = descripcion.trim();
    usuario.provincia = provinciaRef;
    usuario.localidad = localidadRef;
    usuario.fechaNac = fechaNac.trim();

    if (profesionesRef.length > 0) {
      for (const p of profesionesRef) {
        usuario.profesiones.add(p);
      }
    }

    em.persist(usuario)
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

    const id = req.params.id
    const usuario = await em.findOneOrFail(Usuario, { id }, { populate: ['profesiones'] })

    const { provincia, localidad, clave, email, descripcion, contacto, horarios, direccion } = req.body.sanitizedInput

    const profesionesName: string[] = Array.isArray(req.body.profesiones)
      ? req.body.profesiones
        .map((x: any) => (x == null ? '' : String(x).trim())) // normalizo todo a string y quito espacios
        .filter((s: string) => s.length > 0)
      : [];

    if (provincia) usuario.provincia = em.getReference(Provincia, provincia)
    if (localidad) usuario.localidad = em.getReference(Localidad, localidad)
    const imagen = req.file
      ? `/uploads/${req.file.filename}`
      : usuario.fotoUrl;
    usuario.fotoUrl = imagen
    if (clave) usuario.clave = clave
    if (email) usuario.email = email.trim().toLowerCase()
    if (descripcion) usuario.descripcion = descripcion.trim()
    if (contacto) usuario.contacto = contacto.toString().trim()
    if (horarios) usuario.horarios = horarios.trim()
    if (direccion) usuario.direccion = direccion.trim()

    const nombresEntrantes = [...new Set(profesionesName)]; // quitar duplicados entrantes
    const nombresExistentes = new Set<string>(usuario.profesiones.getItems().map(p => p.nombreProfesion));

    // buscar en un solo query las profesiones que coincidan
    const profesionesEncontradas = await em.find(Profesiones, {
      nombreProfesion: { $in: nombresEntrantes },
    });

    // añadir las que el usuario no tiene
    for (const prof of profesionesEncontradas) {
      if (!nombresExistentes.has(prof.nombreProfesion)) {
        usuario.profesiones.add(prof);
        nombresExistentes.add(prof.nombreProfesion);
      }
    }



    await em.flush()
    res.status(200).json({ message: 'Usuario class updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    const usuario = em.getReference(Usuario, id)
    await em.removeAndFlush(usuario)
    res.status(200).send({ message: 'Usuario deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove, sanitizeUsuarioInput, buscarUsuarios }
