import crypto from 'crypto';
export class Profesion {
    constructor(nombreProf, descProf, estado, codProf = crypto.randomUUID()) {
        this.nombreProf = nombreProf;
        this.descProf = descProf;
        this.estado = estado;
        this.codProf = codProf;
    }
}
//# sourceMappingURL=profesion.entity.js.map