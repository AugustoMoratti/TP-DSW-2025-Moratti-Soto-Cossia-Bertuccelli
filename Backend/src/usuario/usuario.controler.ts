import { Request, Response, NextFunction } from 'express';
import { Usuario } from './usuario.entity.js';
import { Provincia } from '../provincia/provincia.entity.js';
import { Localidad } from '../localidad/localidades.entity.js';
import { Profesiones } from '../profesion/profesion.entity.js';
import { orm } from '../../DB/orm.js';
import { RequestContext } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/core';
import { hashPassword, comparePassword } from '../utils/bcryp.js';
import { HttpError } from '../types/HttpError.js';

const em = orm.em.fork();

function sanitizeUsuarioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    clave: req.body.clave,
    email: req.body.email,
    fotoUrl: req.body.fotoUrl,
    descripcion: req.body.descripcion,
    direccion: req.body.direccion,
    contacto: req.body.contacto,
    horarios: req.body.horarios,
    provincia: req.body.provincia,
    localidad: req.body.localidad,
    profesiones: req.body.profesiones,
    fechaNac: req.body.fechaNac,
    trabajos: req.body.trabajos,
    habilidades: req.body.habilidades
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined || req.body.sanitizedInput[key] === null) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function buscarUsuarios(req: Request, res: Response, next: NextFunction) {
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
      populate: ['provincia', 'localidad', 'profesiones', 'trabajos', 'trabajos.resenia'],
      limit: 10
    });
    if (usuarios.length === 0) {
      res.status(200).json({ message: 'No hay usuarios con esas especificaciones', data: usuarios })
    }
    return res.status(200).json({ data: usuarios });
  } catch (error: any) {
    next(error)
  }
} //quiero en un futuro poder ordenarlos por resenia

async function findAll(req: Request, res: Response, next: NextFunction) {
  try {
    const usuarios = await em.find(Usuario, {}, { populate: ['profesiones', 'localidad'] })
    if (usuarios.length === 0) {
      res
        .status(200)
        .json({ message: 'No se encontraron Usuarios', data: usuarios })
    }
    res
      .status(200)
      .json({ message: 'Usuarios encontrados', data: usuarios })
  } catch (error) {
    next(error)
  }
}

async function findOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id
    const usuario = await em.findOne(Usuario, { id }, { populate: ['profesiones', 'trabajos', 'trabajos.resenia', 'provincia', 'localidad'] })
    if (!usuario) {
      throw new HttpError(404, 'NOT_FOUND', 'No se encontró el Usuario')
    }
    res
      .status(200)
      .json({ message: 'found Usuario', data: usuario })
  } catch (error: any) {
    next(error)
  }
}


export async function addProfesiones(req: Request, res: Response, next: NextFunction) {
  //const em = RequestContext.getEntityManager();
  //ver de cambiar por ( const em = orm.em.fork(); )

  const em = orm.em.fork();

  try {
    const userId = req.body.userId as string | number | undefined;
    if (!userId) {
      throw new HttpError(400, 'INVALID_INPUT', 'Falta userId')
    }

    const raw = req.body.profesiones;
    if (!Array.isArray(raw)) {
      throw new HttpError(400, 'INVALID_INPUT', 'El campo profesiones debe ser un arreglo')
    }

    const profesionesName = raw
      .filter((p: unknown) => typeof p === "string")
      .map((p: string) => p.trim())
      .filter((p) => p.length > 0)
      .map((p) => p.toLowerCase());

    /*if (!em) {
      return res.status(500).json({ message: 'EntityManager no inicializado' });
    }*/


    const result = await em.transactional<
      | { type: 'CLEARED' }
      | { type: 'UPDATED'; profesiones: Profesiones[] }
    >(async (tem: EntityManager) => {

      const usuario = await tem.findOne(Usuario, { id: String(userId) }, { populate: ["profesiones"] });
      if (!usuario) {
        throw new HttpError(404, 'NOT_FOUND', 'Usuario no encontrado')

      }

      if (profesionesName.length === 0) {
        usuario.profesiones.set([]); // reemplaza toda la colección
        await tem.flush();
        return { type: 'CLEARED' } as const;
        /*await tem.flush();
        return res.status(200).json({ message: "Profesiones eliminadas" });*/
      }

      const profesionesRef = await tem.find(Profesiones, {
        nombreProfesion: { $in: profesionesName },
        estado: true,
      });

      if (profesionesRef.length === 0) {
        throw new HttpError(400, 'INVALID_INPUT', 'Ninguna profesión válida encontrada')
      }

      usuario.profesiones.set(profesionesRef);
      await tem.flush();
      return {
        type: 'UPDATED',
        profesiones: profesionesRef
      } as const;
      /*return res.status(200).json({
        message: "Profesiones actualizadas",
        total: profesionesRef.length,
        profesiones: profesionesRef.map((p) => ({ id: p.nombreProfesion })),
      });*/
    });

    if (result.type === 'CLEARED') {
      return res.status(200).json({
        message: 'Profesiones eliminadas'
      })
    }

    return res.status(200).json({
      message: 'Profesiones actualizadas',
      total: result.profesiones.length,
      profesiones: result.profesiones.map((p) => ({
        nombre: p.nombreProfesion,
      })),
    });

  } catch (error: any) {
    next(error)
  }
}


