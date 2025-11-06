import type { Profesion } from "./profesion.ts";

export type ProfileCardProps = {
  nombre: string;
  apellido: string;
  email: string;
  localidad?: string;
  provincia?: string;
  fotoUrl?: string | null;
  tipoPage: "miPerfil" | "otro";
  profesiones?: Profesion[];     // <- array de objetos
  habilidades?: string[];
  trabajos?: string[];
  descripcion?: string;
  onUpdateDescripcion?: (desc: string) => Promise<void> | void;
};
