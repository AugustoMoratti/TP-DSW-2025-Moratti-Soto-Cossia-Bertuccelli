import { Usuario } from '../usuario/usuario.entity.js';

declare module 'express' {
  interface Request {
    user?: Usuario;
  }
}