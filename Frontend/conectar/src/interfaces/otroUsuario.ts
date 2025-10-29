import type { Trabajo } from "./trabajo.ts";

export interface OtroUsuario {
  fotoUrl: string;
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  provincia?: string;
  localidad?: string;
  profesiones?: { nombreProfesion: string }[];
  direccion: string;
  trabajos: Trabajo[];
};