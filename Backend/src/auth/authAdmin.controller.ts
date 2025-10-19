import { Request, Response } from 'express';
import { getEm } from '../../DB/orm.js';
import { hashPassword, comparePassword } from '../utils/bcryp.js';
import { signToken } from '../utils/jwt.js';
import { Administrador } from '../admin/admin.entity.js';



export const registerAdmin = async (req: Request, res: Response) => {
  try {
    //const usuario = em.create(Usuario, req.body)
    const em = getEm();
    const { user, clave, email } = req.body

    const administrador = new Administrador()

    administrador.user = user;
    administrador.clave = await hashPassword(clave);
    administrador.email = email;


    em.persist(administrador)
    await em.flush()

    const token = signToken({ id: administrador.id!, email: administrador.email });

    // cookie HttpOnly
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hora
    });

    res
      .status(201)
      .json({ message: 'Administrador class created', data: administrador })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const em = getEm();
    const { email, clave } = req.body as { email: string; clave: string; };
    if (!email || !clave) return res.status(400).json({ error: 'falta email/clave' });

    const administrador = await em.findOne(Administrador, { email });
    if (!administrador) return res.status(401).json({ error: 'Credenciales inválidas' });

    const ok = await comparePassword(clave, administrador.clave);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = signToken({ id: administrador.id!, email: administrador.email });

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    });

    res
      .status(201)
      .json({ message: 'Administrador logueado', data: administrador })
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  };
};

export const meAdmin = async (req: Request, res: Response) => {
  const administrador = req.admin;
  if (!administrador) return res.status(401).json({ error: 'No autorizado' });
  res.json({ administrador: { id: administrador.id, user: administrador.user, email: administrador.email ?? null } });
};