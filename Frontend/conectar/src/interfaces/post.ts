export interface Posteo {
  id: number;
  texto: string;
  imagenUrl?: string;
  fechaCreacion: string;
  user: {
    nombre: string;
    apellido: string;
    localidad: string;
    provincia: string;
  };
};
