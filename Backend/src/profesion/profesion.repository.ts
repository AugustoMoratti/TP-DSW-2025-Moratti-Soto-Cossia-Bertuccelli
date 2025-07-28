import { Repository } from "../shared/repository.js";
import { Profesion } from "./profesion.entity.js";

const profesiones: Profesion[] = [
  new Profesion(
    'Plomero',
    'Encargado de reparar tuberías y sistemas de fontanería',
    true,
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad',
  ),
]

export class ProfesionRepository implements Repository<Profesion> {

  public findAll(): Profesion[] | undefined {
    return profesiones;
  }

  public findOne(item: { id: string }): Profesion | undefined {
    return profesiones.find(prof => prof.codProf === item.id);
  }

  public add(item: Profesion): Profesion | undefined {
    profesiones.push(item);
    return item;
  }

  public update(item: Profesion): Profesion | undefined {
    const i = profesiones.findIndex(prof => prof.codProf === item.codProf);
    if (i !== -1) {
      profesiones[i] = item;
      return item;
    }
    return undefined;
  }

  public delete(item: { id: string }): Profesion | undefined {
    const i = profesiones.findIndex(prof => prof.codProf === item.id);
    if (i !== -1) {
      return profesiones.splice(i, 1)[0];
    }
    return undefined;
  }

}