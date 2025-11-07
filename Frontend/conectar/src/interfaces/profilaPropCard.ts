import type { Profesion } from "./profesion.ts";

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
  tipoPage: "miPerfil" | "suPerfil";
  profesiones?: Profesion[];     // <- array de objetos
  habilidades?: string[];
  trabajos?: string[];
  descripcion?: string;
  onUpdateDescripcion?: (desc: string) => Promise<void> | void;
};
