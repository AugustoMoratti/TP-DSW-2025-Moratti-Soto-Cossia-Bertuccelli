import { Request, Response } from 'express';
import { Provincia } from '../provincia/provincia.entity.js';
import { Localidad } from '../localidad/localidades.entity.js';
import { Profesiones } from '../profesion/profesion.entity.js';
import { getEm } from '../../DB/orm.js';
import { Usuario } from '../usuario/usuario.entity.js';
import { hashPassword, comparePassword } from '../utils/bcryp.js';
import { signToken } from '../utils/jwt.js';
import { upload, UPLOADS_DIR } from '../utils/upload.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const adminBlockedDomains = ["@admin.com"];

export const register = async (req: Request, res: Response) => {
  try {
    //const usuario = em.create(Usuario, req.body)
    const em = getEm();
    const { nombre, apellido, clave, email, descripcion, contacto, provincia, localidad, fechaNac, direccion } = req.body.sanitizedInput
    if (!nombre || !apellido || !clave || !email || !provincia || !localidad) {
      return res.status(400).json({ message: 'Faltan campos requeridos: nombre, apellido, clave, email, provincia o localidad' })
    }

    const provinciaRef = await em.findOne(Provincia, { nombre: provincia }) as Provincia
    console.log("prov", provinciaRef.nombre)
    if (!provinciaRef) {
      const err: any = new Error('Provincia inexistente');
      err.status = 400;
      err.code = 'PROVINCIA_NOT_FOUND';
      throw err;
    }

    /*const qRaw = String(localidad).trim().toLowerCase();
 
     if (!qRaw) {
       return res.status(400).json({ message: 'Debe ingresar un término de búsqueda.' });
     }
 
     const qParam = `%${qRaw}%`;
     const localidadRef = await em.findOne(Localidad, { nombre: { $like: `%${qParam}%` } }) as Localidad;*/
    const localidadRef = await em.findOne(Localidad, { nombre: localidad }) as Localidad
    console.log("localidad", localidadRef.nombre)
    if (!localidadRef) {
      const err: any = new Error('Localidad inexistente');
      err.status = 400;
      err.code = 'LOCALIDAD_NOT_FOUND';
      throw err;
    }

    if (localidadRef.provincia.nombre !== provinciaRef.nombre) {
      console.log('provincia ', provinciaRef.nombre)
      console.log('provincia de localidad', localidadRef.provincia.nombre)
      const err: any = new Error('La localidad no pertenece a la provincia seleccionada');
      err.status = 400;
      err.code = 'LOCALIDAD_PROVINCIA_MISMATCH';
      throw err;
    }



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
      const err: any = new Error('El email ya está registrado');
      err.status = 400;
      err.code = 'EMAIL_ALREADY_REGISTERED';
      throw err;
    }

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
      .json({ message: 'Usuario creado', data: usuario })
  } catch (err: any) {
    return res.status(err.status || 500).json({
      err: err.message || 'Error interno del servidor'
    });
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
};//Podemos quitar desde el token directamente sin pasar por el fetchMe

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("userToken", {
    httpOnly: true,
    sameSite: "lax",
    secure: false // true en producción con https
  });

  res.status(200).json({ message: "Logout OK" });
};

//olvidar contraseña 
export async function forgotPassword(req: Request, res: Response) {
  console.log(" ENTRÓ A forgotPassword");

  try {
    const em = getEm();
    const { email } = req.body;

    const usuario = await em.findOne(Usuario, { email: email.toLowerCase() });
    console.log(" USER:", usuario ? usuario.email : null);

    if (!usuario) {
      return res.status(200).json({ message: 'Si el email existe, se enviará un correo' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    console.log(" TOKEN GENERADO:", token);


    usuario.resetToken = token;
    usuario.resetTokenExp = new Date(Date.now() + 1000 * 60 * 30); // 30 min

    await em.flush();

    const link = `http://localhost:5173/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    console.log(" ANTES DE SENDMAIL");
    await transporter.sendMail({
      to: usuario.email,
      subject: 'Recuperar contraseña',
      html: `
        <h3>Recuperación de contraseña</h3>
        <p>Hacé click en el link:</p>
        <a href="${link}">Cambiar contraseña</a>
        <p>Este link vence en 30 minutos</p>
      `,
    });

    res.json({ message: 'Mail enviado' });
  } catch (err) {
    console.error(err);
    console.error(" ERROR EN forgotPassword:", err);
    res.status(500).json({ message: 'Error al enviar mail' });
  }
}

//cambiar contraseña
export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;
    const em = getEm();

    const usuario = await em.findOne(Usuario, { resetToken: token });

    if (!usuario) {
      return res.status(400).json({ message: 'Token inválido' });
    }

    if (!usuario.resetTokenExp || usuario.resetTokenExp < new Date()) {
      return res.status(400).json({ message: 'Token expirado' });
    }

    usuario.clave = await hashPassword(password);
    usuario.resetToken = undefined;
    usuario.resetTokenExp = undefined;

    await em.flush();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al resetear contraseña' });
  }
}