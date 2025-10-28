import type { Trabajo } from "./trabajo.ts";

export interface Usuario {
  fotoUrl: string;
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  provincia?: { nombre: string };
  localidad?: { nombre: string };
  profesiones?: { nombreProfesion: string }[];
  direccion: string;
  trabajos: Trabajo[];
};
