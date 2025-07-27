import { Repository } from '../shared/repository.js'
import { Provincia } from './provincia.entity.js'

const provincias = [
  new Provincia(
    'Santa Fe',
    true,
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad',
  ),
]

export class ProvinciaRepository implements Repository<Provincia> {
  public findAll(): Provincia[] | undefined {
    return provincias
  }

  public findOne(item: { id: string }): Provincia | undefined {
    return provincias.find((provincia) => provincia.id === item.id)
  }

  public add(item: Provincia): Provincia | undefined {
    const prov = provincias.find((provincia) => provincia.nombre === item.nombre)
    if (!prov) {
      provincias.push(item)
      return item
    } else {
      return
    }

  }

  public update(item: Provincia): Provincia | undefined {
    const provinciaIdx = provincias.findIndex((provincia) => provincia.id === item.id)

    if (provinciaIdx !== -1) {
      provincias[provinciaIdx] = { ...provincias[provinciaIdx], ...item }
    }
    return provincias[provinciaIdx]
  }

  public delete(item: { id: string }): Provincia | undefined {
    const provinciaIdx = provincias.findIndex((provincia) => provincia.id === item.id)
    //devuelve la posicion si lo encuentra, sino -1

    if (provinciaIdx !== -1) {
      provincias[provinciaIdx].estado = false
      const deletedProvincia = provincias[provinciaIdx]
      return deletedProvincia
    }
  }
}