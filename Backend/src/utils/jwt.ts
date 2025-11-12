import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no definido en .env');
}

const SECRET: string = process.env.JWT_SECRET;
const EXPIRES_IN_SECONDS: number = Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 3600); // 1 hora por defecto

export interface JwtPayload {
  id: string;
  email?: string;
  iat?: number;
  exp?: number;
}

/**
 * Crea un JWT con payload y expiración.
 * @param payload Objeto con datos del usuario (no incluir iat/exp)
 * @returns token JWT como string
 */
export const signToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN_SECONDS });
};

/**
 * Verifica un token JWT y devuelve el payload tipado.
 * @param token JWT recibido
 * @returns payload del JWT
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET) as JwtPayload;
};