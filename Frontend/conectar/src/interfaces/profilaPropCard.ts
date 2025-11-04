
export interface ProfileCardProps {
  nombre: string;
  apellido: string;
  email: string;
  imagenPerfil?: string;
  localidad?: string;
  provincia?: string;
  fotoUrl?: string;
  tipoPage?: "miPerfil" | "suPerfil"
  trabajos?: string[];
  descripcion?: string;
  onUpdateDescripcion?: (newDesc: string) => Promise<void>;
}
