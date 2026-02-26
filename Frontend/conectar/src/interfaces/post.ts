export interface PosteoType {
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
