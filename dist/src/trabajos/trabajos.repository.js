import { Trabajo } from './trabajos.entity.js';
const trabajos = [
    new Trabajo('a02b91bc-3769-4221-beb1-d7a3aeba7dad', true, 15000),
];
export class TrabajosRepository {
    findAll() {
        return trabajos;
    }
    findOne(item) {
        return trabajos.find((trabajo) => trabajo.id === item.id);
    }
    add(item) {
        const trabajo = trabajos.find((trabajo) => trabajo.id === item.id);
        if (!trabajo) {
            trabajos.push(item);
            return item;
        }
        else {
            return;
        }
    }
    update(item) {
        const trabajoIdx = trabajos.findIndex((trabajo) => trabajo.id === item.id);
        if (trabajoIdx !== -1) {
            trabajos[trabajoIdx] = { ...trabajos[trabajoIdx], ...item };
        }
        return trabajos[trabajoIdx];
    }
    delete(item) {
        const trabajoIdx = trabajos.findIndex((trabajo) => trabajo.id === item.id);
        if (trabajoIdx !== -1) {
            trabajos[trabajoIdx].estado = false;
            const deletedTrabajo = trabajos[trabajoIdx];
            return deletedTrabajo;
        }
    }
}
//# sourceMappingURL=trabajos.repository.js.map