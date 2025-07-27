import { Provincia } from './provincia.entity.js';
const provincias = [
    new Provincia('Santa Fe', true, 'a02b91bc-3769-4221-beb1-d7a3aeba7dad'),
];
export class ProvinciaRepository {
    findAll() {
        return provincias;
    }
    findOne(item) {
        return provincias.find((provincia) => provincia.id === item.id);
    }
    add(item) {
        const prov = provincias.find((provincia) => provincia.nombre === item.nombre);
        if (!prov) {
            provincias.push(item);
            return item;
        }
        else {
            return;
        }
    }
    update(item) {
        const provinciaIdx = provincias.findIndex((provincia) => provincia.id === item.id);
        if (provinciaIdx !== -1) {
            provincias[provinciaIdx] = { ...provincias[provinciaIdx], ...item };
        }
        return provincias[provinciaIdx];
    }
    delete(item) {
        const provinciaIdx = provincias.findIndex((provincia) => provincia.id === item.id);
        //devuelve la posicion si lo encuentra, sino -1
        if (provinciaIdx !== -1) {
            provincias[provinciaIdx].estado = false;
            const deletedProvincia = provincias[provinciaIdx];
            return deletedProvincia;
        }
    }
}
//# sourceMappingURL=provincia.repository.js.map