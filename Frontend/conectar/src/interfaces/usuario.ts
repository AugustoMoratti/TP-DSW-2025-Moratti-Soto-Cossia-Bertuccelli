import type { Trabajo } from "./trabajo.ts";
import type { Profesion } from "./profesion.ts";

export interface Usuario {
  fotoUrl: string;
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  provincia: { nombre: string };
  localidad: { nombre: string };
  profesiones?: Profesion[];
  direccion: string;
  trabajos: Trabajo[];
  trabajosContratados: Trabajo[];
};
