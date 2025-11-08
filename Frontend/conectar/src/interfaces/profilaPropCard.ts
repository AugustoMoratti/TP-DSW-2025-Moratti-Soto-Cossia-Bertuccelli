import type { Profesion } from "./profesion.ts";
import type { Trabajo } from "../interfaces/trabajo.ts";

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
  tipoPage: "miPerfil" | "otro";
  profesiones?: Profesion[];     // <- array de objetos
  habilidades?: string[];
  trabajos?: Trabajo[];
  descripcion?: string;
  onUpdateDescripcion?: (desc: string) => Promise<void> | void;
};
