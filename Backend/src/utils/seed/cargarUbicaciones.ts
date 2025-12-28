import { orm } from '../../../DB/orm.js';
import { Provincia } from '../../provincia/provincia.entity.js';
import { Localidad } from '../../localidad/localidades.entity.js';


export async function cargarUbicaciones() {
  const em = orm.em.fork();

  const provinciasRes = await fetch("https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre");
  const provinciasData = await provinciasRes.json();

  for (const prov of provinciasData.data.provincias) {
    let provincia = await em.findOne(Provincia, { id: prov.id })

    if (!provincia) {
      provincia = em.create(Provincia, {
        id: prov.id,
        nombre: prov.nombre
      });
      em.persist(provincia);
    }

    const localidadesRes = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${prov.id}&campos=id,nombre&max=5000`);
    const localidadesData = await localidadesRes.json();

    for (const loc of localidadesData.data.localidades) {
      const existe = await em.findOne(Localidad, { id: loc.id });

      if (!existe) {
        em.persist(
          em.create(Localidad, {
            id: loc.id,
            nombre: loc.nombre,
            provincia: provincia
          })
        );
      }
    }
  }

  await em.flush();
}