import { Repository } from "../shared/repository.js";
import { Localidad } from "./localidades.entity.js";

const Localidades: Localidad[] = [
  new Localidad(
    '2000',
    'Rosario',
  ),
];

export class LocalicadRepository implements Repository<Localidad> {
  
  public findAll(): Localidad[] | undefined { return Localidades; }

  public findOne(item: { id: string }): Localidad | undefined {
    return Localidades.find(loc => loc.codPostal ===item.id);
  }

  public add(item: Localidad): Localidad | undefined {
    Localidades.push(item);
    return item;
  }

  public update(item: Localidad): Localidad | undefined{
    const i = Localidades.findIndex(loc => loc.codPostal === item.codPostal);
    if (i != -1) {
      Localidades[i] = item;
      return item;
    }
    return undefined;
  }

  public delete (item: { id: String }): Localidad | undefined{
    const i = Localidades.findIndex(loc => loc.codPostal === item.id);
    if (i != -1){
      return Localidades.splice(i , 1) [0];
    }
    return undefined;
  }
}