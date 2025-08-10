import { Localidades } from "./localidad.entity.js";
const localidades = [
    new Localidades('Rosario', '2000', 'Santa Fe'),
];
export class LocalidadRepository {
    findAll() { return Localidades; }
    findOne(item) {
        return Localidades.find(loc => loc.codPostal === item.id);
    }
    add(item) {
        Localidades.push(item);
        return item;
    }
    update(item) {
        const i = Localidades.findIndex(loc => loc.codPostal === item.codPostal);
        if (i != -1) {
            Localidades[i] = item;
            return item;
        }
        return undefined;
    }
    delete(item) {
        const i = Localidades.findIndex(loc => loc.codPostal === item.id);
        if (i != -1) {
            return Localidades.splice(i, 1)[0];
        }
        return undefined;
    }
}
//# sourceMappingURL=localidad.repository.js.map