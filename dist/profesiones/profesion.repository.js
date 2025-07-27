import { Profesion } from "./profesion.entity.js";
const Profesiones = [
    new Profesion('Plomero', 'Encargado de reparar tuberías y sistemas de fontanería', true, 'a02b91bc-3769-4221-beb1-d7a3aeba7dad'),
];
export class ProfesionRepository {
    findAll() {
        return Profesiones;
    }
    findOne(item) {
        return Profesiones.find(prof => prof.codProf === item.id);
    }
    add(item) {
        Profesiones.push(item);
        return item;
    }
    update(item) {
        const i = Profesiones.findIndex(prof => prof.codProf === item.codProf);
        if (i !== -1) {
            Profesiones[i] = item;
            return item;
        }
        return undefined;
    }
    delete(item) {
        const i = Profesiones.findIndex(prof => prof.codProf === item.id);
        if (i !== -1) {
            return Profesiones.splice(i, 1)[0];
        }
        return undefined;
    }
}
//# sourceMappingURL=profesion.repository.js.map