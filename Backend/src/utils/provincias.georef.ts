export const fetchProvincias = async () => {
  const res = await fetch(
    'https://apis.datos.gob.ar/georef/api/provincias'
  );
  const data = await res.json();
  return data.provincias;
}