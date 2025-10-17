import { Usuario } from '../usuario/usuario.entity.js';
import { Administrador } from '../admin/admin.entity.ts';

declare module 'express' {
  interface Request {
    user?: Usuario;
    admin?: Administrador;
  }
}