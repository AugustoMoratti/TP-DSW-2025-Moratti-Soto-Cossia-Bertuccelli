import type { Usuario } from "../interfaces/usuario.ts";

export const estrellas = (usuario: Usuario) => {
  if (usuario.trabajos.length === 0) {
    return "0 trabajos"
  }
  const sumaResenias = usuario.trabajos!.reduce(
    (acum, trabajo) => acum + trabajo.resenia.valor, 0
  );
  const promedio = sumaResenias / usuario.trabajos.length;

  const estrellasCompletas = Math.round(promedio);

  return '★'.repeat(estrellasCompletas) + '☆'.repeat(5 - estrellasCompletas);

}