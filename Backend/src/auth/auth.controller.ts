import { Request, Response } from 'express';
import { Provincia } from '../provincia/provincia.entity.js';
import { Localidad } from '../localidad/localidades.entity.js';
import { Profesiones } from '../profesion/profesion.entity.js';
import { getEm } from '../../DB/orm.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { hashPassword, comparePassword } from '../utils/bcryp.js';
import { signToken } from '../utils/jwt.js';
import { upload, UPLOADS_DIR } from '../utils/upload.js';

const adminBlockedDomains = ["@admin.com"];

export const register = async (req: Request, res: Response) => {
  try {
    //const usuario = em.create(Usuario, req.body)
    const em = getEm();
    const { nombre, apellido, clave, email, descripcion, contacto, provincia, localidad, fechaNac, direccion, trabajos, habilidades } = req.body.sanitizedInput
    /*if (!nombre || !apellido || !clave || !email || !provincia || !localidad) {
      return res.status(400).json({ message: 'Faltan campos requeridos: nombre, apellido, clave, email, provincia o localidad' })
    }*/

    const provinciaRef = em.getReference(Provincia, provincia)
    const localidadRef = em.getReference(Localidad, localidad)

    const profesionesName: string[] = Array.isArray(req.body.sanitizedInput.profesiones)
      ? req.body.sanitizedInput.profesiones
      : []

    let profesionesRef: Profesiones[] = []

    if (Array.isArray(profesionesName) && profesionesName.length > 0) {
      profesionesRef = await em.find(Profesiones, {
        nombreProfesion: { $in: profesionesName },
        estado: true
      })
    };

    const usuario = new Usuario()

    usuario.fotoUrl = "/uploads/default.jpg";
    usuario.nombre = nombre;
    usuario.apellido = apellido;
    usuario.clave = await hashPassword(clave);;
    usuario.email = email;
    usuario.direccion = direccion;
    usuario.contacto = contacto;
    if (descripcion) usuario.descripcion = descripcion;
    usuario.provincia = provinciaRef;
    usuario.localidad = localidadRef;
    usuario.fechaNac = fechaNac;
    if (profesionesRef.length > 0) {
      for (const p of profesionesRef) {
        usuario.profesiones.add(p);
      }
    }

    const emailNorm = email.trim().toLowerCase();
    if (adminBlockedDomains.some(d => emailNorm.endsWith(d))) {
      return res.status(403).json({ error: "No se permite registrar cuentas de administrador" });
    }

    const usuarioExistente = await em.findOne(Usuario, { email });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Ya existe un usuario con ese email' });
    }

    em.persist(usuario)
    await em.flush()

    const token = signToken({ id: usuario.id!, email: usuario.email });

    // cookie HttpOnly
    res.cookie('userToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
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

    res.clearCookie("token", { httpOnly: true, path: "/" });

    const token = signToken({ id: usuario.id!, email: usuario.email });
    const EXPIRES_IN_SECONDS = 3600;
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: EXPIRES_IN_SECONDS * 1000,
      sameSite: "lax",
      path: "/",
    });
    console.log('Logueado Correctamente')
    res
      .status(201)
      .json({ message: 'Usuario logueado', data: usuario })

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  };
};

export const me = async (req: Request, res: Response) => {
  const usuario = req.user;
  if (!usuario) return res.status(401).json({ error: 'No autorizado (me)' });
  res.json({ usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("userToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  res.status(200).json({ message: "Sesión cerrada" });
};
