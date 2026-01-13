import { orm } from '../../../DB/orm.js';
import { Provincia } from '../../provincia/provincia.entity.js';
import { Localidad } from '../../localidad/localidades.entity.js';

export async function cargarUbicaciones() {
  const em = orm.em.fork();

  const provinciasRes = await fetch("https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre");
  const provinciasData = await provinciasRes.json();
  console.log(provinciasData);

  for (const prov of provinciasData.provincias) {
    let provincia = await em.findOne(Provincia, { nombre: prov.nombre })

    if (!provincia) {
      provincia = em.create(Provincia, {
        nombre: prov.nombre
      });
      em.persist(provincia);
    }

    const localidadesRes = await fetch(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${prov.id}&campos=id,nombre&max=5000`);
    const localidadesData = await localidadesRes.json();


    for (const loc of localidadesData.localidades) {
      const existe = await em.findOne(Localidad, { nombre: loc.nombre });

      if (!existe) {
        em.persist(
          em.create(Localidad, {
            nombre: loc.nombre,
            provincia: provincia
          })
        );
      }
    }
  }
  console.log("Ubicaciones cargadas.");
  await em.flush();
}