async function add(req: Request, res: Response, next: NextFunction) {
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
      throw new HttpError(400, 'INVALID_INPUT', 'El nombre es obligatorio y debe ser un string')
    };

    if (typeof apellido !== 'string' || apellido === "") {
      throw new HttpError(400, 'INVALID_INPUT', 'El apellido es obligatorio y debe ser un string')
    };

    if (typeof clave !== 'string' || clave === "") {
      throw new HttpError(400, 'INVALID_INPUT', 'La clave es obligatoria y debe ser un string')
    };

    if (typeof email !== 'string' || email === "") {
      throw new HttpError(400, 'INVALID_INPUT', 'El email es obligatorio y debe ser un string')
    };

    if (typeof contacto !== 'string') {
      throw new HttpError(400, 'INVALID_INPUT', 'El numero de contacto es obligatorio y debe ser un string')
    };

    if (typeof fechaNac !== 'string' || fechaNac === "") {
      throw new HttpError(400, 'INVALID_INPUT', 'El horario es obligatorio y debe ser un string')
    };

    if (typeof horarios !== 'string' || horarios === "") {
      throw new HttpError(400, 'INVALID_INPUT', 'El horario es obligatorio y debe ser un string')
    };

    if (descripcion && typeof descripcion !== 'string') {
      throw new HttpError(400, 'INVALID_INPUT', 'La descripcion debe ser un string')
    };

    if (direccion && typeof direccion !== 'string') {
      throw new HttpError(400, 'INVALID_INPUT', 'La direccion debe ser un string')
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
      .json({ message: 'Usuario creado', data: usuario })
  } catch (error: any) {
    next(error)
  }
}

async function deleteProfesion(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id;
    const usuario = await em.findOne(Usuario, { id }, { populate: ['profesiones'] });
    if (!usuario) {
      throw new HttpError(404, 'NOT_FOUND', 'Usuario no encontrado')
    }

    const profesionesName: string[] = Array.isArray(req.body.profesiones)
      ? req.body.profesiones
        .map((x: any) => (x == null ? "" : String(x).trim()))
        .filter((s: string) => s.length > 0)
      : [];

    const nombresEntrantes = [...new Set(profesionesName)];
    const nombresExistentes = new Set<string>(
      usuario.profesiones.getItems().map((p) => p.nombreProfesion)
    );

    const profesionesEncontradas = await em.find(Profesiones, {
      nombreProfesion: { $in: nombresEntrantes },
    });


    for (const prof of profesionesEncontradas) {
      if (nombresExistentes.has(prof.nombreProfesion)) {
        usuario.profesiones.remove(prof);
      }
    }

    await em.flush();
    res.status(200).json({ message: "Usuario actualizado correctamente", data: usuario });
  } catch (error: any) {
    next(error)
  }
}

async function update(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.body);

    const id = req.params.id;
    const usuario = await em.findOne(Usuario, { id }, { populate: ['profesiones'] });
    if (!usuario) {
      throw new HttpError(404, 'NOT_FOUND', 'Usuario no encontrado')
    }

    const { nombre, apellido, fechaNac, provincia, localidad, clave, email, descripcion, contacto, horarios, direccion, habilidades } = req.body;

    if (nombre) usuario.nombre = req.body.nombre.trim();
    if (apellido) usuario.apellido = req.body.apellido.trim();
    if (fechaNac) usuario.fechaNac = new Date(req.body.fechaNac).toISOString().split("T")[0];
    //if (provincia) usuario.provincia = em.getReference(Provincia, provincia);
    if (localidad) {
      const localidadRef = await em.findOne(Localidad, { nombre: localidad }, { populate: ["provincia"] });
      if (!usuario) {
        throw new HttpError(404, 'NOT_FOUND', 'Usuario no encontrado')
      }
      usuario.localidad = localidadRef!
      usuario.provincia = localidadRef!.provincia
    };


    const imagen = req.file ? `/uploads/${req.file.filename}` : usuario.fotoUrl;
    usuario.fotoUrl = imagen;

    if (clave) usuario.clave = await hashPassword(clave);
    if (email) usuario.email = email.trim().toLowerCase();
    if (descripcion) usuario.descripcion = descripcion.trim();
    if (contacto) usuario.contacto = contacto.toString().trim();
    if (horarios) usuario.horarios = horarios.trim();
    if (direccion) usuario.direccion = direccion.trim();

    if (req.body.habilidades) { usuario.habilidades = req.body.habilidades; }

    // Profesiones
    const profesionesName: string[] = Array.isArray(req.body.profesiones)
      ? req.body.profesiones
        .map((x: any) => (x == null ? "" : String(x).trim()))
        .filter((s: string) => s.length > 0)
      : [];

    const nombresEntrantes = [...new Set(profesionesName)];
    const nombresExistentes = new Set<string>(
      usuario.profesiones.getItems().map((p) => p.nombreProfesion)
    );

    const profesionesEncontradas = await em.find(Profesiones, {
      nombreProfesion: { $in: nombresEntrantes },
    });


    for (const prof of profesionesEncontradas) {
      if (!nombresExistentes.has(prof.nombreProfesion)) {
        usuario.profesiones.add(prof);
        nombresExistentes.add(prof.nombreProfesion);
      }
    }

    await em.flush();
    res.status(200).json({ message: "Usuario actualizado correctamente", data: usuario });
  } catch (error: any) {
    next(error)
  }
}


async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id
    const usuario = em.getReference(Usuario, id)
    await em.removeAndFlush(usuario)
    res.status(200).send({ message: 'Usuario eliminado' })
  } catch (error: any) {
    next(error)
  }
}

export { findAll, findOne, add, update, remove, sanitizeUsuarioInput, buscarUsuarios, deleteProfesion }