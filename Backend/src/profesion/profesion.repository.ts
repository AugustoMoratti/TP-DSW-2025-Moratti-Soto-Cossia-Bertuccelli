import { Repository } from "../shared/repository.js";
import { Profesion } from "./profesion.entity.js";

const Profesiones: Profesion[] = [
  new Profesion(
    'Plomero',
    'Encargado de reparar tuberías y sistemas de fontanería',
    true,
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad',
  ),
];

export class ProfesionRepository implements Repository<Profesion> {

  public findAll(): Profesion[] | undefined {
    return Profesiones;
  }

  public findOne(item: { id: string }): Profesion | undefined {
    return Profesiones.find(prof => prof.codProf === item.id);
  }

  public add(item: Profesion): Profesion | undefined {
    Profesiones.push(item);
    return item;
  }

  public update(item: Profesion): Profesion | undefined {
  const i = Profesiones.findIndex(prof => prof.codProf === item.codProf);
  if (i !== -1) {
    Profesiones[i] = item;
    return item;
  }
  return undefined;
  }

  public delete(item: { id: string }): Profesion | undefined {
    const i = Profesiones.findIndex(prof => prof.codProf === item.id);
    if (i !== -1) {
      return Profesiones.splice(i, 1)[0];
    }
    return undefined;
  }

}