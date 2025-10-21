export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  provincia?: { nombre: string };
  localidad?: { nombre: string };
  profesiones?: { nombreProfesion: string }[];
  direccion: string;
};
