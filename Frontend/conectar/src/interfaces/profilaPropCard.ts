import type { Profesion } from "./profesion.ts";
import type { Trabajo } from "./trabajo.ts";
//import type { Localidad } from "./localidad.ts"
//import type { Provincia } from './provincia.ts'



export type ProfileCardProps = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  fechaNac?: string;
  direccion?: string;
  localidad?: string;
  provincia?: string;
  fotoUrl?: string | null;
  contacto?: string;
  profesiones?: Profesion[];     // <- array de objetos
  habilidades?: string[];
  trabajos?: Trabajo[];
  descripcion?: string;
  tipoPage: "miPerfil" | "suPerfil";
  onUpdateDescripcion?: (desc: string) => Promise<void> | void;
};
