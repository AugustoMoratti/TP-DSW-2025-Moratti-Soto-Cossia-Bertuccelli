
export const fetchLocalidades = async (provinciaId: string) => {
  const res = await fetch(
    `https://apis.datos.gob.ar/georef/api/localidades?provincia=${provinciaId}`
  );

  const data = await res.json();
  return data.localidades;
}
