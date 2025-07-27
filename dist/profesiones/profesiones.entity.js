import crypto from 'node:crypto';
export class Profesiones {
    constructor(nombreProf, descProf, estado, codProf = crypto.randomUUID()) {
        this.nombreProf = nombreProf;
        this.descProf = descProf;
        this.estado = estado;
        this.codProf = codProf;
    }
}
//# sourceMappingURL=profesiones.entity.js.map