import type { Trabajo } from "./trabajo.ts";
import type { Profesion } from "./profesion.ts";

export interface OtroUsuario {
  fotoUrl: string;
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  provincia?: string;
  localidad?: string;
  descripcion?: string;
  profesiones?: Profesion[];
  habilidades?: [];
  direccion: string;
  trabajos: Trabajo[];
  trabajosContratados: Trabajo[];
};