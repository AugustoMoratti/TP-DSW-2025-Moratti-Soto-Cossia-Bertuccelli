import type { Trabajo } from "./trabajo.ts";
import type { Profesion } from "./profesion.ts";
import type { Posteo } from "/.post.ts"

export interface OtroUsuario {
  fotoUrl: string;
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  contacto?: string;
  provincia: { nombre: string };
  localidad: { nombre: string };
  descripcion?: string;
  profesiones?: Profesion[];
  habilidades?: [];
  direccion: string;
  trabajos?: Trabajo[];
  trabajosContratados?: Trabajo[];
  posteos: Posteo[];
};