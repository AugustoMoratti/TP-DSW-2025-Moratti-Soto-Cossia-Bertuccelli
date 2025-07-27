import crypto from 'node:crypto';
export class Provincia {
    constructor(nombre, estado, id = crypto.randomUUID()) {
        this.nombre = nombre;
        this.estado = estado;
        this.id = id;
    }
}
//# sourceMappingURL=provincia.entity.js.map