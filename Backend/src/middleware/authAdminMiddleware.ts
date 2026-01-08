import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { getEm } from '../../DB/orm.js';
import { Administrador } from '../admin/admin.entity.js';
import { signToken } from '../utils/jwt.js';
import { HttpError } from '../types/HttpError.js';

export const authAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) intenta obtener token desde header Authorization
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

    // 2) o intenta desde cookie (si usás cookie HttpOnly)
    const tokenFromCookie = req.cookies?.adminToken;

    const token = tokenFromHeader ?? tokenFromCookie;
    //if (!token) return res.status(401).json({ error: 'No autorizado' });
    if (!token) { throw new HttpError(401, 'UNHAUTORIZED', 'Admin no autorizado') }

    const payload = verifyToken(token);
    //if (!payload?.id) return res.status(401).json({ error: 'Token inválido' });
    if (!payload?.id) { throw new HttpError(401, 'UNHAUTORIZED', 'Token invalido') }

    const em = getEm();
    const admin = await em.findOne(Administrador, { id: payload.id });
    //if (!admin) return res.status(401).json({ error: 'Administrador no existe' });
    if (!admin) { throw new HttpError(401, 'UNHAUTORIZED', 'Administrador no existe') }

    req.admin = admin;
    next();
  } catch (error: any) {
    next(error)
  }
};

export const refreshAdminCookieMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.adminToken;
  if (!token) return next();

  try {
    const payload = verifyToken(token);
    const newToken = signToken({ id: payload.id, email: payload.email });

    res.cookie('adminToken', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hora
    });
  } catch (err) {
    console.log('token expirado')
    res.clearCookie('adminToken');
    //return res.status(401).json({ error: 'Token inválido o expirado' }); No hace falta
  }

  next();
};