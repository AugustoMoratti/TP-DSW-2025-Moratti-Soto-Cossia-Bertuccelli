import type { Resenia } from "./resenia.ts";
import type { Usuario } from "./usuario.ts";

export interface Trabajo {
  id: number;
  resenia: Resenia;
  montoTotal?: number;
  cliente: Usuario;
  fechaPago?: string;
  fechaSolicitud?: string;
  fechaFinalizado?: string;
}