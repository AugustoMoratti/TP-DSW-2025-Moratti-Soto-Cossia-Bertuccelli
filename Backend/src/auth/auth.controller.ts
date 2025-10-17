import { Request, Response } from 'express';
import { Provincia } from '../provincia/provincia.entity.js';
import { Localidad } from '../localidad/localidades.entity.js';
import { Profesiones } from '../profesion/profesion.entity.js';
import { getEm } from '../../DB/orm.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { hashPassword, comparePassword } from '../utils/bcryp.js';
import { signToken } from '../utils/jwt.js';



export const register = async (req: Request, res: Response) => {
  try {
    //const usuario = em.create(Usuario, req.body)
    const em = getEm();
    const { nombre, apellido, clave, email, descripcion, contacto, horarios, provincia, localidad, profesiones, fechaNac } = req.body.sanitizedInput
    /*if (!nombre || !apellido || !clave || !email || !provincia || !localidad) {
      return res.status(400).json({ message: 'Faltan campos requeridos: nombre, apellido, clave, email, provincia o localidad' })
    }*/

    const provinciaRef = em.getReference(Provincia, provincia)
    const localidadRef = em.getReference(Localidad, localidad)

    const usuario = new Usuario()

    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.clave = await hashPassword(clave);;
    usuario.email = email;
    usuario.contacto = contacto;
    usuario.horarios = horarios;
    if (descripcion) usuario.descripcion = descripcion;
    usuario.provincia = provinciaRef;
    usuario.localidad = localidadRef;
    usuario.fechaNac = fechaNac;

    em.persist(usuario)
    await em.flush()

    const token = signToken({ id: usuario.id!, email: usuario.email });

    // cookie HttpOnly
    res.cookie('userToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hora
    });

    res
      .status(201)
      .json({ message: 'Usuario class created', data: usuario })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const em = getEm();
    const { email, clave } = req.body as { email: string; clave: string; };
    if (!email || !clave) return res.status(400).json({ error: 'falta email/clave' });

    const usuario = await em.findOne(Usuario, { email });
    if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await comparePassword(clave, usuario.clave);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = signToken({ id: usuario.id!, email: usuario.email });

    res.cookie('userToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    });

    res
      .status(201)
      .json({ message: 'Usuario logueado', data: usuario })
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  };
};

export const me = async (req: Request, res: Response) => {
  const usuario = req.user;
  if (!usuario) return res.status(401).json({ error: 'No autorizado' });
  res.json({ usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email ?? null } });
};
