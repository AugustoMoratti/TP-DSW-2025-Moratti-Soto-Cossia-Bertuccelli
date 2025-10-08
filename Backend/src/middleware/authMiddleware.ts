import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { getEm } from '../../DB/orm.js';
import { Usuario } from '../usuario/usuario.entity.js';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1) intenta obtener token desde header Authorization
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

    // 2) o intenta desde cookie (si usás cookie HttpOnly)
    const tokenFromCookie = (req as any).cookies?.token as string | undefined;

    const token = tokenFromHeader ?? tokenFromCookie;
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    const payload = verifyToken(token);
    if (!payload?.id) return res.status(401).json({ error: 'Token inválido' });

    const em = getEm();
    const user = await em.findOne(Usuario, { id: payload.id });
    if (!user) return res.status(401).json({ error: 'Usuario no existe' });

    req.user = user;
    next();
  } catch (err) {
    console.error('authMiddleware error', err);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};