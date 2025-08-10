import crypto from 'crypto';
export class Trabajo {
    constructor(id = crypto.randomUUID(), estado = true, montoTotal) {
        this.id = id;
        this.estado = estado;
        this.montoTotal = montoTotal;
    }
} //REVISAR DEPENDENCIAS Y DATOS
//# sourceMappingURL=trabajos.entity.js.map